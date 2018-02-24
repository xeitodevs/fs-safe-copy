'use strict'
const DEFAULT_PARALLEL_TASKS = 2

class TaskQueue {
  constructor ({ parallelTasks } = {}) {
    this.parallelTasks = parallelTasks || DEFAULT_PARALLEL_TASKS
    this.runningTask = 0
    this.taskQueue = []
  }

  pushTasks (tasks) {
    tasks.forEach(task => this.pushTask(task))
  }

  pushTask (task) {
    this.taskQueue.push(task)
    this.nextTask()
  }

  async nextTask () {
    while (this.runningTask < this.parallelTasks && this.taskQueue.length) {
      const task = this.taskQueue.shift();
      (async () => {
        await task()
        this.runningTask -= 1
        this.nextTask()
      })()
      this.runningTask += 1
    }
  }
}

module.exports = {
  TaskQueue
}
