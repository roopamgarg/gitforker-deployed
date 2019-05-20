import React,{Component} from 'react';
import Tilt from 'react-tilt'
import {Link} from 'react-router-dom'
 
class IndexPage extends Component{

    login = () =>{
        fetch('/auth/github/',{credentials:'same-origin'})
        .then((res)=>{
            return res.json()
        }).then(res=>{
            console.log(res)
        })
    }
    render = () =>(
    <div className="index-page u-display-flex ">
        <div className="index-page__left u-display-flex u-justify-content-center u-align-items-center ">
        <Tilt className="Tilt u-display-flex u-justify-content-center u-align-items-center" options={{ max : 25 , perspective:1000}} >
                   <img src={require('../img/banner-right.png')} alt="gitforker bannar"/>
        </Tilt>
 
        </div>
        <div className="index-page__right flex-fill u-display-flex u-flex-column">
        
        <div className=" icon-container u-display-flex u-justify-content-space-between">
        <Tilt className="Tilt" options={{ max : 25 , perspective:100}} >
         
            <img className="drop-icon" src={require('../img/FORKERS.png')} style={{width:"125px",height:"45px"}}/>
            </Tilt>
        <Tilt className="Tilt" options={{ max : 25 , perspective:100}} >
         
            <img className="drop-icon" src={require('../img/drop-up.png')}/>
            </Tilt>
        
        
        </div> 
        <div className="index-page__content flex-fill u-display-flex u-flex-column u-justify-content-center u-align-items-end" >
        <h1 className="index-page__header">Let's get connected with the people's who loves to code</h1>
        <Tilt className="Tilt" options={{ max : 25 , perspective:100}} >
        <a href="/auth/github/"><button className="index-page__btn ">Login With Github</button></a>
        </Tilt>
        </div>
        <div className="icon-container u-display-flex u-justify-content-space-between u-align-items-baseline">
        <Tilt className="Tilt" options={{ max : 25 , perspective:100}} >
            
            <img className="drop-icon" src={require('../img/drops.png')}/>
            </Tilt>
            <Tilt className="Tilt" options={{ max : 25 , perspective:100}} >
         
            <img className="text-logo" src={require('../img/FORKERS.png')}/>
          
            </Tilt>
        </div>
        </div>
    </div>
    )
}

export default IndexPage