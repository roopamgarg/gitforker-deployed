import React,{Component} from 'react';
// import { fork } from 'child_process';

class ProjectCard extends Component{
    gradientGenerator(){
        const gradients = [
            'bluish-gradient',
            'redish-gradient',
            'greenish-gradient',
         
        ]
        var min=0; 
        var max=gradients.length;  
        var random = Math.floor(Math.random() * (+max - +min) + +min);
        return gradients[random];
    }
    render(){
        const {name,language,forks,stars,issues} = this.props;
        return(
            <div className={`project-card ${this.gradientGenerator()}`}>
            <div className="project-card__content">
                <h2 className="project-card__heading">{name}</h2>
                <p className="project-card__language">{`${language} `}</p>
            </div>
            <div className="project-card__points">
                <div className="project-card__points__card">
                    <p className="project-card__points__data">{forks}</p>
                    <p className="project-card__points__data">Forks</p>
                </div>
                <div className="project-card__points__card">
                    <p className="project-card__points__data">{stars}</p>
                    <p className="project-card__points__data">Stars</p>
                </div>
                <div className="project-card__points__card">
                    <p className="project-card__points__data">{issues}</p>
                    <p className="project-card__points__data">issues</p>
                </div>
            </div>    
        </div>
        )
    }
}

export default ProjectCard;