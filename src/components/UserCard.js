import React,{Component} from 'react';
import {Link} from 'react-router-dom'

class UserCard extends Component{
    render(){
        
        return(
            <Link to={`/find_forker/${this.props.username}`}>
            <div className="user-card u-display-flex u-justify-content-space-evenly u-align-items-center">
                <div className="user-card__image ">
                    <img src={this.props.image} alt="user pic"/>
                </div>
                <div className="user-card__details flex-fill u-text-left">
                    <h3>{this.props.username}</h3>
                   
                </div>
            <div className="user-card__current-status u-display-flex u-justify-content-center u-align-items-center u-flex-column flex-fill">
            <div className="user-card__online"> 
                    </div>
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