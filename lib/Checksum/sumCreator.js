'use strict'

const crypto = require('crypto')
const stream = require('stream')
const digester = Symbol('digester')

class SumCreator extends stream.Transform {
  constructor (algorithm, opts) {
    super(opts)
    this[digester] = crypto.createHash(algorithm)
  }

  _transform (chunk, encoding, callback) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
    this[digester].update(buffer)
    callback()
  }

  _flush (callback) {
    this.push(this[digester].digest('hex'))
    callback()
  }
}

module.exports = {
  SumCreator
}
