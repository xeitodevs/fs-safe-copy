'use strict'

const test = require('ava')
const os = require('os')
const path = require('path')

const { createDirectory, emptyDirectory, removeDirectory } = require('./helpers/utils')

const TEST_DIRECTORY = path.join(os.tmpdir(), 'fs.copy')
test.before(async () => {
  await emptyDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('should pass', t => t.pass())
