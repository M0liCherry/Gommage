import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/tasks")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setTasks(data);
      });
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map(t => (
        <p key={t.id}>
          {t.message} ({t.time})
        </p>
      ))}
    </div>
  );
}

export default App;