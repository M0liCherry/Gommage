const cron = require("node-cron");
const Redis = require("ioredis");

const redis = new Redis();
let runningJobs = {};

async function addLog(id, msg) {
  await redis.lpush(`logs:${id}`, `${new Date().toISOString()} - ${msg}`);
}

function scheduleTask(task) {
  if (runningJobs[task.id]) return;

  const job = cron.schedule(task.time, async () => {
    const lock = await redis.set(`lock:${task.id}`, "1", "NX", "EX", 10);
    if (!lock) return;

    console.log(`Executing ${task.id}`);
    await addLog(task.id, "STARTED");

    let data = JSON.parse(await redis.get(`task:${task.id}`));
    data.status = "running";

    await redis.set(`task:${task.id}`, JSON.stringify(data));

    // simulate work
    await addLog(task.id, "SUCCESS");

    data.status = "success";
    data.counter++;

    await redis.set(`task:${task.id}`, JSON.stringify(data));
  });

  runningJobs[task.id] = job;
}

async function loadTasks() {
  const keys = await redis.keys("task:*");

  for (let key of keys) {
    const task = JSON.parse(await redis.get(key));
    scheduleTask(task);
  }
}

setInterval(loadTasks, 5000);
loadTasks();

console.log("Worker running...");