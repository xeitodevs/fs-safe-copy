'use strict'

const test = require('ava')
const path = require('path')
const fs = require('fs')
const { IsTheSameFileException } = require('../lib/errors/IsTheSameFileException')
const { copy, pathExists } = require('../lib/copy')

const { createDirectory, removeDirectory, createTestFile, getTestDirectory } = require('./helpers/utils')

const TEST_DIRECTORY = getTestDirectory()

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test('fs.copy with the same source and destination', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.copy')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.copy')
  const exception = await t.throws(copy(fileSrc, fileDest))
  t.deepEqual(exception, new IsTheSameFileException('source and destination must not be the same'))
})

test('fs.copy correctly', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.copySrc')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.copyDest')
  const fileData = 'hello-world'
  await createTestFile(fileSrc, fileData)
  const promise = copy(fileSrc, fileDest)
  await t.notThrows(promise)
  const exist = await pathExists(fileDest)
  t.true(exist, 'should exist the destination file')
  t.is(fs.readFileSync(fileDest).toString(), fileData, 'should exist the destination file with correct content')
})

test('fs.copy pass', t => t.pass())
