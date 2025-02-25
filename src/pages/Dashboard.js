import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import {Link} from 'react-router-dom'
import ChatList from '../components/chat/ChatList';
import  SITE_URL from '../siteurl'
import FindForkerList from '../components/FindForkersList';
import UserProfile from '../components/UserProfile';
import PersonalChatContainer from '../components/chat/PersonalChatContainer';
import io from 'socket.io-client';
import {USER_CONNECTED,MESSAGE_RECIEVED,MESSAGE_SENT,CREATE_CHAT,CLOSE_CHAT_ROOM,SET_OLD_MESSAGES,GET_OLD_MESSAGES} from '../events'

class Dashboard  extends Component{


    state = {
        socket : null,
        chatRoomSocket : null,
        user : null,
        chatHistory:[],
        activeChat:{},
        currentChatMessages:[]
    }
    componentDidMount(){
       
        this.initSocket()
        
    }

    resetChatMessages = (user=null,userId=null,reciever=null) =>{
        const {activeChat,chatRoomSocket} = this.state
        if(chatRoomSocket){
            console.log(activeChat.chatId,chatRoomSocket.id)
            chatRoomSocket.emit(CLOSE_CHAT_ROOM,activeChat.chatId,userId)
        }
        this.setState({
           activeChat:{},
            currentChatMessages:[],
           
        },()=>{
            if(user && reciever){
            this.state.socket.emit(CREATE_CHAT,user,reciever,this.setPreviousMessages);
            }
        })
    }
    setUser = (user,chatHistory=[]) =>{ 
        this.setState({user,chatHistory})
        console.log(chatHistory)
        
    }
    initSocket = () =>{
        const { data } = this.props;
        const socket = io()
        socket.on('connect',()=>{
          //  console.log("Connected with " + data.user.login);
            socket.emit(USER_CONNECTED,data.user.login,this.setUser)
           
            socket.on(`${MESSAGE_RECIEVED}-${data.user.gitForkerUserId}`,(newMessage,chatId)=>{
                console.log("called")
                const oldMessages = this.state.currentChatMessages;
                const {sender} = newMessage;
                const {users} =  this.state.activeChat;
                this.setLastMessage(chatId,newMessage)
                if(users && users.includes(sender)){
                this.setState({
                    currentChatMessages:[...oldMessages,newMessage]
                })
                }
             
            })
            socket.on(`${MESSAGE_SENT}-${data.user.gitForkerUserId}`,(newMessage,chatId)=>{
                console.log("called")
                const oldMessages = this.state.currentChatMessages;  
                this.setLastMessage(chatId,newMessage)
                this.setState({
                    currentChatMessages:[...oldMessages,newMessage]
                })
              
            })
            socket.on(SET_OLD_MESSAGES,(oldMessages)=>{
                const prevMessages = this.state.currentChatMessages;  
               
                this.setState({
                    currentChatMessages:[...oldMessages,...prevMessages]
                })
            })

        })
  
        this.setState({socket})

    }

    setPreviousMessages = (chat) =>{  
      console.log(chat)
        this.setState({
            currentChatMessages:chat.messages, 
            chatRoomSocket : io.connect(`${SITE_URL}/chatroom-${chat.chatId}`)
        },()=>{
       //     console.log(chat.messages)
        this.addChat({
                chatId:chat.chatId,
                chatName:chat.chatName,
                lastMessage:chat.messages[chat.messages.length-1],
                users:chat.users 
            })
        })
      
    
        
        
       }
    addChat = (chat) =>{
      console.log(chat)
        const oldChatHistory = this.state.chatHistory;
        const isPreviousChat = oldChatHistory.filter(({chatId})=>(chat.chatId === chatId))
        if(isPreviousChat.length < 1){//if chat is not present already
        this.setState({
            chatHistory:[chat,...oldChatHistory],
            activeChat:chat
        });
        }else{
            console.log("oldChat")
            const previousChat = this.state.chatHistory.map((oldChat)=>{
                if(oldChat.chatId === chat.chatId){
                    oldChat.lastMessage = chat.lastMessage

                }
                return oldChat;
            })
            this.setState({
               chatHistory:previousChat,
                activeChat:chat
            });
        }
       
    }
    
    setLastMessage = (chatId,lastMessage) =>{
       // console.log("/>?>?>?>>?")
        
        const chatHistory = this.state.chatHistory
        chatHistory.forEach((chat,index) => {
            if(chat.chatId === chatId){
                chat.lastMessage = lastMessage
               
                const otherChats = this.state.chatHistory.filter((chat)=>chat.chatId !== chatId)
                this.setState({
                    chatHistory:[chat,...otherChats]
                },()=>{
             //       console.log(this.state.chatHistory)
             //       console.log(this.state.currentChatMessages)
                })

            }
        })
       
    }
    render(){
        return(
            <div className="dashboard u-display-flex">
                <div className="dashboard__left ">
                       <div className="dashboard__sidenav u-display-flex u-justify-content-space-between u-align-items-center">
                            <div>
                                <img className="profile-pic--sm" src={this.props.data.user.avatar_url} alt="gitforker dp"/>
                            </div>
                           <div className="u-display-flex">
                            <Link to="/dashboard"><p><i class="fas fa-comments"></i></p></Link>
                            <Link to="/find_forker"><p><i class="fas fa-users"></i></p></Link>
                            {/* <Link to="/find_forker">  <p>Settings</p></Link> */}
                            </div>
                            
                       </div>
        
                       <div className="dashboard__list">
                           <Route path="/dashboard" component={()=><ChatList 
                                                                        chatHistory={this.state.chatHistory}
                                                                        user={this.props.data.user.login}
                                                                        userId={this.props.data.user.gitForkerUserId}
                                                                        socket={this.state.socket}
                                                                       
                                                                        />}/>
                           <Route path="/find_forker" component={()=><FindForkerList 
                                                                         socket={this.state.socket}                
                                                                        />}/>
                           
                            
                       </div>
                </div>
                <div className="dashboard__right">
                
              

                    <Route path="/dashboard/:user"  render={()=><PersonalChatContainer 

                                                                            resetChatMessages={this.resetChatMessages}
                                                                            setPreviousMessages={this.setPreviousMessages}
                                                                            messages={this.state.currentChatMessages}
                                                                            socket={this.state.socket}
                                                                            chatRoomSocket={this.state.chatRoomSocket}
                                                                            user={this.props.data.user.login}
                                                                            userId={this.props.data.user.gitForkerUserId}
                                                                            reciever={this.props.match.params.user}
                                                                            addChat={this.addChat}
                                                                            chat={this.state.activeChat}
                                                                            setLastMessage={this.setLastMessage}
                                                                        />} />
                    <Route path="/find_forker/:id"  component={()=><UserProfile id={this.props.match.params.id}/>}/>

                </div>

            </div>
        )
    }
}
export default Dashboard;