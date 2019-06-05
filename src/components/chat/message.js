import React,{Component} from 'react';
import ReactMarkdown from 'react-markdown';


class Message extends Component{
    state = {
        seenBy:[]
    }

    isSeened = (message) =>{
       return message.receiver.every((receiver)=>{
            return this.state.seenBy.includes(receiver)
        })
    }
    componentWillMount(){
        const {message} = this.props;

        this.setState({
            seenBy:message.seenBy
        })
    }
    componentDidMount = () =>{
        const {message,socket,sender} = this.props;

      
        if(message.sender===sender && !this.isSeened(message)){
            console.log(message)
            console.log(`SEEN-${message._id}`)
            socket.on(`SEEN-${message._id}`,(receiverId)=>{
                console.log("RG called me",receiverId)
                const seenBy = [...this.state.seenBy,receiverId]
                this.setState({
                    seenBy
                })
            })
        }
    }
    render(){
        const {message,sender,senderId} = this.props;
     
        return (<div className={`${(message.sender===sender)?"right":""} message-container__message-box`}>
        <div className="message-container__message-content">
            <div className="message-container__message">
                {
                ((message.message_type && message.message_type === "text") || !message.message_type)?
                <ReactMarkdown
                className="markdown-body"
                source={message.message}
                skipHtml={true}
                />:<img src={message.image} alt="image"/>
                }
            </div>
            
        </div> 
        {/* <p className="message-container__time"></p>  */}
        {
                (message.seenBy && message.sender===sender && this.isSeened(message))?
                <p className="message-container__time">
                    <i class="fa fa-eye" aria-hidden="true"></i><span>{message.time}</span>    
                </p>:
                <p className="message-container__time">{message.time}</p>
        }
    </div>)
    }
}

export default Message