'use strict'
const { FileCopyException } = require('./FileCopyException')

class CorruptOperationException extends FileCopyException {
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  CorruptOperationException
}
