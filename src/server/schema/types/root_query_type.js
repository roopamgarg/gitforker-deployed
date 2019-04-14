const graphql = require('graphql');
const axios = require('axios')
const { GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,

 } = graphql;
const UserType = require('./user_type')
const SearchUserType = require('./search_user_details')
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    user:{
      type:UserType,
      resolve(parentValue, args, req){
        console.log(req.user)
        return axios.get(`https://api.github.com/users/${req.user.username}`)
        .then((res)=>res.data)
      },
    },
    search:{
      type:new GraphQLList(SearchUserType),
        args:{
          username:{type:new GraphQLNonNull(GraphQLString)}
        },
        resolve(parentValue, args, req){
         console.log("hello")
          return axios.get(`https://api.github.com/search/users?q=${args.username}`)
                  .then((res)=>res.data.items)
        }
    },
      search_one:{
        type:UserType,
        args:{
          username:{type:new GraphQLNonNull(GraphQLString)}
        },
        resolve(parentValue, args, req){
         
          return axios.get(`https://api.github.com/users/${args.username}?client_id=557b8d28c7dccdaaba2b&client_secret=ec085662e1d2d678f607c429cdf8584450a3e939`)
                  .then((res)=>res.data)
                  .catch((err)=>console.log(err))
        }
    },
    followers:{
      type:new GraphQLList(SearchUserType),
        args:{
          username:{type:GraphQLString}
        },
        resolve(parentValue, args, req){
          console.log(args.username)
         if(args.username == null){
          return axios.get(`https://api.github.com/users/${req.user.username}/followers`)
                  .then((res)=>res.data)
         }else{
          return axios.get(`https://api.github.com/users/${args.username}/followers`)
          .then((res)=>res.data)
         }
        }
      },
        following:{
          type:new GraphQLList(SearchUserType),
            args:{
              username:{type:GraphQLString}
            },
            resolve(parentValue, args, req){
              console.log(args.username)
             if(args.username == null){
              return axios.get(`https://api.github.com/users/${req.user.username}/following`)
                      .then((res)=>res.data)
             }else{
              return axios.get(`https://api.github.com/users/${args.username}/following`)
              .then((res)=>res.data)
             }
            }
    }
    
  
  }
});

module.exports = RootQueryType;
