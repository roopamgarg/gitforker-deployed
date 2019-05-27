import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import {IS_USER_CONNECTED} from '../events'

class UserCard extends Component{
    state = {
        isUserOnline:false,
        onlineCheck:false
    }
    
    componentWillMount = ()=>{
        console.log("tried")
        const { socket,gitForkerUserId } = this.props;  
        
      
        if(!this.state.onlineCheck){
            
            socket.on(`${gitForkerUserId}-connected`,()=>{
                console.log("connnneccccteddd")
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
            console.log("tried888787")
            socket.emit(IS_USER_CONNECTED,gitForkerUserId)
                 
            
        
        }
    }
    render(){
        const {isUserOnline} = this.state;
        const {username,image} = this.props
        return(
            <Link to={`/find_forker/${username}`}>
            <div className="user-card u-display-flex u-justify-content-space-evenly u-align-items-center">
                <div className="user-card__image ">
                    <img src={image} alt="user pic"/>
                </div>
                <div className="user-card__details flex-fill u-text-left">
                    <h3>{username}</h3>
                   
                </div>
            <div className="user-card__current-status u-display-flex u-justify-content-center u-align-items-center u-flex-column flex-fill">
                    {
                        (isUserOnline)?
                        <div className="user-card__online">
                        </div>:<div></div>
                   }
                    {/* <div className="user-card__msg u-display-flex u-justify-content-center u-align-items-center">
                        9+
                    </div> */}
                </div>
            </div>
            </Link>
        )
    }
}

export default UserCard;