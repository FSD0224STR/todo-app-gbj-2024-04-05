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
export async function readTasksFromServer() {
  const allTasksPromise = fetch("http://localhost:3000/all-tasks", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
  const dailyTasksPromise = fetch("http://localhost:3000/daily-tasks", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });

  const both = await Promise.all(allTasksPromise, dailyTasksPromise);
  return {
    all: both[0],
    daily: both[1],
  };
}
