'use strict'

class FileCopyException extends Error {
  constructor (...params) {
    super(...params)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  FileCopyException
}
