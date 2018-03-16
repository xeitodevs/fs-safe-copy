const test = require('ava')
const path = require('path')
const fs = require('fs')

const { getTestDirectory, createTestFile } = require('../helpers/utils')
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

test('copy directory', async t => {
  const directorySrc = getPath('directorySrc')
  await createDirectory(directorySrc)
  const dataInFile = 'data in file'
  const numbers = Array.from({ length: 5 }, (val, index) => index)
  for (const number of numbers) {
    const fileName = `TEST_FILE_${number}.txt`
    await createTestFile(path.join(directorySrc, fileName), `${dataInFile} ${fileName}`)
  }
  const copier = new FolderCopier(directorySrc, TEST_DIRECTORY)
  await copier.copy()

  for (const number of numbers) {
    const fileName = `TEST_FILE_${number}.txt`
    t.is(fs.readFileSync(getPath(fileName)).toString(), `${dataInFile} ${fileName}`, `should exist the file ${fileName} with correct content`)
  }
})
