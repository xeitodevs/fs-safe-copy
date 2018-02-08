'use strict'

const test = require('ava')
const os = require('os')
const path = require('path')
const { copy } = require('../')

const { createDirectory, removeDirectory } = require('./helpers/utils')

const TEST_DIRECTORY = path.join(os.tmpdir(), 'fs.copy')

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('fs.copy', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.copy')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.copy')
  const promise = copy(fileSrc, fileDest)
  const err = await t.throws(promise, Error, 'should return an error if src and dest are the same')
  t.is(err.message, 'source and destination must not be the same')
})
