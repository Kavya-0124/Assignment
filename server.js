const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];
let currentId = 1;

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  const newTask = { id: currentId++, title, description, dueDate };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Retrieve a single task by its ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, dueDate } = req.body;
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
