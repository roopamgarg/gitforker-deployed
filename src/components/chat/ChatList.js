import React,{Component} from 'react';
import PersonalChatInfoCard from './PersonalChatInfoCard';
class ChatList extends Component{
    getRecieverName = (currentUser,users = [])=>{
        
       const reciever = users.filter((user)=>user !== currentUser)
       return reciever[0];
    }
    render(){
    const {chatHistory,user,userId,setLastMessage} = this.props;

        return(
            <div className="list ">
                {/* <h2 className="dashboard__header">CHAT</h2> */}
                <input className="list__search" placeholder="Search Chat" type="text"/>
                {
                    (chatHistory.length === 0)?
                    <div className="empty">
                    Find Any Forker to start the chat
                    </div>:<div></div>
                }
                
                <ul className="list__content"> 
                
                {
                   chatHistory.map((chat,index)=>{
                    
                        console.log(chat)
                    
                     return <PersonalChatInfoCard 
                                    key={chat.chatId}
                                    chatName={this.getRecieverName(user,chat.users)} 
                                    socket={this.props.socket} 
                                    lastMessage={(chat.lastMessage)?chat.lastMessage:""}
                                    userId={userId}
                                    />
                   })
                
                }
                </ul>
               
            </div>
        )
    }
}

export default ChatList