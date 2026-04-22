const express = require('express');
const app = express();

const Redis = require("ioredis");
const redis = new Redis();

const { v4: uuidv4 } = require('uuid');
const cors = require("cors");

app.use(cors());
app.use(express.json());

// CREATE TASK
app.post("/schedule", async (req, res) => {
  const { time, message } = req.body;

  const taskId = uuidv4();

  const task = {
    id: taskId,
    time,
    message,
    counter: 0,
    status: "pending",
    type: "log"
  };

  await redis.set(`task:${taskId}`, JSON.stringify(task));

  res.json({ message: "Task scheduled", id: taskId });
});

// UI TASKS
app.get("/ui-tasks", async (req, res) => {
  const keys = await redis.keys("task:*");

  const tasks = await Promise.all(keys.map(k => redis.get(k)));

  const ui = tasks.map(t => {
    const task = JSON.parse(t);
    return {
      TaskId: task.id,
      Time: task.time,
      Message: task.message,
      Counter: task.counter,
      Status: task.status,
      Actions: {
        delete: `/task/${task.id}`,
        logs: `/logs/${task.id}`
      }
    };
  });

  res.json(ui);
});

// LOGS
app.get("/logs/:id", async (req, res) => {
  const logs = await redis.lrange(`logs:${req.params.id}`, 0, -1);
  res.json(logs);
});

// DELETE
app.delete("/task/:id", async (req, res) => {
  await redis.del(`task:${req.params.id}`);
  await redis.del(`logs:${req.params.id}`);
  res.send("Deleted");
});

app.listen(5000, () => console.log("Server running on 5000"));