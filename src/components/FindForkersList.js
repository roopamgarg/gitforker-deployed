import React,{Component} from 'react';
import _ from 'lodash';
import UserCard from './UserCard';
import gql from 'graphql-tag'
import {graphql,withApollo} from 'react-apollo';
import { ApolloConsumer } from 'react-apollo';
const searchQuery = gql`
query Search($username:String!){
	search(username:$username){
    login
    avatar_url
     score
     gitForkerUserId

  }
}`
class FindForkerList extends Component{
    
        state = {
            data : [],
            forker_search:""
        }
    
    
     findForkers =async () => {
        const {forker_search} = this.state;
        console.log(forker_search)
       const {data} = await this.props.client.query({
                    query: searchQuery,
                    variables: { username:forker_search }
            
                    })
                    console.log(data.search)
                   this.setState({
                       data:data.search 
                   })
            }
            

    renderCards = () =>{
        if(this.state.data.length === 0){
            return(
                <div className="empty">
                   Enter name of any forker you know
                </div>
            )
        }else{
            
           return this.state.data.map((user)=>{
                return <UserCard 
                            socket={this.props.socket}
                             gitForkerUserId={user.gitForkerUserId}
                            username={user.login} 
                            image={user.avatar_url} 
                            score={user.score}
                            />;
                
            })

        }
    }
    inputChangeHandler = (e)=>{
        console.log(e.target.value)
        this.setState({forker_search:e.target.value});
       
    }
    render =() =>{
        return(
        
            <div className="list ">
                <h2 className="dashboard__header">FIND FORKERS</h2>

                <input className="list__search" 
                        value={this.state.forker_search} 
                        onInput={ _.debounce(this.findForkers, 250, {
                            'maxWait': 1000
                        }, false)} 
                        onChange={this.inputChangeHandler} placeholder="Search..." type="text"
                        />
               
                <ul className="list__content">
                    {this.renderCards()}
                    
                </ul> 
            </div>
   
        )
    }
}



export default withApollo(FindForkerList);