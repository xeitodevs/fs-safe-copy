const test = require('ava')
const os = require('os')
const path = require('path')
const { RecursiveCopyException } = require('../../lib/errors/RecursiveCopyException')
const { FolderCopier } = require('../../lib/Copier/FolderCopier')

const { createDirectory, removeDirectory } = require('../helpers/utils')

const TEST_DIRECTORY = path.join(os.tmpdir(), `fs.copy-${Date.now()}`)

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
  const promise = copier.copy()
  const err = await t.throws(promise, RecursiveCopyException, 'should return an error if dest is a subdirectory of src')
  t.is(err.message, `cannot copy '${fileSrc}' to a subdirectory of itself, '${fileDest}'.`)
})
