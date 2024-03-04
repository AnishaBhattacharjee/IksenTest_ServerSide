const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:String,
        enum:['user','admin'],
        default:"user"
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);