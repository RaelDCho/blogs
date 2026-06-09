const router = require('express').Router()
// const jwt = require('jsonwebtoken')

// const { SECRET } = require('../util/config')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)

  if (!req.blog) {
    return res.status(400).end()
  }

  next()
}

// const tokenExtractor = (req, res, next) => {
//   const authorisation = req.get('authorisation')
//   if (authorisation && authorisation.toLowerCase().startsWith('bearer ')) {
//     try {
//       req.decodedToken = jwt.verify(authorisation.substring(7), SECRET)
//     } catch {
//       return res.status(401).json({ error: 'token invalid' })
//     }
//   } else {
//     return res.status(401).json({ error: 'token missing' })
//   }

//   next()
// }

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: {[Op.iLike]: `%${req.query.search}%`} },
        { author: {[Op.iLike]: `%${req.query.search}%`} }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    order: [
      ['likes', 'DESC']
    ],
    where
  })

  blogs.map(blog => {
    console.log(JSON.stringify(blog))
  })
  // console.log(blogs.map(blog => blog.toJSON()))
  res.json(blogs)
})

// get a single note
router.get('/:id', blogFinder, async (req, res) => {
  // res.json(req.blog)
  try {
    return res.json(req.blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, date: new Date(), userId: user.id })
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.title = req.body.title
  req.blog.author = req.body.author
  req.blog.url = req.body.author

  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  console.log(`Deleting blog: ${req.blog.title}`)
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router