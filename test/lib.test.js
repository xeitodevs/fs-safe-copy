'use strict'

const test = require('ava')
const { createTestFile, exists, removeDirectory, createDirectory, getTestDirectory, Temporizer } = require('./helpers/utils')
const { safeCopy, copy } = require('../lib/index')

const TEST_DIRECTORY = getTestDirectory()

test.before(async () => {
  await removeDirectory(TEST_DIRECTORY)
  await createDirectory(TEST_DIRECTORY)
})

test.after(async () => {
  await removeDirectory(TEST_DIRECTORY)
})

test.serial('Test lib, massive copy of a directory taking care about timings', async (t) => {
  const maxTime = 30000
  const temporizer = new Temporizer(maxTime)

  const originCopyDirectory = `${TEST_DIRECTORY}/origin`
  const destinationCopyDirectory = `${TEST_DIRECTORY}/destination`
  createDirectory(originCopyDirectory)
  const createdFiles = []
  for (let i = 0; i < 10000; i++) {
    let fileName = `file_${i}_.lst`
    let testFilePath = `${originCopyDirectory}/${fileName}`
    createTestFile(testFilePath, `data_${i}`)
    createdFiles.push(testFilePath)
  }
  temporizer.startCount()
  await copy(originCopyDirectory, destinationCopyDirectory)
  temporizer.endCount()
  const existChecks = createdFiles.map(exists)
  await t.notThrows(Promise.all(existChecks))
  t.is(temporizer.isPassing(), true, temporizer.getMessage())
})

test.serial('Test lib, safe copy of files taking care about timings', async (t) => {
  const maxTime = 10
  const temporizer = new Temporizer(maxTime)
  const fileName = `file_test_.lst`
  const testFilePath = `${TEST_DIRECTORY}/${fileName}`
  const destinationPath = `${TEST_DIRECTORY}/copied.lst`
  createTestFile(testFilePath, 'data')
  temporizer.startCount()
  await safeCopy(testFilePath, destinationPath)
  temporizer.endCount()
  await t.notThrows(exists(destinationPath))
  t.is(temporizer.isPassing(), true, temporizer.getMessage())
})
