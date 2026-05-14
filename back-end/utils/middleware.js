const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body || {})
    logger.info('---')
  }

  next()
}

/*
  Function returns token without 'Bearer '
*/
const tokenExtractor = (request, response, next) => {
  const authorisation = request.get('authorisation')
  if (authorisation && authorisation.startsWith('Bearer ')) {
    request.token = authorisation.replace('Bearer ', '')
  }

  next()
}

/*
  Function to extract user depending on token that was extracted
*/
const userExtractor = async (request, response, next) => {
  if (request.method === 'POST' || request.method === 'DELETE') {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    } else {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })

  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).send({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: 'token invalid' })
  }

  next()
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}