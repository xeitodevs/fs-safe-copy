'use strict'

const fs = require('fs')
const { SumCreator } = require('./sumCreator')

async function fileEqual (filePathA, filePathB, algorithm = 'md5') {
  const resultFileA = await createSum(filePathA, algorithm)
  const resultFileB = await createSum(filePathB, algorithm)
  return resultFileA === resultFileB
}

const createSum = (filePath, algorithm) => {
  const sumResult = {}
  return new Promise((resolve, reject) => {
    const sum = new SumCreator(algorithm)
    fs.createReadStream(filePath).pipe(sum)
    sum.on('readable', onReadData(sumResult, sum))
      .on('end', () => resolve(sumResult.hex))
      .on('error', () => reject(new Error('it is not possible to perform the check sum of the file')))
  })
}

const onReadData = (sumResult, sumInstance) => {
  return () => {
    let data
    while ((data = sumInstance.read()) !== null) {
      sumResult.hex += data.toString()
    }
  }
}

module.exports = {
  fileEqual
}
