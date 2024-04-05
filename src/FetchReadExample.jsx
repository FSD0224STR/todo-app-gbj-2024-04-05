import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/tasks", {method:"GET"})
      .then((response) => response.json())
      .then((jsonResponse) => {
        setTasks(jsonResponse.tasks);
      });
    setFetchLaunched(true);
  }, []);
  
  return (
    <>
    <input type="text" onChange={handleChangeText1} />
      <input type="text" onChange={handleChangeText2} />

      <div>
        {validPass ? 'Valid' : 'not valid'}
      </div>
    <div className='task-list'>
      {tasks.map((task) => <div className='task-item'>{task.name}</div>)}
    </div>
    </>
  )
}

export default App
