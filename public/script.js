const API_URL = 'https://task-manager-eta-eight.vercel.app/api';

document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task-btn');
  let tasks = [];

  async function fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    tasks = await response.json();
    renderTasks();
  }

  async function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('list-group-item', 'task-item');

      const taskDetails = document.createElement('div');
      taskDetails.classList.add('task-details');
      taskDetails.innerHTML = `
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <small>Due: ${task.dueDate}</small>
      `;

      const taskActions = document.createElement('div');
      taskActions.classList.add('task-actions');
      taskActions.innerHTML = `
        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      `;

      taskItem.appendChild(taskDetails);
      taskItem.appendChild(taskActions);

      taskList.appendChild(taskItem);

      taskActions.querySelector('.edit-btn').addEventListener('click', () => editTask(index));
      taskActions.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));
    });
  }

  async function addTaskHandler() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, dueDate })
    });

    const newTask = await response.json();
    tasks.push(newTask);
    renderTasks();
  }

  async function editTask(index) {
    const task = tasks[index];
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due-date').value = task.dueDate;
    addTaskBtn.textContent = 'Update Task';
    addTaskBtn.onclick = async () => {
      const updatedTask = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dueDate: document.getElementById('due-date').value,
      };

      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });

      tasks[index] = await response.json();
      addTaskBtn.textContent = 'Add Task';
      addTaskBtn.onclick = addTaskHandler;
      renderTasks();
    };
  }

  async function deleteTask(index) {
    const taskId = tasks[index].id;

    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });

    tasks.splice(index, 1);
    renderTasks();
  }

  addTaskBtn.addEventListener('click', addTaskHandler);

  fetchTasks();
});
