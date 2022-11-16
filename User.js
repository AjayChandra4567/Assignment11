const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,        
        min : 3,
        max : 15

    },
    lastName: {
        type: String,
        required : true,
        min : 3,
        max : 15
    },
    email : {
        type: String,
        required : true,
        unique: true,
        min : 4,
        max : 16
    },
    password : {
        type: String,
        required : true,
    }
})

module.exports = mongoose.model('user',UserSchema);