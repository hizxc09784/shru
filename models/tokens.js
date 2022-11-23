const mongoose = require('mongoose')
const shortId = require('shortid')

const tokensSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('codes', tokensSchema)