import { useEffect, useState } from 'react'
import './App.css'
import { readTasksFromServer } from './api-calls';


function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [error, setError] = useState(false);

  useEffect(async () => {
    const tasks = await readTasksFromServer();
    setAllTasks(tasks.all);
    setDailyTasks(tasks.dailyTasks);
  }, []);

  const handleAddRandomTaskClick = () => {
    fetch("http://localhost:3000/task", {
        method:"POST", 
        body: JSON.stringify({id: 12, name: 'comprar garbanzos', isTaskForToday: false}),
        headers: {
          'Content-Type': 'application/json'
        }
      }

    ).then(async (response) => {
      return response.json()
    }).then((body) => {
        const token = body.token;
    })
  }
  
  return (
    <>
    {error && <span>Errrrrooorr</span>}
    <button onClick={handleAddRandomTaskClick}> Add Random task</button>
    <div className='task-list'>
      <h1>All tasks</h1>
      {allTasks.map((task) => <div className='task-item'>{task.name}</div>)}
    </div>
    <div className='task-list'>
      <h1>Daily tasks</h1>
      {dailyTasks.map((task) => <div className='task-item'>{task.name}</div>)}
    </div>
    </>
  )
}

export default App
