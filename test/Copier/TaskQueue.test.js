const test = require('ava')
const { TaskQueue } = require('../../lib/Copier/TaskQueue')

test('TaskQueue', async t => {
  const taskQueue = new TaskQueue({ parallelTasks: 2 })
  const asyncTaskOne = () => getPromise()
  const asyncTaskTwo = () => getPromise()
  const asyncTaskThree = () => getPromise()

  taskQueue.pushTasks([asyncTaskOne, asyncTaskTwo, asyncTaskThree])
  t.is(taskQueue.runningTask, 2, 'should exist only two running task')
  await getPromise()
  t.is(taskQueue.runningTask, 1, 'should exist only two running task')
  await getPromise()
  t.is(taskQueue.runningTask, 0, 'there should be no task')
})

test('TaskQueue check result', async t => {
  const taskQueue = new TaskQueue({ parallelTasks: 2 })
  const taskResult = {}
  taskQueue.pushTasks([getAsyncTaskWithCachedValues(taskResult)])
  t.is(taskQueue.runningTask, 1, 'should exist only two running task')
  await getPromise(500)
  t.is(taskResult.value, 'cached value', 'should to have the correct value')
})

function getPromise (delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay)
  })
}

function getAsyncTaskWithCachedValues (cachedValue) {
  return () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 500)
    }).then(() => (cachedValue.value = 'cached value'))
  }
}
