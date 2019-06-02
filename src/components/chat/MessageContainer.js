import React,{Component} from 'react'
import Message from './message'

export default class MessageContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            maxheight : 0,
            typingUsers : []
        }
    }
    
    
    componentDidMount() {
    
        this.el.scrollTop = this.el.scrollHeight
        this.setState({maxheight:this.el.scrollHeight})
      }
    
      componentDidUpdate(prevProps) {
        console.log(this.props.messages)
      
        if( this.el.scrollTop !== this.state.maxheight && this.props.messages.length !== prevProps.messages.length){
            this.el.scrollTop = this.el.scrollHeight
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