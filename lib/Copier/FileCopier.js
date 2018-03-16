'use strict'
const fs = require('fs')

class FileCopier {
  constructor (src, dest) {
    this.src = src
    this.dest = dest
  }

  copy () {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(this.src)
      const writeStream = fs.createWriteStream(this.dest)
      readStream.on('error', err => reject(err))
      writeStream.on('error', err => reject(err))
      writeStream.on('close', resolve)
      readStream.pipe(writeStream)
    })
  }
}

module.exports = {
  FileCopier
}
