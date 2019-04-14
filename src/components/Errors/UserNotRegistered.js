import React,{Component,Fragment} from 'react';

export default class UserNotRegistered extends Component{

    state = {
        invitationSent : false
    }

    sendInvition = () =>{
        fetch(`/api/send_invitation/${this.props.username}/${this.props.email}`)
        .then((res)=>{
            return res.json()
        })
        .then((res)=>{
            this.setState({ invitationSent : true})
        })
    }
    

    render(){
        const { invitationSent } = this.state
        return (
            <div className="non-registered-user">
                {
                    (!invitationSent)?(
                        <Fragment>
                        <p className="non-registered-user__message">Invite {this.props.username} to create there account on GitForker.</p>
                        <div><button onClick={this.sendInvition} className="non-registered-user__invite-btn">SEND INVITAION</button></div>
                        </Fragment>
                    ):(
                    <p className="non-registered-user__message">You Have Successfully Invited {this.props.username}. </p>
                    )
                }
               
               
            </div>
        )
    }
    
}