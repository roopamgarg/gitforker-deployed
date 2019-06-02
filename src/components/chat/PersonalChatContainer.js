import React,{Component} from 'react';
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer'
import MessageInput from './MessageInput';
import gql from 'graphql-tag';
import {graphql,withApollo} from 'react-apollo';
import Loader from '../Loader';
import  SITE_URL from '../../siteurl'
import {CLOSE_CHAT_ROOM} from '../../events';
import io from 'socket.io-client';
import UserNotRegistered from '../Errors/UserNotRegistered';

const query = gql`
query Search($username:String!){
	search_one(username:$username){
    login
    avatar_url
    email
    isGitforkerUser
    gitForkerUserId
  }
}
`;


 class PersonalChatContainer extends Component{
    
     

    componentWillUnmount(){
     
        this.props.chatRoomSocket.emit(CLOSE_CHAT_ROOM,this.props.chat.chatId,this.props.userId)
      
    
}
    render(){
        
        const { socket,user,userId,data,chat,messages,setPreviousMessages,chatRoomSocket } = this.props; 
    
        if(data.loading){
            return <Loader/>
        } 
        else if(!data.search_one){
            return <div>User Not EXIST</div> 
        }
        else if(!data.search_one.isGitforkerUser){
           
            return <UserNotRegistered username={data.search_one.login} email={data.search_one.email}/>
        }
        else{
        return(
            <div className="chat-container">
               <ChatHeader 
                    socket={socket} 
                    chat={chat} 
                    chatName={data.search_one.login} 
                    image={data.search_one.avatar_url}
                />
                <MessageContainer 
                    sender={user}
                    senderId={userId} 
                    reciever={data.search_one.login} 
                    messages={messages} chat={chat} 
                    setPreviousMessages={setPreviousMessages} 
                    
                    socket={socket}
                />
                <MessageInput 
                    socket={socket} 
                    chatId={chat.chatId} 
                    senderId={userId} 
                    sender={user} 
                    reciever={data.search_one.login} 
                    setPreviousMessages={setPreviousMessages} 
                />
            </div>
        )
        }
    
}
}


export default graphql(query,{
    options:(props)=> {return { variables: {username : props.reciever},fetchPolicy:'no-cache',onCompleted:function(){
        props.resetChatMessages(props.user,props.userId,props.reciever);
        
    }}}
 })(PersonalChatContainer);