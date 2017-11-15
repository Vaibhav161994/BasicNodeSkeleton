var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },        
    email:{
        type : String,
        required : true,
        unique :true
    },
    password:{
        type: String,
        required: true
    } 
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);