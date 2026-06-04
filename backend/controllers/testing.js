const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (req, res) => {
  res.status(200).end()
})

router.post('/reset', async (req, res) => {

})