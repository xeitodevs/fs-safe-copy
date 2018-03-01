'use strict'

const test = require('ava')
const os = require('os')
const path = require('path')
const { safeCopy } = require('../lib/copy')

const fileEqualStub = {
  fileEqual: async function (src, dest) {
    return false
  }
}
const proxyquire = require('proxyquire')
const FileCopyException = require('../lib/errors/FileCopyException').FileCopyException
const { CorruptOperationException } = require('../lib/errors/CorruptOperationException')
const { safeCopy: proxiedSafeCopy } = proxyquire('../lib/copy', {
  './Checksum/fileCheckSum': fileEqualStub
})

const { createDirectory, removeDirectory, createTestFile } = require('./helpers/utils')
const TEST_DIRECTORY = path.join(os.tmpdir(), `fs.copy-${Date.now()}`)

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('fs.safeCopy correctly, since files are equal.', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.safeCopySrc')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.safeCopyDest')
  const fileData = 'hello-world'
  await createTestFile(fileSrc, fileData)
  await t.notThrows(safeCopy(fileSrc, fileDest))
})

test('fs.safeCopy throws exception on data corruption.', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.safeCopySrc')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.safeCopyDest')
  const fileData = 'hello-world'
  await createTestFile(fileSrc, fileData)
  const exception = await t.throws(proxiedSafeCopy(fileSrc, fileDest))
  t.deepEqual(exception, new CorruptOperationException('Something changed the files just after operation'))
})
test('fs.safeCopy throws exception trying to copy dir.', async t => {
  const dirSrc = path.join(TEST_DIRECTORY, 'TEST_fs_dir.safeCopySrc')
  const dirDest = path.join(TEST_DIRECTORY, 'TEST_fs_dir.safeCopyDest')
  await createDirectory(dirSrc)
  const exception = await t.throws(proxiedSafeCopy(dirSrc, dirDest))
  t.deepEqual(exception, new FileCopyException('Cannot safe copy directories'))
})
