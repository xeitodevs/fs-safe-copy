const test = require('ava')
const path = require('path')
const { getTestDirectory } = require('../helpers/utils')
const { RecursiveCopyException } = require('../../lib/errors/RecursiveCopyException')
const { FolderCopier } = require('../../lib/Copier/FolderCopier')

const { createDirectory, removeDirectory } = require('../helpers/utils')

const TEST_DIRECTORY = getTestDirectory()

function getPath (file) {
  return path.join(TEST_DIRECTORY, file)
}

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('copy subdirectory', async t => {
  const fileSrc = getPath('')
  const fileDest = getPath('subdirectory')
  const copier = new FolderCopier(fileSrc, fileDest)
  const exception = await t.throws(copier.copy())
  t.deepEqual(exception, new RecursiveCopyException(`cannot copy '${fileSrc}' to a subdirectory of itself, '${fileDest}'.`))
})
