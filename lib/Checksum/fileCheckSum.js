'use strict'

const { promisify } = require('util')
const fs = require('fs')
const crypto = require('crypto')
const fsReadFile = promisify(fs.readFile)

async function fileEqual (filePathA, filePathB, algo = 'md5') {
  const hashSrc = crypto.createHash(algo)
  const hashDst = crypto.createHash(algo)
  const srcFile = await fsReadFile(filePathA)
  const dstFile = await fsReadFile(filePathB)

  hashSrc.update(srcFile)
  hashDst.update(dstFile)
  return hashSrc.digest('hex') === hashDst.digest('hex')
}

module.exports = {
  fileEqual
}
