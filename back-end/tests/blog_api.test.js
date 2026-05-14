const assert = require('assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

// initialise test database before running each test
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})

// tests for blog_api
describe('get', () => {
  // test to see if blogs in database are returned as json
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  })

  // test to see if size of blogs = size of database
  test('getting all blogs from db', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // test to see if unique ID property is is named id and not __id
  test('id not __id', async () => {
    const blogs = await helper.blogsInDb()

    blogs.forEach(blog => {
      assert(blog.hasOwnProperty('id'))
      assert(!blog.hasOwnProperty('__id'))
    })
  })
})

describe('post', () => {
  // test to see post creates new blog
  test('POST blog', async () => {
    const newBlog = {
      title: 'delete soon',
      author: 'deletimus prime',
      url: 'delete.delete',
      likes: 0
    }

    const token = helper.initialToken()

    await api.post('/api/blogs').set('authorisation', `Bearer ${token}`)
      .send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(newBlog.title))
  })

  // test if likes property is missing from request, default value is zero
  test('test if likes property is missing from request, expect default value of zero', async () => {
    // post a new blog without likes property
    const newBlog = {
      title: 'testing if likes returns 0 blog',
      author: 'deletimus prime',
      url: 'delete.delete'
    }

    const token = helper.initialToken()
    await api.post('/api/blogs').set('authorisation', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const matchBlog = blogs.find(blog => blog.title === newBlog.title)
    assert.strictEqual(matchBlog.likes, 0)
  })

  // test if title or url is missing, a post request will return 0
  test('title or url missing returns 400 bad request', async () => {
    const newBlog = {
      author: 'mr beast',
      likes: 4
    }

    const token = helper.initialToken()
    await api.post('/api/blogs').set('authorisation', `Bearer ${token}`).send(newBlog).expect(400)
  })
})

describe('delete', () => {
  // test if deletion returns 204 and deleted blog ID cannot be found
  test('deletion success returns status code 204 if ID is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[3]

    const token = helper.initialToken()
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorisation', `Bearer ${token}`).expect(204)

    // await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)

    const ids = blogsAtEnd.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))
  })
})

describe('put', () => {
  // test if updating returns 201 and all fields are the same except id
  test('update success returns status code 201 if ID is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[3]

    // const token = helper.initialToken()

    // does updating have to only be done while logged in as the user?

    const updateBlog = {
      ...blogToUpdate,
      title: 'testing for put'
    }

    // await api.put(`/api/blogs/${blogToUpdate.id}`).set('authorisation', `Bearer ${token}`).send(updateBlog).expect(201)
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updateBlog).expect(201)

    // check if the blogs fields have been updated
    // const resultBlog = await api.get(`/api/blogs/${blogToUpdate.id}`).expect(200).expect('Content-Type', /application\/json/)
    const resultBlog = await helper.specificBlogInDb(blogToUpdate.id)
    assert.deepStrictEqual(resultBlog, updateBlog)
  })
})

after(async () => {
  await mongoose.connection.close()
})