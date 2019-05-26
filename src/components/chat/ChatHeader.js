import React, { Component } from 'react';
import { TYPING } from '../../events';
const SocketIOFileUpload = require('socketio-file-upload');

export default class ChatHeader extends Component{
    state = {
        typingUsers : []
    }
    componentDidUpdate = () =>{
        setInterval(()=>{  
            this.setState({typingUsers:[]})
        },2000)
        if(this.props.socket && this.props.chat.chatId ){
            const {socket,chat} = this.props
           
            socket.on(`${TYPING}-${chat.chatId}`,(sender)=>{
                let typingUsers = this.state.typingUsers
              
               console.log("someone is typing")
                if(!typingUsers.find((el)=>el===sender)){
                this.setState({typingUsers:[...typingUsers,sender]})
               
                }
            })
          }else{
              
    
          }
    }

    uploadImage = (file) =>{
    
        const {socket,chat} = this.props
        socket.emit("slice upload",socket)
var uploader = new SocketIOFileUpload(socket);
uploader.listenOnInput(document.getElementById("file-input"));
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
                    
                    <input type="file" id="file-input" style={{display:"none"}} onChange={(e)=>this.uploadImage(e.target.files[0])}/>
                        <label for="file-input">
                            <i class="fas fa-paperclip"></i> 
                        </label>
                    
                    {/* <i class="fas fa-paperclip"></i>                   
                    <i class="fas fa-paperclip"></i> */}
                    </div>
               </div>
        )
    }
    
}




