'use strict'
const path = require('path')

async function copy (fileSrc, fileDest, options) {
  const src = path.resolve(fileSrc)
  const dest = path.resolve(fileDest)
  if (src === dest) {
    throw new Error('source and destination must not be the same')
  }
}

module.exports = {
  copy
}