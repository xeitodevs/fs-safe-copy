'use strict'
const path = require('path')
const { RecursiveCopyException } = require('../errors/RecursiveCopyException')

class FolderCopier {
  constructor (src, dest) {
    this.src = src
    this.dest = dest
  }

  async copy () {
    if (this.isDestinationSubFolderOfSource()) {
      return new RecursiveCopyException()
    }
  }

  isDestinationSubFolderOfSource () {
    const sourceDirectoryName = path.dirname(this.src)
    const pathSeparator = path.sep
    const destinationBaseFolder = this.dest.split(`${sourceDirectoryName}${pathSeparator}`).pop()
    if (!destinationBaseFolder) {
      return false
    }
    const destinationBaseFolderName = destinationBaseFolder.split(pathSeparator).shift()
    if (!destinationBaseFolderName) {
      return false
    }
    const sourceBaseFolderName = path.basename(this.src)
    const areTheSame = this.src === this.dest
    const isIncluded = this.dest.includes(this.src)
    return !areTheSame && !isIncluded && destinationBaseFolderName === sourceBaseFolderName
  }
}

module.exports = {
  FolderCopier
}
