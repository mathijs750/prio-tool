import { useState } from 'react'
import './index.css'
import type { ITask } from './types'
import { TaskList } from './components/TaskList'
import { QuickAdd } from './components/QuickAdd'
import { AddTaskModal } from './components/AddTaskModal'

function App() {
  const [tasks, setTasks] = useState<ITask[]>([
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingDescription, setPendingDescription] = useState('')

  const handleOpenModal = (description: string) => {
    setPendingDescription(description)
    setIsModalOpen(true)
  }

  const handleAddTask = (taskData: Omit<ITask, 'id' | 'state'>) => {
    const newTask: ITask = {
      ...taskData,
      id: crypto.randomUUID(),
      state: 'todo',
    }
    setTasks((prev) => [...prev, newTask])
  }

  return (
    <>
      <section className="task-list">
        <TaskList tasks={tasks} />
      </section>

      <QuickAdd onAdd={handleOpenModal} />
      
      <AddTaskModal
        isOpen={isModalOpen}
        description={pendingDescription}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  )
}

export default App
