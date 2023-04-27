require('dotenv').config()
require('./database/database').connect()
const express = require('express')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const app = express()

app.use(express.json())
app.use(cookieParser())

app.post('/register', async (req, res) => {
    try {
        // get all the data from the body 
        const {firstname, lastname, email, password} = req.body

        // all the data should exist
        if(!(firstname && lastname && email && password)){
            res.status(400).send('all feilds are required')
        }

        // check if user already exist 
        const userExist = await User.findOne({ email })
        if(userExist){
            res.status(401).send('user already exist with this email')
        }

        // encrypt the password 
        const encryptedPassword = await bcrypt.hash(password, 10)

        // save the user in db
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: encryptedPassword
        })

        // generate a token for user and send it
        const token = jwt.sign(
            {id: user._id},
            'shhhhhh',
            {
                expiresIn: '2h'
            }
        )
        user.token = token
        user.password = undefined

        res.status(200).send(user)

    } catch (error) {
        console.log(error);
    }
})

app.post('/login', async (req, res) => {

    try {
        // get all the data 
        const {email, password} = req.body

        // validate all data
        if(!(email && password)){
            res.status(400).send('all feilds are required')
        }

        // check if user is exist or not
        const user = await User.findOne({ email })
        if(!user){
            res.status(400).send('user not exist')
        }

        // verify the password
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {id: user._id},
                'shhhhhh',
                {
                expiresIn: '2h'
                }
            )
            user.token = token
            user.password = undefined

            // send token to the user
            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                sucess:true,
                token,
                user
            })
        }
        else{
            res.status(400).send('wrong password')
        }


    } catch (error) {  
        console.log(error);
    }
})

app.get('/', (req, res) => {
    res.send("<h1>Server is running</h1>")
})
module.exports = app

