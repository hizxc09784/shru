const mongoose = require('mongoose')
const shortId = require('shortid')

const AccountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  userPublicInfo: {
      profileImage: {
        type: String,
        required: true,
    },
      id: {
        type: String,
        required: true,
        default: shortId.generate
    }
  },
  pass: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  loggedinuser: {
    type: String,
    required: false,
    default: null
  },
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('AccountCreate', AccountSchema)