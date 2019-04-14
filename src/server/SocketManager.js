let onlineUsers = [];
const mongoose = require("mongoose");
const models = require("./models");
const allChats = mongoose.model("allChats");
const User = mongoose.model("user");
const Messages = mongoose.model("messages");
const { USER_CONNECTED, CREATE_CHAT, MESSAGE_SENT ,MESSAGE_RECIEVED, SEND_TYPING,TYPING } = require("../events");
const io = require('./server.js').io

const SocketManager = (socket)=>{
    console.log("made socket connection", socket.id);
  
    socket.on(USER_CONNECTED, async (username, setUser) => {
      addUserToOnlineUsersList(username);
      const user = createUser({ username, socketId: socket.id });
      const userInfo = await User.findOne({ username: username });
      const chatHistory = await getAllPeviousChats(userInfo.chatsIdArray);
      setUser(user, chatHistory);
    });
  
    socket.on(CREATE_CHAT, async (username, recievers, setPreviousMessages) => {
      if (!Array.isArray(recievers)) {
        const users = await User.find({
          $or: [{ username: username }, { username: recievers }]
        });
        let currentUser = users.filter(user => (user.username = username));
        currentUser = currentUser[0];
  
        const usersIdArray = users.map(user => user._id);
        const usernamesArray = [username,recievers];
      
        let chat = await allChats.findOne({ users: usersIdArray });
        let newChat = {};
  
        if (!chat) {
        
  
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
            typingUsers: [],
            users:usernamesArray
          };
        } else {
          try{
          newChat = {
            chatId: chat.id,
            chatName: "personal",
            messages: await getAllPreviousMessages(chat.messages),
            typingUsers: [],
            users:usernamesArray
          };
        }catch(err){
          console.error(err)
        }
        }
       
        setPreviousMessages(newChat)
        // addChat(createChat(newChat));
      }
    });
  
  
    socket.on(MESSAGE_SENT,async (chatId,sender,message)=>{
      const chat =await allChats.findById(chatId)

      const user =await User.findOne({username:sender})
   
      sender = user._id;
      
      const senderName = user.username;
      const reciever = chat.users.filter((id) =>String(id) !== String(sender))
     
      const recieverName = await getUserById(reciever[0])
     
      let messageBody = await createMessage({message,sender})
      let newMessage = await new Messages(messageBody)
      chat.messages.push(newMessage._id)
      
     
      messageBody.sender = senderName
        
      console.log(recieverName,senderName);
      io.emit(`${MESSAGE_RECIEVED}-${recieverName}`,messageBody)
      io.emit(`${MESSAGE_SENT}-${senderName}`,messageBody)
      await newMessage.save();
      await chat.save();
    })

    socket.on(SEND_TYPING,(sender,reciever,chatId)=>{
      console.log(chatId)
      console.log("hello")
      socket.broadcast.emit(`${TYPING}-${chatId}`,sender)
    })
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
  
    const user = await User.findById(id);
    return user.username
  };
  const getMessageForId = messageId => Messages.findById(messageId);
  
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
  
  const uuid = require("uuid/v4");
  
  const addUserToOnlineUsersList = username => {
    if (isUserAlreadyOnline(username)) {
      onlineUsers.push(username);
    }
  };
  
  const isUserAlreadyOnline = username => {
    return username in onlineUsers;
  };
  
  const createUser = ({ username = "", socketId = null } = {}) => ({
    username,
    socketId
  });
  
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
  
  module.exports = SocketManager
