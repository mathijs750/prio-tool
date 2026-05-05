import { useState, useEffect } from 'react'
import './index.css'
import type { ITask } from './types'
import { TaskList } from './components/TaskList'
import { QuickAdd } from './components/QuickAdd'
import { AddTaskModal } from './components/AddTaskModal'
import { TimerFinishedModal } from './components/TimerFinishedModal'
import { TimerEstimationModal } from './components/TimerEstimationModal'
import { TimeSpentPromptModal } from './components/TimeSpentPromptModal'
import { SubTaskCompletionModal } from './components/SubTaskCompletionModal'

const TIMER_MS = 30 * 60 * 1000;
const EXTEND_MS = 10 * 60 * 1000;
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
  const [taskForEstimation, setTaskForEstimation] = useState<ITask | null>(null);
  const [taskForTimePrompt, setTaskForTimePrompt] = useState<ITask | null>(null);
  const [taskForSubTaskCompletion, setTaskForSubTaskCompletion] = useState<ITask | null>(null);
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

  const stopServiceWorkerTimer = (id: string) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'STOP_TIMER',
        payload: { id }
      });
    }
  }

  const handleCompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.subTasks && task.subTasks.length > 0) {
      setTaskForSubTaskCompletion(task);
      return;
    }

    finalizeTaskCompletion(id);
  }

  const finalizeTaskCompletion = (id: string, subTasks?: ISubTask[]) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const allSubTasksDone = subTasks ? subTasks.every(st => st.completed) : true;
    const newState = allSubTasksDone ? 'done' : task.state;
    const finishedAt = allSubTasksDone ? Date.now() : undefined;

    if (task.timerActive && task.timerStartTime) {
      stopServiceWorkerTimer(id);
      // calculate elapsed time and add to timeSpent
      const elapsed = Date.now() - task.timerStartTime;
      setTasks(prev => prev.map(t => t.id === id ? { 
        ...t, 
        state: newState, 
        timerActive: false,
        timerUsed: true,
        timeSpent: (t.timeSpent || 0) + elapsed,
        finishedAt,
        subTasks: subTasks || t.subTasks
      } : t));
    } else if (task.timerUsed && allSubTasksDone) {
      // Prompt for time spent if timer was used in the past and finishing
      if (subTasks) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, subTasks } : t));
      }
      setTaskForTimePrompt(task);
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { 
        ...t, 
        state: newState, 
        finishedAt,
        subTasks: subTasks || t.subTasks
      } : t));
    }
  }

  const handleConfirmSubTaskCompletion = (subTasks: ISubTask[]) => {
    if (!taskForSubTaskCompletion) return;
    finalizeTaskCompletion(taskForSubTaskCompletion.id, subTasks);
    setTaskForSubTaskCompletion(null);
  }

  const handleConfirmTimePrompt = (minutes: number) => {
    if (!taskForTimePrompt) return;
    const timeSpent = minutes * 60 * 1000;
    setTasks(prev => prev.map(t => t.id === taskForTimePrompt.id ? { 
      ...t, 
      state: 'done', 
      timeSpent,
      finishedAt: Date.now() 
    } : t));
    setTaskForTimePrompt(null);
  }

  const handleStartTimer = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTaskForEstimation(task);
  }

  const handleStopTimer = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.timerActive || !task.timerStartTime) return;

    stopServiceWorkerTimer(id);
    const elapsed = Date.now() - task.timerStartTime;
    
    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      timerActive: false,
      timeSpent: (t.timeSpent || 0) + elapsed,
      timerStartTime: undefined
    } : t));
  }

  const handleConfirmEstimation = (minutes: number) => {
    if (!taskForEstimation) return;
    const duration = minutes * 60 * 1000;
    const startTime = Date.now();
    
    setTasks(prev => prev.map(t => t.id === taskForEstimation.id ? { 
      ...t, 
      state: 'in-progress', 
      timerActive: true, 
      timerUsed: true,
      timerStartTime: startTime,
      timerDuration: duration,
      estimatedTime: duration
    } : t));

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'START_TIMER',
        payload: {
          id: taskForEstimation.id,
          description: taskForEstimation.description,
          endTime: startTime + duration
        }
      });
    }
    setTaskForEstimation(null);
  }

  const handleTimerFinishResponse = (action: 'extend' | 'stop' | 'done') => {
    if (!finishedTimerTask) return;
    const id = finishedTimerTask.id;
    const duration = finishedTimerTask.timerDuration || TIMER_MS;

    if (action === 'extend') {
      const startTime = Date.now();
      setTasks(prev => prev.map(t => t.id === id ? { 
        ...t, 
        state: 'in-progress', 
        timerActive: true, 
        timerStartTime: startTime,
        timerDuration: EXTEND_MS,
        timeSpent: (t.timeSpent || 0) + duration
      } : t));

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'START_TIMER',
          payload: {
            id,
            description: finishedTimerTask.description,
            endTime: startTime + EXTEND_MS
          }
        });
      }
    } else if (action === 'stop') {
      stopServiceWorkerTimer(id);
      setTasks(prev => prev.map(t => t.id === id ? { 
        ...t, 
        timerActive: false,
        timeSpent: (t.timeSpent || 0) + duration
      } : t));
    } else if (action === 'done') {
      stopServiceWorkerTimer(id);
      const task = tasks.find(t => t.id === id);
      if (task && task.subTasks && task.subTasks.length > 0) {
        setTaskForSubTaskCompletion(task);
      } else {
        finalizeTaskCompletion(id);
      }
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
        onStopTimer={handleStopTimer}
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

      <TimerEstimationModal
        task={taskForEstimation}
        onConfirm={handleConfirmEstimation}
        onCancel={() => setTaskForEstimation(null)}
      />

      <TimeSpentPromptModal
        task={taskForTimePrompt}
        onConfirm={handleConfirmTimePrompt}
        onCancel={() => setTaskForTimePrompt(null)}
      />

      <SubTaskCompletionModal
        task={taskForSubTaskCompletion}
        onConfirm={handleConfirmSubTaskCompletion}
        onCancel={() => setTaskForSubTaskCompletion(null)}
      />
    </>
  )
}

export default App
