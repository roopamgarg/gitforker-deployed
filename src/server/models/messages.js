
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        required:true,
        type: Schema.Types.ObjectId,
         ref: 'user'
    },
    time:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});


mongoose.model('messages', messagesSchema);
