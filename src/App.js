
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Task input state
  const [newTask, setNewTask] = useState({ text: '', dueDate: '' });

  // Task list state with localStorage load
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Dark mode state with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Add a new task
  const addTask = () => {
    if (newTask.text.trim() === '') return;
    setTasks([...tasks, { ...newTask, completed: false }]);
    setNewTask({ text: '', dueDate: '' });
  };

  // Toggle task completion
  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // Delete a task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Toggle light/dark mode
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1>📝 To-Do Planner</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask.text}
          onChange={(e) =>
            setNewTask({ ...newTask, text: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) =>
            setNewTask({ ...newTask, dueDate: e.target.value })
          }
        />
        <button onClick={addTask}>Add</button>
      </div>

     
    <ul>
  {tasks.map((t, index) => {
    const today = new Date();
    const dueDate = t.dueDate ? new Date(t.dueDate) : null;
    const isOverdue = dueDate && !t.completed && dueDate < new Date(today.toDateString());

    // Calculate countdown
    let countdownText = '';
    if (dueDate && !t.completed) {
      const timeDiff = dueDate - new Date(today.toDateString());
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (dayDiff === 0) {
        countdownText = '⚠️ Due today';
      } else if (dayDiff > 0) {
        countdownText = `🕒 Due in ${dayDiff} day${dayDiff > 1 ? 's' : ''}`;
      } else {
        countdownText = `⏰ Overdue by ${Math.abs(dayDiff)} day${Math.abs(dayDiff) > 1 ? 's' : ''}`;
      }
    }

    return (
      <li
        key={index}
        className={`${t.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      >
        <div>
          <span onClick={() => toggleComplete(index)}>{t.text}</span>
          {t.dueDate && (
            <>
              <div className="due-date">
                📅 {new Date(t.dueDate).toLocaleDateString()}
              </div>
              <div className="countdown">{countdownText}</div>
            </>
          )}
        </div>
        <button onClick={() => deleteTask(index)}>❌</button>
      </li>
    );
  })}
</ul>

    </div>
  );
}

export default App;
