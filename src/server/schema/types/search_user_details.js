const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat
} = graphql;

const SearchUserType = new GraphQLObjectType({
    name: 'SearchUserType',
    fields:{
       login:{type:GraphQLString},
       avatar_url:{type:GraphQLString},
       gravatar_id:{type:GraphQLString},
       type:{type:GraphQLString},
       site_admin: {type:GraphQLBoolean},
       score:{type:GraphQLFloat},
       gitForkerUserId:{
        type:GraphQLID,
       async resolve(parents,args){
            const user = await User.findOne({username:parents.login})
            return user ? user.id : null
        }
    }
    }
})

module.exports = SearchUserType