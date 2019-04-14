import React, { Component } from 'react';
import {BrowserRouter,Route} from 'react-router-dom'
import './App.css';
import IndexPage from './pages/index'
import Dashboard from './pages/Dashboard'
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import LoginVerification from './components/HOC/loginVerification'

const client = new ApolloClient({
  link: new HttpLink({uri:'https://gitforker.herokuapp.com/graphql'}),
  cache: new InMemoryCache()

});

class App extends Component {
  render() {

    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
         <div className="App">
              <Route path="/" exact component={IndexPage}/>
              <Route path="/dashboard" exact component={LoginVerification(Dashboard)}/>
              <Route path="/dashboard/:user" exact component={LoginVerification(Dashboard)}/>
              <Route path="/find_forker" exact component={LoginVerification(Dashboard)}/>
              <Route path="/find_forker/:id" exact component={LoginVerification(Dashboard)}/>
              

          </div>
          
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
