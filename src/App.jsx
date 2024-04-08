import { useEffect, useState } from 'react'
import './App.css'
import { readTasksFromServer } from './api-calls';
import { todayInString, isFutureDate } from './utils';
import Loader from './loader';


function App() {
  const [allTasks, setAllTasks] = useState([]);
  const [dateTasks, setDateTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayInString());
  const [error, setError] = useState(false);
  const [formError, setFormError] = useState('');

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

  const handleChangeDate = (event) => {
    setDate(event.target.value)
  }
  const handleOnSubmit = (event) => {
    event.preventDefault();
    const taskName = event.target.taskName.value;
    const taskDate = event.target.taskDate.value;
    // 1. task Name has at least 3 characters

   
    // 2. task Name has less than 20 characters
    if (taskName.length > 20) {
      setFormError('Task name should be less than 20 chars long');
      return;
    }
    // 3. date is present
    if (taskDate === '') { 
      setFormError('Date is mandatory');
      return;
    }
    
    // 4. date is after today
    if (!isFutureDate(taskDate)) { 
      setFormError('Date should be a future date');
      return;
    }
    

    // fetch
    setFormError('');
    const body = { name: taskName, date: taskDate};
    setLoading(true);
    fetch("http://localhost:3000/task", {
        method:"POST", 
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(async (response) => {
      return response.json()
    }).then(async (body) => {
      const tasks = await readTasksFromServer(date);
      setAllTasks(tasks.all);
      setDateTasks(tasks.byDate);
      setLoading(false);
    }).catch(() => {
      setError(true);
    })
  }
  
  return (
    <>
    <div >
      <form className='task-form' onSubmit={handleOnSubmit} action="" method='GET'>
        <input type="text" name="taskName" placeholder='name' 
        validation={() => {
          if (taskName.length < 3) {
            setFormError('Task name should be at least 3 chars long');
            return;
          }
        }}/>
        <input type="date" name="taskDate"  />
        {formError && <span className='form-error'>{formError}</span>}
        <button type="submit"  > Add task</button>
      </form>
    </div>
    {error && <span>Errrrrooorr</span>}
    <input type="date" onChange={handleChangeDate} />
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
