const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  },
  {
    // _id: '5a422aa71b54a676234d17f8',
    title: 'hi',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
  },
  {
    title: 'blah',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 7,
  },
  {
    title: 'blah2',
    author: 'Quandale Dingle',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10000,
    user: '69e5edb3c246e70ada330b37'
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'admin',
    passwordHash: '$2b$10324325jfdsljfw0Ziov0.M9nA3eTMz0tOFqjXGZLY50I6D2VMBEq'
  },
  {
    _id: '69e5edb3c246e70ada330b37',
    username: 'quandavius-dingle',
    name: 'quandale-dingle',
    passwordHash: '$2b$10$P/5cvRe.XBTqzlx0Ziov0.M9nA3eTMz0tOFqjXGZLY50I6D2VMBEq',
    blogs: [],
    __v: 0
  }
]

const initialToken = () => {
  const userForToken = {
    username: 'quandavius-dingle',
    id: '69e5edb3c246e70ada330b37'
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  console.log(token)
  return token
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'delete soon',
    author: 'deletimus prime',
    url: 'delete.delete',
    likes: 0
  })

  await blog.save()
  await blog.deleteOne()

  return blog.__id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const specificBlogInDb = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

module.exports = {
  initialBlogs,
  initialUsers,
  initialToken,
  nonExistingId,
  blogsInDb,
  usersInDb,
  specificBlogInDb
}