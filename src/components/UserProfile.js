import React,{Component} from 'react';
import ProjectCard from './ProjectCard';
import {graphql,withApollo} from 'react-apollo';
import Loader from './Loader';
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'

const query = gql`
query Search($username:String!){
	search_one(username:$username){
    login
    avatar_url
    bio
    followers
    following
    public_repos
    repos{
      name
      language
      forks
      stargazers_count
      open_issues
    }
    
  }
}

`;

class UserProfile extends Component{
    renderProjects(repos){
        console.log("true")
       return repos.map((element)=>{
          return  <ProjectCard
                    name={element.name}
                    language={element.language}
                    forks={element.forks}
                    stars={element.stargazers_count}
                    issues={element.open_issues}
          />
        })
    }
    render(){
        console.log(this.props);

        if(this.props.data.loading){
            return <Loader/>
        }
        const {login,avatar_url,followers,following,public_repos,bio,repos} = this.props.data.search_one;
        return(
           
            <div className="user-profile u-display-flex">
                <div className="user-profile__left">
                    <div>
                    <div>
                        <img className="profile-pic--lg" src={avatar_url} alt="gitforker dp"/>
                    </div>
                    </div>
                    <div className="user-profile__details">
                        <h2>{login}</h2>
                        <p>{bio}</p>
                    </div>
                    <div className="user-profile__btns">
                        <p>
                        <button className="btn__green">Hireable</button>
                        </p>
                        <p>
                        <Link to={`/dashboard/${login}`}><button className="btn__purple">Let's talk</button></Link>
                        </p>
                    </div>

                </div>
                <div className="user-profile__right  flex-fill">
                    <div className="user-profile__social u-display-flex u-justify-content-space-around">    
                        <div className="user-profile__social__cards">
                            <p>{followers}</p>
                            <p>Followers</p>
                        </div>
                        <div className="user-profile__social__cards">
                            <p>{public_repos}</p>
                            <p>Repos</p>
                        </div>
                        <div className="user-profile__social__cards">
                            <p>{following}</p>
                            <p>Following</p>
                        </div>
                    </div>
                    <div className="user-profile__project-cards__container">
                    {this.renderProjects(repos)}
                  
                </div>
                </div>
              
            </div>

        )
    }
}

export default graphql(query,{
    options:(props)=> {return { variables: {username : props.id}}}
 })(UserProfile);