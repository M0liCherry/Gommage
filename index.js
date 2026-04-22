const express = require('express');
const app = express();
const cron = require('node-cron');

const Redis = require("ioredis");
const redis = new Redis();

const { v4: uuidv4 } = require('uuid');
const axios = require("axios");

app.use(express.json());

// Store running jobs in memory (important for stopping)
let runningJobs = {};

// ✅ CREATE TASK
app.post("/schedule", async (req, res) => {
  const { time, message } = req.body;

  const taskId = uuidv4();

  const task = {
    id: taskId,
    time,
    message,
    counter: 0
  };

  // Save in Redis
  await redis.set(`task:${taskId}`, JSON.stringify(task));

  // Schedule cron
  const job = cron.schedule(time, async () => {

    // 🔐 Redis lock (prevents multiple servers running same job)
    const lock = await redis.set(`lock:${taskId}`, "locked", "NX", "EX", 60);

    if (lock) {
      console.log(`Task ${taskId}: ${message}`);

      // OPTIONAL: call external API
      // await axios.post("http://localhost:5000/test", { message });

      // update counter in Redis
      const data = await redis.get(`task:${taskId}`);
      if (data) {
        const updated = JSON.parse(data);
        updated.counter++;
        await redis.set(`task:${taskId}`, JSON.stringify(updated));
      }
    }
  });

  // store job reference in memory
  runningJobs[taskId] = job;

  res.json({ message: "Task scheduled", id: taskId });
});

// ✅ GET ALL TASKS
app.get("/tasks", async (req, res) => {
  const keys = await redis.keys("task:*");

  const tasks = await Promise.all(
    keys.map(key => redis.get(key))
  );

  res.json(tasks.map(t => JSON.parse(t)));
});

// ❌ DELETE TASK
app.delete("/task/:id", async (req, res) => {
  const taskId = req.params.id;

  const data = await redis.get(`task:${taskId}`);
  if (!data) return res.status(404).send("Task not found");

  // stop cron job
  if (runningJobs[taskId]) {
    runningJobs[taskId].stop();
    delete runningJobs[taskId];
  }

  // remove from Redis
  await redis.del(`task:${taskId}`);

  res.send("Task deleted");
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});