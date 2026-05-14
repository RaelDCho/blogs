const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'Bad Request'
    })
  }

  // // only logged-in users can create blogs
  // // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  // const user = await User.findById(decodedToken.id)
  // // console.log(`decoded token in blogs: ${user}`)
  // // const user = await User.findById(body.userId)

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or invalid' })
  }

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  // add the note ID to blogs field in User model
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = new Blog(request.body)
  const { title, author, url, likes } = body

  // find blog by ID
  const blog = await Blog.findById(request.params.id)

  // update all the edit-able fields in matching blog
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  // save updated blog
  const updatedBlog = await blog.save()
  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  // const user = await User.findById(decodedToken.id)

  // if (!user) {
  //   return response.status(400).json({ error: 'userId missing or invalid' })
  // }

  const user = request.user

  console.log(request.params.id)

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await Blog.findByIdAndDelete(request.params.id)
  }

  await user.save()
  response.status(204).end()
})

module.exports = blogsRouter