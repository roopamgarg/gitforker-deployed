import React,{Component} from 'react'
import { MESSAGE_SENT,SEND_TYPING } from '../../events';
export default class MessageInput extends Component{
    state = {
        messageInput:""
    }
    onSubmitHandler= (e) =>{
        e.preventDefault();
        const { socket,senderId,chatId,reciever,setPreviousMessages } = this.props
        const { messageInput } = this.state
     
        socket.emit(MESSAGE_SENT,chatId,senderId,messageInput)
   
        // setPreviousMessages(chatId,messageInput)
        this.setState({messageInput:""})
       
    }
    sendTyping = () =>{

        const { socket,sender,reciever,chatId } = this.props
        socket.emit(SEND_TYPING,sender,reciever,chatId)
    }
    render(){
        return ( 
            <form onSubmit={(e)=>this.onSubmitHandler(e)} className="message-input">
                <textarea
                 placeholder="Type Your Message Here."
                 onChange={(e)=>{this.setState({messageInput:e.target.value});this.sendTyping()}}
                 value={this.state.messageInput}
                 className="message-input__textarea"
                 required
               
                 />
                <button type="submit" className="message-input__btn"><i class="fas fa-paper-plane"></i></button>
            </form>
        )
    }
}