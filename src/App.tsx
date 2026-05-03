import { useState, useEffect } from 'react'
import './index.css'
import type { ITask } from './types'
import { TaskList } from './components/TaskList'
import { QuickAdd } from './components/QuickAdd'
import { AddTaskModal } from './components/AddTaskModal'
import { TimerFinishedModal } from './components/TimerFinishedModal'

const TIMER_MS = 30 * 60 * 1000;
const STORAGE_KEY = 'prio-tasks';

/**
 * Main application component managing task state and timers.
 */
function App() {
  const [tasks, setTasks] = useState<ITask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      return parsed.filter((task: ITask) => {
        if (task.state !== 'done' || !task.finishedAt) return true;
        const finishedDate = new Date(task.finishedAt);
        const finishedDayStart = new Date(finishedDate.getFullYear(), finishedDate.getMonth(), finishedDate.getDate()).getTime();
        const cleanupThreshold = finishedDayStart + (2 * 24 * 60 * 60 * 1000);
        return todayStart < cleanupThreshold;
      });
    } catch (e) {
      console.error('Failed to parse saved tasks', e);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingDescription, setPendingDescription] = useState('')
  const [finishedTimerTask, setFinishedTimerTask] = useState<ITask | null>(null);
  const [now, setNow] = useState(0);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Sync timers with Service Worker on mount or when SW is ready
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.active) {
          tasks.forEach(task => {
            if (task.timerActive && task.timerStartTime && task.timerDuration) {
              const endTime = task.timerStartTime + task.timerDuration;
              if (endTime > Date.now()) {
                registration.active?.postMessage({
                  type: 'START_TIMER',
                  payload: {
                    id: task.id,
                    description: task.description,
                    endTime
                  }
                });
              }
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only once on mount

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      
      setTasks(prevTasks => {
        let changed = false;
        const newTasks = prevTasks.map(task => {
          if (task.timerActive && task.timerStartTime) {
            const elapsed = currentNow - task.timerStartTime;
            if (elapsed >= (task.timerDuration || TIMER_MS)) {
              changed = true;
              setFinishedTimerTask(task);
              
              if ('Notification' in window && Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                  registration.showNotification('Timer Klaar!', {
                    body: `Ben je klaar met: ${task.description}?`,
                    icon: '/favicon.svg',
                    tag: `timer-${task.id}`,
                    renotify: true,
                    requireInteraction: true
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any);
                });
              }

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
    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      state: 'done', 
      timerActive: false,
      finishedAt: Date.now() 
    } : t));
  }

  const handleStartTimer = (id: string) => {
    const startTime = Date.now();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      state: 'in-progress', 
      timerActive: true, 
      timerStartTime: startTime,
      timerDuration: TIMER_MS 
    } : t));

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'START_TIMER',
        payload: {
          id,
          description: task.description,
          endTime: startTime + TIMER_MS
        }
      });
    }
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
