'use strict'

const test = require('ava')
const os = require('os')
const path = require('path')
const fs = require('fs')
const { IsTheSameFileException } = require('../lib/errors/IsTheSameFileException')
const { copy, pathExists } = require('../lib/copy')

const { createDirectory, removeDirectory, createTestFile } = require('./helpers/utils')

const TEST_DIRECTORY = path.join(os.tmpdir(), 'fs.copy')

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
  const promise = copy(fileSrc, fileDest)
  const err = await t.throws(promise, IsTheSameFileException, 'should return an error if src and dest are the same')
  t.is(err.message, 'source and destination must not be the same')
})

test('fs.copy correctly', async t => {
  const fileSrc = path.join(TEST_DIRECTORY, 'TEST_fs.copySrc')
  const fileDest = path.join(TEST_DIRECTORY, 'TEST_fs.copyDest')
  const fileData = 'hello-world'
  createTestFile(fileSrc, fileData)
  const promise = copy(fileSrc, fileDest)
  await t.notThrows(promise)
  const exist = await pathExists(fileDest)
  t.true(exist, 'should exist the destination file')
  t.is(fs.readFileSync(fileDest).toString(), fileData, 'should exist the destination file with correct content')
})
