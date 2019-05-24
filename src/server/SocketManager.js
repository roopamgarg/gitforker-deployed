const fs = require('fs');
let onlineUsers = {};
const siofu = require("socketio-file-upload");
const mongoose = require("mongoose");
const models = require("./models");
const allChats = mongoose.model("allChats");
const User = mongoose.model("user");
const Messages = mongoose.model("messages");
const { USER_CONNECTED, CREATE_CHAT, MESSAGE_SENT ,MESSAGE_RECIEVED, SEND_TYPING,TYPING,IS_USER_CONNECTED } = require("../events");
const io = require('./server.js').io

const SocketManager = (socket)=>{
  ////////////////////////////////////////////////////////////
    socket.on(USER_CONNECTED, async (username, setUser) => {
      const userInfo = await User.findOne({ username: username });
      const user = createUser({ username, socketId:socket.id , userId:userInfo.id});
      io.emit(`${userInfo.id}-connected`,true)
      addUserToOnlineUsersList(user);
      const chatHistory = await getAllPeviousChats(userInfo.chatsIdArray);
      console.log(onlineUsers)
      setUser(user, chatHistory);
    });
  ////////////////////////////////////////////////////////////
  
    socket.on(CREATE_CHAT, async (username, recievers, setPreviousMessages) => {
      if (!Array.isArray(recievers)) {
        const users = await User.find({//Fteching All the users that are part of chat
          $or: [{ username: username }, { username: recievers }]
        });
       
        let currentUser = users.filter(user => (user.username == username));
        currentUser = currentUser[0];//Getting Current User who creates the chat
        
        const usersIdArray = users.map(user => user._id);//Creating User id array
        const usernamesArray = [username,recievers];//Creating Usernames array
      
        let chat = await allChats.findOne({ users: usersIdArray });//findig if the chatroom is already exist
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
            messages: await getAllPreviousMessages(chat.messages),
            users:usernamesArray
          };
        }catch(err){
          console.error(err)
        }
        }
        
        setPreviousMessages(newChat)
      }
    });
  ////////////////////////////////////////////////////////////
    socket.on(MESSAGE_SENT,async (chatId,senderId,message)=>{
     
      const chat =await allChats.findById(chatId)

      const user =await User.findById(senderId)
   
      sender = user._id;

      const senderName = user.username;
      const reciever = chat.users.filter((id) =>String(id) !== String(sender))
      let messageBody = await createMessage({message,sender})
      let newMessage = await new Messages(messageBody)
      chat.messages.push(newMessage._id)
      messageBody.sender = senderName
      io.emit(`${MESSAGE_RECIEVED}-${reciever[0]}`,messageBody,chatId)
      io.emit(`${MESSAGE_SENT}-${sender}`,messageBody,chatId)
      await newMessage.save();
      await chat.save();
    })

    socket.on(IS_USER_CONNECTED,(userId)=>{
      console.log("helllllllll")

      for(let key in onlineUsers){
        console.log(key)
       if(onlineUsers[key].userId === userId){
     
        io.emit(`${userId}-connected`)
       }
      }
    })
  ////////////////////////////////////////////////////////////
    socket.on(SEND_TYPING,(sender,reciever,chatId)=>{
      
      socket.broadcast.emit(`${TYPING}-${chatId}`,sender)
    })
  ////////////////////////////////////////////////////////////


  socket.on('disconnect', function () {
    io.emit('user disconnected');
    onlineUsers[socket.id] ? io.emit(`${onlineUsers[socket.id].userId}-disconnected`) : null
    removeFromOnlineUsersList(socket.id)

  });
    
// let files = {};
// let struct = { 
//         name: null, 
//         type: null, 
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


  const createMessage =async ({message="",sender="",time=getCurrentTime(),date=getCurrentDate()}={})=>(
    {
      message,
      sender,
      time,
      date
    }
  )
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
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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
  
  const getAllPreviousMessages = async messagesIdArray => {
    const messages = await Promise.all(messagesIdArray.map(async id => {
        let message = await Messages.findById(id)
        const sender = await getUserById(message.sender)
        message = JSON.parse(JSON.stringify(message))//Converting Mongo Object into normal JS object
        message.sender = sender
        return message
        }))
       
    return messages;
  };
  /////////////////////////////////////////////////////////////////////////////
  
  const uuid = require("uuid/v4");
  /////////////////////////////////////////////////////////////////////////////
  
  const addUserToOnlineUsersList = ({username,socketId,userId}) => {
    if (!isUserAlreadyOnline(socketId)) {
      onlineUsers[socketId] = {username,userId}
    console.log("online user list")
    console.log(onlineUsers)
    }
  };


  const removeFromOnlineUsersList = socketId =>{
    delete  onlineUsers[socketId]
    console.log("online user list")
    console.log(onlineUsers)
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
