const graphql = require('graphql');
const axios = require('axios')
const mongoose = require('mongoose');
const User = mongoose.model('user');

const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    
} = graphql;
const RepoType = require('./repo_type')


const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields:{
        // id:{type:GraphQLID},
        // githubId:{type:GraphQLString},
        // username:{type:GraphQLString},
        login:{type:GraphQLString},
        node_id:{type:GraphQLString},
        avatar_url:{type:GraphQLString},
        gravatar_id:{type:GraphQLString},
        url:{type:GraphQLString},
        html_url:{type:GraphQLString},
        followers_url:{type:GraphQLString},
        following_url:{type:GraphQLString},
        gists_url:{type:GraphQLString},
        starred_url:{type:GraphQLString},
        subscription_url:{type:GraphQLString},
        organization_url:{type:GraphQLString},
        repos_url:{type:GraphQLString},
        repos:{
            type:GraphQLList(RepoType),
            resolve(parents,args){
                return axios.get(`${parents.repos_url}`)
                .then((res)=>res.data)  
            }
        },
        isGitforkerUser:{
            type:GraphQLBoolean,
           async resolve(parents,args){
                const user = await User.findOne({username:parents.login})
                return (user)?true:false;
            }
        },
        gitForkerUserId:{
            type:GraphQLID,
           async resolve(parents,args){
                const user = await User.findOne({username:parents.login})
                return user ? user.id : null
            }
        },
        events_url:{type:GraphQLString},
        
        received_events_url:{type:GraphQLString},
        type:{type:GraphQLString},
        site_admin:{type:GraphQLBoolean},
        name:{type:GraphQLString},
        company:{type:GraphQLString},
        blog:{type:GraphQLString},
        location:{type:GraphQLString},
        email:{type:GraphQLString},
        hireable:{type:GraphQLBoolean},
        bio:{type:GraphQLString},
        public_repos:{type:GraphQLInt},
        public_gists:{type:GraphQLInt},
        followers:{type:GraphQLInt},
        following:{type:GraphQLInt},
        created_at:{type:GraphQLString},
        updated_at:{type:GraphQLString}

    }
})

module.exports = UserType