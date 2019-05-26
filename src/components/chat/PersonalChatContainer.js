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
    email
    isGitforkerUser
  }
}
`;


 class PersonalChatContainer extends Component{

    render(){
        console.log("4. render")
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
                <MessageInput socket={socket} chatId={chat.chatId} senderId={userId} sender={user} reciever={data.search_one.login} setPreviousMessages={setPreviousMessages} />
            </div>
        )
        }
    
}
}


export default graphql(query,{
    options:(props)=> {return { variables: {username : props.reciever},fetchPolicy:'no-cache',onCompleted:function(){
        props.resetChatMessages(props.user,props.reciever);
    }}}
 })(PersonalChatContainer);