import { useEffect, useState } from 'react'
import './App.css'
import { readTasksFromServer } from './api-calls';
import { todayInString } from './utils';
import Loader from './loader';


function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [dateTasks, setDateTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayInString());
  const [error, setError] = useState(false);

  useEffect(() => {
    const reloadTasksState = async () => {
      setLoading(true);
      const tasks = await readTasksFromServer(date);
      setAllTasks(tasks.all);
      setDateTasks(tasks.byDate);
      setLoading(false);
    };
    reloadTasksState();
}, [date]);
  // useEffect(() => {
  //   console.log('new Date: ' + date);
  //   return () => {
  //     console.log('old Date:' + date);
  //   };
  // }, [date]);


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
    }).then(async (body) => {
      const tasks = await readTasksFromServer();
      setAllTasks(tasks.all);
      setDailyTasks(tasks.daily);
    }).catch(() => {
      setError(true);
    })
  }
  const handleChangeDate = (event) => {
    setDate(event.target.value)
  }
  
  return (
    <>
    {error && <span>Errrrrooorr</span>}
    <button onClick={handleAddRandomTaskClick}> Add Random task</button>
    <input type="date" onChange={handleChangeDate}/>
    <span>{date}</span>
    <div className='task-list'>
      <h1>Tasks of day {date}</h1>
      {!loading && dateTasks.map((task) => <div className='task-item'>{task.name}</div>)}
      {loading && <Loader />}
    </div>
    <div className='task-list'>
      <h1>All tasks</h1>
      {allTasks.map((task) => <div className='task-item'>{task.name}</div>)}
    </div>
    </>
  )
}

export default App
