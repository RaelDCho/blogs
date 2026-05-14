const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_.-]+$/.test(v)
      },
      message: props => `${props.value} is not a valid username`
    }
  },
  name: {
    type: String,
    required: true,
    minLength: 3,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z -]+$/.test(v)
      },
      message: props => `${props.value} is not a valid name`
    }
  },
  passwordHash: {
    type: String,
    minLength: 3,
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // console.log(returnedObject._id)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User