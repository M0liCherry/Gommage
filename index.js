const express = require('express');
const app = express();
const cron = require('node-cron');
let task = [];
let id = 0;

app.use(express.json());


app.post('/schedule', (req, res) => {
  const { time, message } = req.body;
  
  const job = cron.schedule(time, () => {
    console.log(`Task ${id}: ${message}`);
    });

    task.push({
        id: id,
        time,
        message,
        job
    });

    res.json({ message: 'Task scheduled successfully', id:id });

    id++;
});

app.get("/tasks", (req, res) => {
    res.json(task.map(t => ({ id: t.id, 
    time: t.time, 
    message: t.message })));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});