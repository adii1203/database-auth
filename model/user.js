const mongooes = require('mongoose')

const userSChema = new mongooes.Schema({
    firstname:{
        type: String,
        default: null
    },
    lastname:{
        type: String,
        default: null
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    token:{
        type: String,
    },
})

module.exports = mongooes.model('user', userSChema)