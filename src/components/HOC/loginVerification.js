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
        
        return (!this.props.data.loading)?
        <WrappedComponent {...this.props}  />:
        <Loader/>
    }
}
return graphql(query)(withRouter(requireAuth));
}