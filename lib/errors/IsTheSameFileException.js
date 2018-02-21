'use strict'
const { FileCopyException } = require('./FileCopyException')

class IsTheSameFileException extends FileCopyException {
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  IsTheSameFileException
}
