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
      description: 'Projectstructuur opzetten',
      size: 'seed',
      priority: 'B',
      state: 'done',
    },
    {
      id: '3',
      description: 'Huis visualisatie bouwen',
      size: 'tree',
      priority: 'C',
      state: 'in-progress',
      subTasks: [
        { description: '3D model ontwerpen', priority: 'C' },
        { description: 'Rendering engine implementeren', priority: 'A' },
        { description: 'Textuur ondersteuning toevoegen', priority: 'C' },
      ],
    },
    {
      id: '5',
      description: 'Prioriteitsalgoritme ontwerpen',
      size: 'plant',
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
      <h1>Mijn Taken</h1>

      <TaskList tasks={tasks} />
      
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
