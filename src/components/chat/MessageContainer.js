import React,{Component} from 'react'
import Message from './message';
import {GET_OLD_MESSAGES} from '../../events';

export default class MessageContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            maxheight : 0,
            typingUsers : [],
            pageNo:0
        }
    }
    
    
    componentDidMount() {
    
        this.el.scrollTop = this.el.scrollHeight
        this.setState({maxheight:this.el.scrollHeight})
      }
    
      componentDidUpdate(prevProps) {
          console.log("----------------")
        const {chat,senderId,socket,messages} = this.props;
        console.log(this.el.scrollTop,messages.length)
        console.log(this.el.scrollHeight,this.state.maxheight)
       //this.el.scrollTop !== this.state.maxheight &&
       if(messages.length - prevProps.messages.length > 1 && messages.length > 11){
        this.el.scrollTop = this.state.maxheight
       }
        if( (messages.length - prevProps.messages.length === 1 ||( messages.length <= 11 && messages.length > 0 && prevProps.messages.length ===0))){
          console.log("ytytytttyty")
            this.el.scrollTop = this.el.scrollHeight
        }
        if(this.el.scrollTop === 0 && messages.length > this.state.pageNo*10){
            const pageNo = this.state.pageNo + 1
            this.setState({
                pageNo
            },()=>{
                socket.emit(GET_OLD_MESSAGES,pageNo,chat.chatId,senderId)
            })
            
        }
    }
    
    render(){
        const {messages,sender,senderId,chatRoomSocket,socket} = this.props;
        return (
            <div id="message-container" ref={el => { this.el = el; }} onScroll={()=>this.setState({someData:"90"})} className={`message-container `}  >
          
                { 
                   
                    messages.map((message)=>{
                     console.log(message)
                    return <Message message={message} sender={sender} senderId={senderId} socket={socket} chatRoomSocket={chatRoomSocket}/>
                    })
                }
                
          
             
            </div>
        )
    }
}