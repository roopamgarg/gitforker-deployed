import React , {Component} from 'react';
import { graphql, renderToStringWithData } from 'react-apollo';
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import Loader from '../Loader';
const query = gql`
query{
    user{
      login
      avatar_url
      gitForkerUserId
    }
}`


export default (WrappedComponent) =>{
    class requireAuth extends Component{
        componentWillUpdate(nextProps){
            
            if(!nextProps.data.loading && !nextProps.data.user){
                this.props.history.push('/');
                
            }
            return (nextProps.data.user)
        }

    render(){
        
        const { loading,user } = this.props.data 
        return (!loading && user)?
        <WrappedComponent {...this.props}  />:
        <Loader/>
    }
}
return graphql(query)(withRouter(requireAuth));
}