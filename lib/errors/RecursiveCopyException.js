'use strict'
const { FileCopyException } = require('./FileCopyException')

class RecursiveCopyException extends FileCopyException {
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  RecursiveCopyException
}
