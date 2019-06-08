import React, { Component } from 'react';
import { TYPING,MESSAGE_SENT } from '../../events';
const ss = require('socket.io-stream');
const SocketIOFileUpload = require('socketio-file-upload');

export default class ChatHeader extends Component{
    state = {
        typingUsers : []
    }
    componentDidUpdate = () =>{
        setTimeout(()=>{  
            this.setState({typingUsers:[]})
        },2000)
        if(this.props.socket && this.props.chat.chatId ){
            const {socket,chat} = this.props
           
            socket.on(`${TYPING}-${chat.chatId}`,(sender)=>{
                let typingUsers = this.state.typingUsers
               
                if(!typingUsers.find((el)=>el===sender)){
                    this.setState({typingUsers:[...typingUsers,sender]})
                }
            })
          }
    }

    uploadImage = (e) =>{
//     console.log(file)
//         const {socket,chat} = this.props
//         socket.emit("slice upload",socket)
// var uploader = new SocketIOFileUpload(socket);
// uploader.listenOnInput(document.getElementById("file-input"));
var file = e.target.files[0];
var stream = ss.createStream();
const {socket,chat,senderId} = this.props
// upload a file to the server.
console.log(chat)

ss(socket).emit('image-upload', chat.chatId,senderId,"","image",file.name,stream );
const blobStream = ss.createBlobReadStream(file);
let size = 0;
 
blobStream.on('data', function(chunk) {
  size += chunk.length;
  console.log(Math.floor(size / file.size * 100) + '%');
  // -> e.g. '42%'
});
 
blobStream.pipe(stream);
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
                    
                    <input type="file" id="file-input" style={{display:"none"}} accept="image/*" onChange={this.uploadImage}/>
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




