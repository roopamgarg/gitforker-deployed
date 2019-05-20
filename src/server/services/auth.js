const passport = require('passport');
const mongoose = require('mongoose');
const GitHubStrategy = require('passport-github').Strategy;
const User = mongoose.model('user');
const siteUrl = require('../../siteurl');
const keys = require('../config/keys')
const {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} = keys;



passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
  

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${siteUrl}/auth/github/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
       console.log(accessToken)
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    const user = await User.findOne({githubId:profile.id})
    if(user){
      user.accessToken = accessToken;
      user.save();
        if(user.username !== profile.username){
            user.username = profile.username 
            await user.save();
        }
        return done(null, user);
        
    }
    const newUser = await new User({ 
        githubId: profile.id,
        username:profile.username,
        accessToken
    }).save();
    done(null, newUser);
  }
));