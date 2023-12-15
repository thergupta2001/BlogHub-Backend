const User = require('../models/user.js')
const bcrypt = require('bcrypt')
// const { hashPassword } = require('./auth.js')

const getAllUser = async(req, res, next) => {
     let users;

     try{
          users = await User.find()
     }catch(err){
          console.log('Error in get method ', err);
     }

     if(!users){
          return res.status(404).json({ message: 'No users found' })
     }

     return res.status(200).json({ users })
}

const signUp = async(req, res, next) => {
     // const { name, email, password } = req.body;
     try{
          const { name, email, password } = req.body;

          if(!name || !email || !password){
               return res.json({ message: 'All the details are required' })
          }
     
          const exist = await User.findOne({ email })
          if(exist){
               return res.json({ message: 'User already exists' })
          }

          const hashedPassword = await bcrypt.hash(password, 10)
     
          const user = await User.create({
               name,
               email,
               password: hashedPassword,
               blogs: []
          })
     
          return res.json(user)
     }
     catch(err){
          console.log('Error in registration ', err)
     }
}

const login = async(req, res, next) => {
     try{
          const { email, password } = req.body
          let user = await User.findOne({ email })

          if(!user){
               return res.status(401).json({ message: 'Invalid credentials' })
          }

          const isPasswordMatch = bcrypt.compare(password, user.password)
          if(!isPasswordMatch){
               return res.status(400).json({ message: 'Incorrect password' })
          }

          return res.status(200).json({ message: 'Login successful' })
     }catch(err){
          return res.json({ error: 'Something went wrong' })
     }
}

module.exports = {
     getAllUser, signUp, login
}