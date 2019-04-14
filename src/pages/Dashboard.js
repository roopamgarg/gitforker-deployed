import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import {Link} from 'react-router-dom'
import ChatList from '../components/chat/ChatList';
import FindForkerList from '../components/FindForkersList';
import UserProfile from '../components/UserProfile';
import PersonalChatContainer from '../components/chat/PersonalChatContainer';
import io from 'socket.io-client';
import {USER_CONNECTED,MESSAGE_RECIEVED,MESSAGE_SENT} from '../events'
const socketUrl = "http://localhost:4000";

class Dashboard  extends Component{


    state = {
        socket : null,
        user : null,
        chatHistory:[],
        activeChat:{},
        currentChatMessages:[]
    }
    componentWillMount(){
       
        this.initSocket()
        
    }


    setUser = (user,chatHistory=[]) =>{ 
        this.setState({user,chatHistory});
    }
    initSocket = () =>{
        const { data } = this.props;
        const socket = io()
        socket.on('connect',()=>{
            console.log("Connected with " + data.user.login);
            socket.emit(USER_CONNECTED,data.user.login,this.setUser)
            socket.on(`${MESSAGE_RECIEVED}-${data.user.login}`,(newMessage)=>{
                const oldMessages = this.state.currentChatMessages;
                this.setState({
                    currentChatMessages:[...oldMessages,newMessage]
                })
             
            })
            socket.on(`${MESSAGE_SENT}-${data.user.login}`,(newMessage)=>{
                const oldMessages = this.state.currentChatMessages;  
                this.setState({
                    currentChatMessages:[...oldMessages,newMessage]
                })
              
            })
        })
  
        this.setState({socket})

    }

    setPreviousMessages = (chat) =>{  
      
        this.setState({currentChatMessages:chat.messages},()=>{

        this.addChat({
                chatId:chat.chatId,
                chatName:chat.chatName,
                lastMessage:chat.messages[chat.messages.length-1],
                users:chat.users
            })
        })
    
        
        
       }
    addChat = (chat) =>{
      
        const oldChatHistory = this.state.chatHistory;
        const isPreviousChat = oldChatHistory.filter(({id})=>(chat.id === id))
        if(isPreviousChat.length < 1){
        this.setState({
            chatHistory:[chat,...oldChatHistory],
            activeChat:chat
        });
        }else{
            this.setState({
                activeChat:chat
            });
        }
       
    }
    
   
    render(){
        return(
            <div className="dashboard u-display-flex">
                <div className="dashboard__left u-display-flex">
                       <div className="dashboard__sidenav">
                            <div>
                                <img className="profile-pic--lg" src={this.props.data.user.avatar_url} alt="gitforker dp"/>
                            </div>
                            <ul>
                            <Link to="/dashboard"><li>Chat</li></Link>
                            <Link to="/find_forker"><li>Find Forkers</li></Link>
                            <Link to="/find_forker">  <li>Settings</li></Link>
                            
                            </ul>
                       </div>
        
                       <div className="dashboard__list">
                           <Route path="/dashboard" component={()=><ChatList 
                                                                        chatHistory={this.state.chatHistory}
                                                                        user={this.props.data.user.login}
                                                                        />}/>
                           <Route path="/find_forker" component={FindForkerList}/>
                           
                            
                       </div>
                </div>
                <div className="dashboard__right">
                
              

                    <Route path="/dashboard/:user"  component={()=><PersonalChatContainer 
                                                                            setPreviousMessages={this.setPreviousMessages}
                                                                            messages={this.state.currentChatMessages}
                                                                            socket={this.state.socket}
                                                                            user={this.props.data.user.login}
                                                                            reciever={this.props.match.params.user}
                                                                            addChat={this.addChat}
                                                                            chat={this.state.activeChat}
                                                                        />} />
                    <Route path="/find_forker/:id"  component={()=><UserProfile id={this.props.match.params.id}/>}/>

                </div>

            </div>
        )
    }
}
export default Dashboard;