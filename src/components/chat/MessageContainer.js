import React,{Component} from 'react'
import ReactMarkdown from 'react-markdown'


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
        const {messages,sender} = this.props;
        return (
            <div id="message-container" ref={el => { this.el = el; }} onScroll={()=>this.setState({someData:"90"})} className={`message-container `}  >
          
                { 
                   
                    messages.map((message)=>{
                    return( <div className={`${(message.sender===sender)?"right":""} message-container__message-box`}>
                                <div className="message-container__message-content">
                                    <div className="message-container__message"> <ReactMarkdown
                                    className="markdown-body"
                                     source={message.message}
                                     skipHtml={true}
                                     /> </div>
                                    
                                </div> 
                                <p className="message-container__time">{message.time}</p> 
                            </div>)
                    })
                }
                
          
             
            </div>
        )
    }
}