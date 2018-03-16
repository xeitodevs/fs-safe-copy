'use strict'
const fs = require('fs')
const { promisify } = require('util')
const fsStat = promisify(fs.stat)

class FileStat {
  constructor (src) {
    this.src = src
  }

  async isDirectory () {
    await this.getStat()
    return this.stat.isDirectory()
  }

  async getStat () {
    if (!this.stat) {
      this.stat = await fsStat(this.src)
    }
    return this.stat
  }
}

module.exports = {
  FileStat
}
