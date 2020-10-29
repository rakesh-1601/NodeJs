let mongoose    = require('mongoose')
 
let userSchema = new mongoose.Schema({
    //first name of the user
    username: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    password: {
        type: String,
        default: null,
        trim: true
    },
    token:{
        type:String,
        default:null
    }
})
module.exports =  mongoose.model('users', userSchema);
