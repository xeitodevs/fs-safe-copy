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
      const msg = `cannot copy '${this.src}' to a subdirectory of itself, '${this.dest}'.`
      throw new RecursiveCopyException(msg)
    }
  }

  isDestinationSubFolderOfSource () {
    const sourceDirectoryName = path.dirname(this.src)
    const pathSeparator = path.sep
    const destinationBaseFolder = this.dest.split(`${sourceDirectoryName}${pathSeparator}`).pop()
    if (!destinationBaseFolder) {
      return false
    }
    const destBasename = destinationBaseFolder.split(pathSeparator).shift()
    if (!destBasename) {
      return false
    }
    const sourceBasename = path.basename(this.src)
    const areTheSame = this.src === this.dest
    const isIncluded = this.dest.includes(this.src)
    return !areTheSame && isIncluded && destBasename === sourceBasename
  }
}

module.exports = {
  FolderCopier
}
