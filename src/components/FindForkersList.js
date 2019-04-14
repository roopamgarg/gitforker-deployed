import React,{Component} from 'react';
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
  }
}`
class FindForkerList extends Component{
    state={
        data : []
    }
    async findForkers(forker_search){
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
                return <UserCard username={user.login} image={user.avatar_url} score={user.score}/>;
                
            })

        }
    }
    render(){
        return(
        
            <div className="list ">
                <h2 className="dashboard__header">FIND FORKERS</h2>

                <input className="list__search" onChange={(e) =>this.findForkers(e.target.value)} placeholder="Search..." type="text"/>
               
                <ul className="list__content">
                    {this.renderCards()}
                    
                </ul> 
            </div>
   
        )
    }
}



export default withApollo(FindForkerList);