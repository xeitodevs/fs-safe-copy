const test = require('ava')
const { TaskQueue } = require('../../lib/Copier/TaskQueue')

test('TaskQueue', async t => {
  const taskQueue = new TaskQueue({ parallelTasks: 2 })
  const asyncTaskOne = () => getPromise()
  const asyncTaskTwo = () => getPromise()
  const asyncTaskThree = () => getPromise()

  taskQueue.pushTasks([asyncTaskOne, asyncTaskTwo, asyncTaskThree])
  t.is(taskQueue.runningTask, 2, 'should exist only two running task')
  await getPromise(2000)
  t.is(taskQueue.runningTask, 1, 'should exist only two running task')
  await getPromise()
  t.is(taskQueue.runningTask, 0, 'there should be no task')
})

test('TaskQueue check result', async t => {
  const taskQueue = new TaskQueue({ parallelTasks: 2 })
  let taskOneResult = ''
  const asyncTaskOne = async () => {
    taskOneResult = await new Promise(resolve => {
      setTimeout(() => resolve('taskOneResult'), 1000)
    })
  }

  taskQueue.pushTasks([asyncTaskOne])
  t.is(taskQueue.runningTask, 1, 'should exist only two running task')
  await getPromise(2000)
  t.is(taskOneResult, 'taskOneResult', 'should to have the correct value')
})

function getPromise (delay = 2000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay)
  })
}
