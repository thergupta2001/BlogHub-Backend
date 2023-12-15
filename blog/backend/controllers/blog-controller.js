const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')

const getAllBlogs = async (req, res, next) => {
     let blogs;

     try {
          blogs = await Blog.find()

          if (!blogs) {
               return res.status(404).json({ message: 'No blogs found' })
          }

          return res.status(200).json({ blogs })
     } catch (err) {
          return console.log(err)
     }
}

const addBlog = async (req, res, next) => {
     const { title, description, image, user } = req.body

     let existingUser;
     try {
          existingUser = await User.findById(user)
     } catch (err) {
          return console.log('Error ', err)
     }

     if (!existingUser) {
          return res.status(400).json({ message: 'Unable to find user by ID' })
     }

     const blog = new Blog({
          title,
          description,
          image,
          user
     })

     try {
          const session = await mongoose.startSession()
          session.startTransaction()
          await blog.save({ session })
          existingUser.blogs.push(blog)
          await existingUser.save({ session })
          await session.commitTransaction()
     } catch (err) {
          console.log('Error')
          return res.status(500).json(err)
     }

     return res.status(200).json({ blog })
}

const updateBlog = async (req, res, next) => {
     const blogId = req.params.id;
     const { title, description } = req.body
     let blog;

     try {
          blog = await Blog.findByIdAndUpdate(blogId, {
               title, description
          })
     } catch (err) {
          return res.json({ error: 'Something went wrong' })
     }

     if (!blog) {
          return res.status(500).json({ message: 'Unable to find blog' })
     }

     return res.status(200).json({ blog })
}

const getById = async (req, res, next) => {
     const id = req.params.id;
     let blog;

     try {
          blog = await Blog.findById(id);
     } catch (err) {
          return console.log('Error in finding ', err)
     }

     if (!blog) {
          return res.status(404).json({ message: 'Blog not found' })
     }

     return res.status(200).json({ blog })
}

const deleteBlog = async (req, res, next) => {
     const id = req.params.id

     let blog;
     try {
          blog = await Blog.findByIdAndDelete(id).populate('user')
          await blog.user.blogs.pull(blog)
          await blog.user.save()
     } catch (err) {
          return console.log('Error ', err)
     }

     if (!blog) {
          return res.status(400).json({ message: 'Unable to delete' })
     }

     return res.status(200).json({ message: 'Blog successfully deleted' })
}

const getByUserId = async (req, res, next) => {
     const userId = req.params.id

     let userBlogs;
     try{
          userBlogs = await User.findById(userId).populate('blogs')
     } catch (err) {
          console.log('Error ', err)
     }

     if(!userBlogs){
          return res.status(404).json({ message: 'No blog found' })
     }

     return res.status(200).json({ blogs: userBlogs })
}

module.exports = {
     deleteBlog, getAllBlogs, addBlog, updateBlog, getById, getByUserId
}