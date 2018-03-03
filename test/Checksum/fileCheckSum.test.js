const test = require('ava')
const os = require('os')
const path = require('path')

const { createDirectory, removeDirectory, createTestFile } = require('../helpers/utils')
const { fileEqual } = require('../../lib/Checksum/fileCheckSum')
const TEST_DIRECTORY = path.join(os.tmpdir(), `fs.copy-${Date.now()}`)

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('Checksum success on same file content', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.checksumSameFileA')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.checksumSameFileB')
  const fileData = 'hello-world'
  await createTestFile(fileSrc, fileData)
  await createTestFile(fileDest, fileData)
  t.is(await fileEqual(fileSrc, fileDest), true)
})

test('Checksum must fail on different file content', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.checksumDifferentFileA')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.checksumDifferentFileB')
  const fileDataSrc = 'hello-world'
  const fileDataDst = 'bye-world'
  await createTestFile(fileSrc, fileDataSrc)
  await createTestFile(fileDest, fileDataDst)
  t.is(await fileEqual(fileSrc, fileDest), false)
})
