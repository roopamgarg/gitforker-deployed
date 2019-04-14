const graphql = require('graphql');
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
       score:{type:GraphQLFloat}
    }
})

module.exports = SearchUserType