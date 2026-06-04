const router = require('express').Router()

const bcrypt = require('bcrypt')

const { Blog, User } = require('../models')

// middleware functions
const { isAdmin, tokenExtractor } = require('../util/middleware')

router.get('/', async (request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  response.json(users)
})

router.post('/', async (request, response) => {
  try {
    const { password } = request.body

    if (password.length < 3) {
      return response.status(400).json({ error: 'password length does not meet the minimum required length' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ ...request.body, passwordHash: passwordHash })
    response.json(user)
  } catch(error) {
    return response.status(400).json({ error })
  }
})

router.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id, {
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })

  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

/*
  Allow admin accounts to change accounts' disabled status
 */
router.put('/:username', tokenExtractor, isAdmin, async (request, response) => {
  const user = await User.findOne({
    where: {
      username: request.params.username
    }
  })

  if (user) {
    user.disabled = request.body.disabled
    await user.save()
    response.json(user)
  } else {
    response.status(404).end()
  }
})

// using username
// router.get('/:name', async (req, res) => {
//   const user = await User.findOne({
//     include: {
//       model: Blog,
//       attributes: {
//         exclude: ['userId']
//       }
//     },
//     where: name = req.params.name
//   })
// })

module.exports = router