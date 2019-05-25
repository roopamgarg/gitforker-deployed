import React,{Component} from 'react';
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer'
import MessageInput from './MessageInput';
import gql from 'graphql-tag';
import {graphql,withApollo} from 'react-apollo';
import Loader from '../Loader';
import {CREATE_CHAT} from '../../events';
import UserNotRegistered from '../Errors/UserNotRegistered';

const query = gql`
query Search($username:String!){
	search_one(username:$username){
    login
    avatar_url
    bio   
    email
    isGitforkerUser
  }
}
`;


 class PersonalChatContainer extends Component{

    
    componentDidUpdate = () =>{
     const { socket,user,data,messages,setPreviousMessages,chat } = this.props;  
     console.log(chat) 
        if(!data.loading && data.search_one && data.search_one.isGitforkerUser && messages.length === 0){
            socket.emit(CREATE_CHAT,user,data.search_one.login,setPreviousMessages);
        }
    }
    
//     componentWillReceiveProps = (prevProps) =>{
//      console.log(this.props)
//      const { socket,user,data,setPreviousMessages,resetChatMessages } = this.props;   
//      console.log(prevProps.reciever)
//      console.log(this.props.reciever)
//      if(!data.loading && data.search_one && data.search_one.isGitforkerUser && (prevProps.data !== this.props.data || prevProps.reciever !== this.props.reciever)){
//          socket.emit(CREATE_CHAT,user,data.search_one.login,setPreviousMessages);
//      }
//  }
    componentDidUnmount = () =>{
     const { resetChatMessages } = this.props;  
      
     resetChatMessages();
    }
//  getSnapshotBeforeUpdate = (prevProps) => {
//         const { socket,user,data,setPreviousMessages,resetChatMessages } = this.props;   
//         console.log(this.props.reciever)
//         console.log(prevProps.reciever)
//         if(!data.loading && data.search_one && data.search_one.isGitforkerUser && (prevProps.data !== this.props.data || prevProps.reciever !== this.props.reciever)){
//             socket.emit(CREATE_CHAT,user,data.search_one.login,setPreviousMessages);
//         }
//     } 
  
    render(){
        const { socket,user,userId,data,chat,messages,setPreviousMessages,timestamp } = this.props; 
    
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
              
               <ChatHeader socket={socket} chat={chat} chatName={data.search_one.login} image={data.search_one.avatar_url}/>
                <MessageContainer sender={user} reciever={data.search_one.login} messages={messages} chat={chat} setPreviousMessages={setPreviousMessages} socket={socket}/>
                <MessageInput socket={socket} chatId={chat.chatId} senderId={userId} reciever={data.search_one.login} setPreviousMessages={setPreviousMessages} />
            </div>
        )
        }
    
}
}


export default graphql(query,{
    options:(props)=> {return { variables: {username : props.reciever}}}
 })(PersonalChatContainer);