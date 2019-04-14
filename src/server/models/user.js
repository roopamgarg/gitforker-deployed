
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  githubId:{
    type:String,
    required:true,
    index:true
  },
  username:{
    type:String,
    required:true,
  },
  accessToken:{
    type:String
  },
  chatsIdArray:[
    { type: Schema.Types.ObjectId,ref: 'allChats'}
  ]
 
});


mongoose.model('user', UserSchema);
