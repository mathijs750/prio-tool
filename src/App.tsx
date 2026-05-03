import { useState, useEffect } from 'react'
import './index.css'
import type { ITask } from './types'
import { TaskList } from './components/TaskList'
import { QuickAdd } from './components/QuickAdd'
import { AddTaskModal } from './components/AddTaskModal'
import { TimerFinishedModal } from './components/TimerFinishedModal'

const TIMER_MS = 30 * 60 * 1000;

/**
 * Main application component managing task state and timers.
 */
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
  const [finishedTimerTask, setFinishedTimerTask] = useState<ITask | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      
      setTasks(prevTasks => {
        let changed = false;
        const newTasks = prevTasks.map(task => {
          if (task.timerActive && task.timerStartTime) {
            const elapsed = currentNow - task.timerStartTime;
            if (elapsed > (task.timerDuration || TIMER_MS)) {
              changed = true;
              setFinishedTimerTask(task);
              return { ...task, timerActive: false, timerStartTime: undefined };
            }
          }
          return task;
        });
        return changed ? newTasks : prevTasks;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, state: 'done', timerActive: false } : t));
  }

  const handleStartTimer = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      state: 'in-progress', 
      timerActive: true, 
      timerStartTime: Date.now(),
      timerDuration: TIMER_MS 
    } : t));
  }

  const handleTimerFinishResponse = (done: boolean) => {
    if (!finishedTimerTask) return;
    if (done) {
      handleCompleteTask(finishedTimerTask.id);
    } else {
      handleStartTimer(finishedTimerTask.id);
    }
    setFinishedTimerTask(null);
  }

  return (
    <>
      <h1>Mijn Taken</h1>

      <TaskList 
        tasks={tasks} 
        onComplete={handleCompleteTask} 
        onStartTimer={handleStartTimer}
        now={now}
      />
      
      <QuickAdd onAdd={handleOpenModal} />
      
      <AddTaskModal
        isOpen={isModalOpen}
        description={pendingDescription}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <TimerFinishedModal 
        task={finishedTimerTask} 
        onResponse={handleTimerFinishResponse} 
      />
    </>
  )
}

export default App
