import { useState } from 'react'
import './App.css'
import type { ITask } from './types'
import { TaskList } from './TaskList'

function App() {
  const [tasks] = useState<ITask[]>([
    {
      id: '2',
      description: 'Setup project structure',
      size: 'brick',
      priority: 'B',
      state: 'done',
    },
    {
      id: '3',
      description: 'Build the house visualization',
      size: 'house',
      priority: 'C',
      state: 'in-progress',
    },
    {
      id: '5',
      description: 'Design the priority algorithm',
      size: 'wall',
      priority: 'A',
      state: 'todo',
    },
  ])

  return (
    <>
      <section id="center" className="task-list">
        <h1>Priority Task List</h1>
        <TaskList tasks={tasks} />
      </section>
    </>
  )
}

export default App
