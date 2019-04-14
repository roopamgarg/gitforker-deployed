import React, { Component } from 'react';
import { TYPING } from '../../events';


export default class ChatHeader extends Component{
    state = {
        typingUsers : []
    }
    componentDidMount = () =>{
        setInterval(()=>{  
            this.setState({typingUsers:[]})
        },2000)
        if(this.props.socket && this.props.chat.chatId ){
            const {socket,chat} = this.props
            console.log(`${TYPING}-${chat.chatId}`);
            socket.on(`${TYPING}-${chat.chatId}`,(sender)=>{
                let typingUsers = this.state.typingUsers
                console.log(sender , typingUsers)
               
                if(!typingUsers.find((el)=>el===sender)){
                this.setState({typingUsers:[...typingUsers,sender]})
               
                }
            })
          }else{
              console.log(this.props)
    
          }
    }
     render() {
    const { typingUsers } = this.state
    const {chatName,image} = this.props
        return(
            <div class="chat-header">
                    <div className="user-card__image ">
                        <img  src={image} alt="gitforker dp"/>    
                    </div>
                    <div className="chat-header__name">
                    <div>{chatName}</div>
                    <p>
                    { 
                        (typingUsers.length > 0)?
                        <p className="u-text-center">{`${typingUsers.join(",")} is typing...`}</p>:
                        <div></div>
                    
                    }
                    </p>
                    </div>
                    <div className="chat-header__options">
                    <i class="fas fa-paperclip"></i>
                    <i class="fas fa-paperclip"></i>                   
                    <i class="fas fa-paperclip"></i>
                    </div>
               </div>
        )
    }
    
}