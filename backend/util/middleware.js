const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

/*
  Error handler function
 */
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

/*
  Check if current logged in user is an admin through ID of decodedToken in request-object
  - if not, does not allow the operation they are attempting
 */
const isAdmin = async (request, response, next) => {
  const user = await User.findByPk(request.decodedToken.id)

  if (!user.admin) {
    return response.status(401).json({
      error: 'Operation is not allowed by account'
    })
  }

  next()
}

/*
  Extract the token and store in decodedToken of request-object
 */
const tokenExtractor = (request, response, next) => {
  const authorisation = request.get('authorisation')
  if (authorisation && authorisation.toLowerCase().startsWith('bearer ')) {
    try {
      request.decodedToken = jwt.verify(authorisation.substring(7), SECRET)
    } catch {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  errorHandler, isAdmin, tokenExtractor
}