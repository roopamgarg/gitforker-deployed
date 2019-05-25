import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import gql from 'graphql-tag';
import {graphql,withApollo} from 'react-apollo';
import {IS_USER_CONNECTED} from '../../events'

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
        isUserOnline:false
    }
    
    
    componentDidMount = () => {
        const { data } = this.props;  
       
        if(!data.loading && data.search_one ){
        const {gitForkerUserId} = data.search_one
        const socket = this.props.socket;
     
        
        socket.on(`${gitForkerUserId}-connected`,(data)=>{
            this.setState({
                isUserOnline:true
            })
        })

        socket.on(`${gitForkerUserId}-disconnected`,()=>{
            this.setState({
                isUserOnline:false
            })
        })
      
        
    }
}

componentWillMount = ()=>{
    const { data,socket } = this.props;  
    if(!data.loading && data.search_one){
        socket.emit(IS_USER_CONNECTED,data.search_one.gitForkerUserId)
    }
}
    render(){
        const { data } = this.props;  
        const { isUserOnline } = this.state;   

    
        if(!data.loading && data.search_one){
           
        return(
            <Link to={`/dashboard/${this.props.chatName}`}>
            <div className="user-card u-display-flex u-justify-content-space-evenly u-align-items-center">
                <div className="user-card__image ">
                    <img src={data.search_one.avatar_url} alt="user pic"/>
                </div>
                <div className="user-card__details flex-fill u-text-left">
                    <h3>{this.props.chatName}</h3>
                    <p>{this.props.lastMessage}</p>
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
        }else{
            return <div>Loading...</div>
        }
    }
}

export default  graphql(query,{
    options:(props)=> {return { variables: {username : props.chatName}}}
 })(PersonalChatInfoCard);