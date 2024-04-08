import { useEffect, useState } from 'react'
import './App.css'
import { readTasksFromServer } from './api-calls';
import { todayInString, isFutureDate } from './utils';
import Loader from './loader';
import { useForm } from "react-hook-form"



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
  const handleChangeDate = (event) => {
    setDate(event.target.value)
  }
  const { register, 
    formState: { errors },
    handleSubmit 
  } = useForm();

  const handleOnSubmit2 = (data) => {
    const body = { name: data.taskName, date: data.taskDate};
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
      <form className='task-form' onSubmit={handleSubmit(handleOnSubmit2)} action="" method='GET'>
        <input type="text" {...register('taskName', {required: true, minLength: 3, maxLength: 20})}/>
        <input type="date" {...register('taskDate', {required: true, validate: { isFutureDate: (value) => isFutureDate(value)}})}  />
        {errors.taskName?.type === "required" && (
          <p role="alert">Name is required</p>
        )}
        {errors.taskName?.type === "minLength" && (
          <p role="alert">Name min length is 3</p>
        )}
        {errors.taskName?.type === "maxLength" && (
          <p role="alert">Name max length is 20</p>
        )}
        {errors.taskDate?.type === "required" && (
          <p role="alert">Date is required</p>
        )}
        {errors.taskDate?.type === "isFutureDate" && (
          <p role="alert">Date should be a future date</p>
        )}
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
