import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import gql from 'graphql-tag';
import {graphql,withApollo} from 'react-apollo';
import {IS_USER_CONNECTED,NEW_MESSAGE} from '../../events'

const query = gql`
query Search($username:String!){
	search_one(username:$username){
    avatar_url
    gitForkerUserId
  }
}
`;
class PersonalChatInfoCard extends Component{
   
    state = {
        isUserOnline:false,
        onlineCheck:false,
        seenBy:this.props.lastMessage.seenBy
    }
    
formatLastMessage = (message) =>{
    if(message){
    message = message.split("")
    return message.length > 20 ? (message.slice(0,20).join("") + "...") : message.join("")
    }
    return "Start new Chat"
}


componentDidUpdate = ()=>{
    
    const { data,socket } = this.props;  
    
  
    if(!data.loading && data.search_one && !this.state.onlineCheck){
        const {gitForkerUserId} = data.search_one
        socket.on(`${gitForkerUserId}-connected`,()=>{
            
            this.setState({
                isUserOnline:true,
                onlineCheck:true
            })
        })

        socket.on(`${gitForkerUserId}-disconnected`,()=>{
            this.setState({
                isUserOnline:false,
                onlineCheck:true
            })
        })
        
        socket.emit(IS_USER_CONNECTED,gitForkerUserId)
        
             
        
    
    }
}
componentWillMount = ()=>{
    console.log("tried")
    const { data,socket,lastMessage } = this.props;  
    const { seenBy } = this.state;
    
  
    if(!data.loading && data.search_one && !this.state.onlineCheck){
        const {gitForkerUserId} = data.search_one
        socket.on(`${gitForkerUserId}-connected`,()=>{
            
            this.setState({
                isUserOnline:true,
                onlineCheck:true
            })
        })

        socket.on(`${gitForkerUserId}-disconnected`,()=>{
            this.setState({
                isUserOnline:false,
                onlineCheck:true
            })
        })
       
        socket.emit(IS_USER_CONNECTED,data.search_one.gitForkerUserId)

        if(seenBy && !seenBy.includes(data.search_one.gitForkerUserId)){
            console.log(`${NEW_MESSAGE}-${lastMessage._id}`)
            console.log(lastMessage)
            socket.on(`${NEW_MESSAGE}-${lastMessage._id}`,(receiverId)=>{
               console.log("called")
                const seenBy = [...this.state.seenBy,receiverId]
                this.setState({
                    seenBy
                })
            },()=>{
                console.log(this.state.seenBy)
            })  
        }
        
    
    }
}
    isLastMessageSeened = () =>{
        const { userId } = this.props;
        const { seenBy } = this.state;
       
       
        return (seenBy)?seenBy.includes(userId):null
    }
    render(){
        const { data,lastMessage,chatName,userId } = this.props;  
        const { isUserOnline } = this.state;   

        
        if(!data.loading && data.search_one){
           
        return(
            <Link to={`/dashboard/${chatName}`} >
            <div className="user-card u-display-flex u-justify-content-space-evenly u-align-items-center" >
                <div className="user-card__image ">
                    <img src={data.search_one.avatar_url} alt="user pic"/>
                </div>
                <div className="user-card__details flex-fill u-text-left">
                    <h3>{chatName}</h3>
                    <p>{this.formatLastMessage(lastMessage.message)}</p>
                </div>
                <div className="user-card__current-status u-display-flex u-justify-content-center u-align-items-center u-flex-column flex-fill">
                   {
                        (isUserOnline)?
                        <div className="user-card__online">
                        </div>:<div></div>
                   }
                   {
                        (!this.isLastMessageSeened())?
                        <div className="user-card__unseen-message">
                        </div>:<div></div>
                   }
                    {/* <div className="user-card__msg u-display-flex u-justify-content-center u-align-items-center">
                        9+
                    </div> */}
                </div>
            </div>
            </Link>
        )
        }else{
            return  <div className="user-card u-display-flex u-justify-content-space-evenly u-align-items-center" >
            <div className="user-card__image ">
                <img src={require('../../img/user.svg')} alt="user pic"/>
            </div>
            <div className="user-card__details flex-fill u-text-left">
                <h3>{""}</h3>
                <p>{""}</p>
            </div>
            
        </div>
        }
    }
}

export default  graphql(query,{
    options:(props)=> {return { variables: {username : props.chatName}}}
 })(PersonalChatInfoCard); 