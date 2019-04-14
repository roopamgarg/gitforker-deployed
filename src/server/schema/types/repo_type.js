const graphql = require('graphql');
const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
} = graphql;

const RepoType = new GraphQLObjectType({
    name: 'RepoType',
    fields:{
      id:{type:GraphQLString},
      name:{type:GraphQLString},
      private:{type:GraphQLBoolean},
      html_url:{type:GraphQLString},
      fork:{type:GraphQLBoolean},
      forks_url:{type:GraphQLString},
      hooks_url:{type:GraphQLString},
      branches_url:{type:GraphQLString},
      languages_url:{type:GraphQLString},
      created_at:{type:GraphQLString},
      updated_at:{type:GraphQLString},
      pushed_at:{type:GraphQLString},
      clone_url:{type:GraphQLString},
      language:{type:GraphQLString},
      licence:{type:GraphQLString},
      forks:{type:GraphQLInt},
      watchers:{type:GraphQLInt},
      stargazers_count:{type:GraphQLInt},
      open_issues:{type:GraphQLInt}



    }
})

module.exports = RepoType