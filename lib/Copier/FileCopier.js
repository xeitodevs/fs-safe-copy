'use strict'
const fs = require('fs')
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

class FileCopier {
  constructor (src, dest) {
    this.src = src
    this.dest = dest
  }

  copy () {
    return copyFile(this.src, this.dest)
  }
}

module.exports = {
  FileCopier
}
