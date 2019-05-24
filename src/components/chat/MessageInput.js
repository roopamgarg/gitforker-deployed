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
        console.log(this.state.messageInput) 
        socket.emit(MESSAGE_SENT,chatId,senderId,messageInput)
        console.log(chatId,messageInput)
        // setPreviousMessages(chatId,messageInput)
        this.setState({messageInput:""})
       
    }
    sendTyping = () =>{
        console.log("calling")
        const { socket,sender,reciever,chatId } = this.props
        socket.emit(SEND_TYPING,sender,reciever,chatId)
    }
    render(){
        return ( 
            <form onSubmit={(e)=>this.onSubmitHandler(e)} className="message-input">
                <textarea
                 placeholder="Type Your Message Here."
                 onChange={(e)=>this.setState({messageInput:e.target.value})} 
                 value={this.state.messageInput}
                 className="message-input__textarea"
                 required
                 onInput={this.sendTyping}
                 />
                <button type="submit" className="message-input__btn"><i class="fas fa-paper-plane"></i></button>
            </form>
        )
    }
}