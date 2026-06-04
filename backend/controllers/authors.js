const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

// const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    // group: 'author'
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'total likes']
    ],
    group: ['author'],
    order: [
      ['total likes', 'DESC']
    ]
  })

  res.json(blogs)
})

module.exports = router