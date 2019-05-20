import React,{Component} from 'react';
import PersonalChatInfoCard from './PersonalChatInfoCard';
class ChatList extends Component{
    getRecieverName = (currentUser,users = [])=>{
        console.log(users)
       const reciever = users.filter((user)=>user !== currentUser)
       return reciever[0];
    }
    render(){
    const {chatHistory,user} = this.props;

        return(
            <div className="list ">
                <h2 className="dashboard__header">CHAT</h2>
                <input className="list__search" placeholder="Search..." type="text"/>
                {
                    (chatHistory.length === 0)?
                    <div className="empty">
                    Find Any Forker to start the chat
                    </div>:<div></div>
                }
                
                <ul className="list__content"> 
                {
                    console.log(chatHistory)
                }
                {
                   chatHistory.map((chat)=>{
                       console.log(chat.users)
                     return <PersonalChatInfoCard chatName={this.getRecieverName(user,chat.users)}/>
                   })
                
                }
                </ul>
                {/*
                   
                    <li><UserCard/></li>
                    <li><UserCard/></li>
                    <li><UserCard/></li>
                    <li><UserCard/></li>
                    <li><UserCard/></li>
                    <li><UserCard/></li>
                    <li><UserCard/></li>

                    
                < */}
            </div>
        )
    }
}

export default ChatList