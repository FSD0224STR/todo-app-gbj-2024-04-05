export function readTasksFromServerAsFetchThen(setAllTasks, setDailyTasks, setError) {
  fetch("http://localhost:3000/all-tasks", { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      setAllTasks(jsonResponse.tasks);
    })
    .catch((err) => {
      setError(true);
    });

  fetch("http://localhost:3000/daily-tasks", { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      setDailyTasks(jsonResponse.tasks);
    })
    .catch((err) => {
      setError(true);
    });
}
export async function readTasksFromServer(date) {
  const allTasksPromise = fetch("http://localhost:3000/all-tasks", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
  const tasksByDatePromise = fetch("http://localhost:3000/tasks-by-date?date=" + date, {
    method: "GET",
  }).then((response) => {
    return response.json();
  });

  const both = await Promise.all([allTasksPromise, tasksByDatePromise]);
  return {
    all: both[0].tasks,
    byDate: both[1].tasks,
  };
}
