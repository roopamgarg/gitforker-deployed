const fs = require('fs');
var path = require('path');
let onlineUsers = {};
let chatRooms = {};
global.chatRoomSocket = null;
global.socket = null;

const { SITE_URL } = require("./config/keys");

const siofu = require("socketio-file-upload");
var ss = require('socket.io-stream');
const mongoose = require("mongoose");
const uuidv1 = require('uuid/v1');
const models = require("./models");
const allChats = mongoose.model("allChats");
const User = mongoose.model("user");
const Messages = mongoose.model("messages");
const { 
  USER_CONNECTED,
  CREATE_CHAT, 
  MESSAGE_SENT,
  MESSAGE_RECIEVED, 
  SEND_TYPING,
  TYPING,
  IS_USER_CONNECTED,
  CLOSE_CHAT_ROOM,
  NEW_MESSAGE,
  SEEN
} = require("../events");
const io = require('./server.js').io

const SocketManager = (socket)=>{
  global.socket = socket
  ////////////////////////////////////////////////////////////
    socket.on(USER_CONNECTED, async (username, setUser) => {
      const userInfo = await User.findOne({ username: username });
      const user = createUser({ username, socketId:socket.id , userId:userInfo.id});
      io.emit(`${userInfo.id}-connected`,true)
      addUserToOnlineUsersList(user);
      const chatHistory = await getAllPeviousChats(userInfo.chatsIdArray);
    
      setUser(user, chatHistory);
    });
  ////////////////////////////////////////////////////////////
  
    socket.on(CREATE_CHAT, async (username, receivers, setPreviousMessages) => {
      if(!username && !receivers){
        return
      }
      if (!Array.isArray(receivers)) {
        const users = await User.find({//Fteching All the users that are part of chat
          $or: [{ username: username }, { username: receivers }]
        });
       
        let currentUser = users.filter(user => (user.username == username));
        currentUser = currentUser[0];//Getting Current User who creates the chat
        
        const usersIdArray = users.map(user => user._id);//Creating User id array
        const usernamesArray = [username,receivers];//Creating Usernames array
      
        let chat = await allChats.findOne({ users: usersIdArray });//finding if the chatroom is already exist
        let newChat = {};

       
        
        
        if (!chat) {//if chatroom is not already exist then we creating a new chatroom
        
  
          chat = await new allChats({
            users: usersIdArray,
            time_of_creation: getCurrentTime(),
            date_of_creation: getCurrentDate()
          }).save();
          users.forEach(async user => {
            user.chatsIdArray.push(chat._id);
  
            await user.save();
          });
  
          newChat = {
            chatId: chat.id,
            chatName: "personal",
            messages: [],
            users:usernamesArray
          };
        } else {
          try{
          newChat = {
            chatId: chat.id,
            chatName: "personal",
            messages: await getAllPreviousMessages(chat.messages,currentUser.id),
            users:usernamesArray
          };
        }catch(err){
          console.error(err)
        }
        }
       
        io.of(`/chatroom-${chat.id}`).on('connection',(chatRoomSocket)=>{
          global.chatRoomSocket = chatRoomSocket
          if(!chatRooms[chat.id]){
            chatRooms[chat.id] = [currentUser.id]
          }else{
            if(!chatRooms[chat.id].includes(currentUser.id))
            chatRooms[chat.id] = [currentUser.id,...chatRooms[chat.id]]
          }
          onlineUsers[socket.id] ? onlineUsers[socket.id].activeChat = chat.id : null
          
          chatRoomSocket.join(chat.id);

          chatRoomSocket.on(CLOSE_CHAT_ROOM,(chatId,userId)=>{        
            if(chatRooms[chatId]){
              chatRooms[chatId] = chatRooms[chatId].filter((data)=>data !== userId) 
             }
              if(chatRooms[chatId] && (chatRooms[chatId].length === 0 || !chatRooms[chatId].length)){
                delete chatRooms[chatId];
              }
            chatRoomSocket.disconnect()
           
          })
          
        
        })
        setPreviousMessages(newChat);
      }
    });
      ////////////////////////////////////////////////////////////
      socket.on(MESSAGE_SENT,async (chatId,senderId,message,message_type="text")=>{
      
        const chat =await allChats.findById(chatId)
  
        const user =await User.findById(senderId)
     
        sender = user._id;
  
        const senderName = user.username;
  
        const receiver = chat.users.filter((id) =>String(id) !== String(sender))
        const onlineReceivers = getOnlineReceiversInRoom(chatId,sender)
        let messageBody;
        if(message_type === "text"){
           messageBody = await createMessage({message,sender,receiver,seenBy:onlineReceivers})
        }
        let newMessage = await new Messages(messageBody)
        chat.messages.push(newMessage._id)
        
        newMessage = await newMessage.save();
        messageBody.sender = senderName
        messageBody['_id'] = newMessage._id
        io.emit(`${MESSAGE_RECIEVED}-${receiver[0]}`,messageBody,chatId)
        io.emit(`${MESSAGE_SENT}-${sender}`,messageBody,chatId)
        
      
        await chat.save();
      
       
      })
  ////////////////////////////////////////////////////////////
    ss(socket).on('image-upload',async (chatId,senderId,message,message_type="image",filename=null,stream=null)=>{
      console.log(chatId,senderId,message,message_type,filename)
      const chat =await allChats.findById(chatId)

      const user =await User.findById(senderId)
   
      sender = user._id;

      const senderName = user.username;

      const receiver = chat.users.filter((id) =>String(id) !== String(sender))
      const onlineReceivers = getOnlineReceiversInRoom(chatId,sender)
      let messageBody;
    if(message_type === "image"){
        console.log("image called")
        filename = uuidv1()+filename
        stream.pipe(fs.createWriteStream(`uploads/${filename}`));
         messageBody = await createMessage({message_type,message,image:`/uploads/${filename}`,sender,receiver,seenBy:onlineReceivers})
      }
      let newMessage = await new Messages(messageBody)
      chat.messages.push(newMessage._id)
      
      newMessage = await newMessage.save();
      messageBody.sender = senderName
      messageBody['_id'] = newMessage._id
      io.emit(`${MESSAGE_RECIEVED}-${receiver[0]}`,messageBody,chatId)
      io.emit(`${MESSAGE_SENT}-${sender}`,messageBody,chatId)
      
    
      await chat.save();
    
     
    })

    socket.on(IS_USER_CONNECTED,(userId)=>{
      

      for(let key in onlineUsers){
        
       if(onlineUsers[key].userId === userId){

        io.emit(`${userId}-connected`)
       }
      }
    })
  ////////////////////////////////////////////////////////////
    socket.on(SEND_TYPING,(sender,receiver,chatId)=>{
     
      socket.broadcast.emit(`${TYPING}-${chatId}`,sender)
    })
  ////////////////////////////////////////////////////////////


  socket.on('disconnect', function () {
    io.emit('user disconnected');
    if(onlineUsers[socket.id]){
        const {activeChat,userId} = onlineUsers[socket.id];

        if(chatRooms[activeChat]){
          chatRooms[activeChat] = chatRooms[activeChat].filter((data)=>data !== userId) 
        }
        if(chatRooms[activeChat] && (chatRooms[activeChat].length === 0 || !chatRooms[activeChat].length)){
          delete chatRooms[activeChat];
        }
    }
    onlineUsers[socket.id] ? io.emit(`${onlineUsers[socket.id].userId}-disconnected`) : null
    removeFromOnlineUsersList(socket.id)
  });
  ////////////////////////////////////////////////
  // ss(socket).on('image-upload', (stream,chatId,senderId,filename,message="") => {
  //   //  filename = uuidv1()+filename
  //   // //sentImage(chatId,senderId,message,"image",image=filename)
  //   // io.emit(MESSAGE_SENT,chatId,senderId,message,"image",filename)

  //   // stream.pipe(fs.createWriteStream(`src/server/uploads/${filename}`));
  // });
    
// let files = {};
// let struct = { 
//         name: null, 
//         message_type: null, 
//         size: 0, 
//         data: [], 
//         slice: 0, 
//     };
//     socket.on('slice upload',function(socket){
//       var uploader = new siofu();
//       uploader.dir = "/path/to/save/uploads";
//       uploader.listen(socket);
//   });
  };


  //////////////FACTORY FUNCTIONS/////////////////////////////////////////

  const  sentImage= (chatId,senderId,message,image) =>{
   // global.socket.emit(MESSAGE_SENT,chatId,senderId,message,"image",image)
  }

  const createMessage =async ({message_type="text",message="",image=null,sender="",receiver=[],time=getCurrentTime(),date=getCurrentDate(),seenBy=[]}={})=>{
   
  
     return {
      message_type,
      image,
      message,
      sender,
      receiver,
      time,
      date,
      seenBy
    }
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  const getOnlineReceiversInRoom = (chatId,senderId) =>{
  
   return chatRooms[chatId] ? chatRooms[chatId].filter((userId)=>userId !== senderId) : []
  }
  /////////////////////////////////////////////////////////////////////////////
  const getIdByUser =async username =>{
    user =await User.find({username:username})

    return user._id;
  }
  const getCurrentDate = () => {
    const date = new Date();
    return`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
  
  const getCurrentTime = () => {
        const currentTime = new Date();
        const currentOffset = currentTime.getTimezoneOffset();
        const ISTOffset = 330;   // IST offset UTC +5:30 
        const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
        // ISTTime now represents the time in IST coordinates
        const hoursIST = ISTTime.getHours()
        const minutesIST = ISTTime.getMinutes()
    return `${hoursIST}:${minutesIST}`
  }
  
  
  const getAllPeviousChats = async (chatsIdArray=[]) => { 
   
    
    const chats =  await Promise.all(chatsIdArray.map(async id => {
      //Fetching chat collection for all chatid that current user have
      const chat = await allChats.findById(id);
  
     
      const users =  await Promise.all(chat.users.map( userId => getUserById(userId)));
  
      const chatObj = {
        chatId: chat.id,
        chatName: chat.name,
        lastMessage: chat.messages.length>0?await getMessageForId(
          chat.messages[chat.messages.length - 1]
        ):[],
        users
      };
  
      return createChatHistory(chatObj);
    }));
  
   
    return chats;
  };
  
  const getUserById = async id => {
 
  const allusers = await User.find({});

    const user = await User.findById(id);


    return user.username
  };

  /////////////////////////////////////////////////////////////////////////////

  const getMessageForId = messageId => Messages.findById(messageId);
  
  /////////////////////////////////////////////////////////////////////////////

  const createChatHistory = ({ 
    chatId = "",
    chatName = "",
    lastMessage = "",
    users = []
  } = {}) => ({
    chatId,
    chatName, 
    lastMessage,
    users
  });

  /////////////////////////////////////////////////////////////////////////////
  
  const getAllPreviousMessages = async (messagesIdArray,currentUser) => {
   
    const messages = await Promise.all(messagesIdArray.map(async id => {
        let message = await Messages.findById(id)
        const sender = await getUserById(message.sender)
      
        if(message.seenBy && !message.seenBy.includes(currentUser) && JSON.parse(JSON.stringify(message.sender)) !== JSON.parse(JSON.stringify(currentUser)) ){
           await Messages.updateOne({'_id':message.id},{'$set':{'seenBy':[currentUser,...message.seenBy]}})
           message.seenBy = [currentUser,...message.seenBy]
            console.log(`${NEW_MESSAGE}-${message._id}`);
           global.socket.emit(`${NEW_MESSAGE}-${message._id}`,currentUser)
          io.emit(`${SEEN}-${message._id}`,currentUser)
        }
       message = JSON.parse(JSON.stringify(message))    //Converting Mongo Object into normal JS object
        message.sender = sender
       
        return message 
        }))
    return messages;
  };
  /////////////////////////////////////////////////////////////////////////////
  
  const uuid = require("uuid/v4");
  /////////////////////////////////////////////////////////////////////////////
  
  const addUserToOnlineUsersList = ({username,socketId,userId,activeChat=""}) => {
    if (!isUserAlreadyOnline(socketId)) {
      onlineUsers[socketId] = {username,userId,activeChat}
   
    }
  };


  const removeFromOnlineUsersList = socketId =>{
    delete  onlineUsers[socketId]
  
  }
  /////////////////////////////////////////////////////////////////////////////
  
  const isUserAlreadyOnline = username => {
    return username in onlineUsers;
  };
  /////////////////////////////////////////////////////////////////////////////
  
  const createUser = ({ username = "", socketId = null , userId = ""} = {}) => ({
    username,
    socketId,
    userId
  });
  /////////////////////////////////////////////////////////////////////////////
  
  const createChat = ({
    chatId = "",
    chatName = "personal",
    messages = [],
    typingUsers = []
  } = {}) => ({
    chatId,
    chatName,
    messages,
    typingUsers
  });
  /////////////////////////////////////////////////////////////////////////////
  
  module.exports = SocketManager
