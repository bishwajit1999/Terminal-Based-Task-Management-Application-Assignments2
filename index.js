const readline = require("readline");

let tasks = [];
let taskId = 1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

// Add Task
async function addTask() {
  const title = await prompt("Enter task title: ");
  const dueDate = await prompt("Enter due date (YYYY-MM-DD): ");

  if (!title || !dueDate) {
    console.log("❌ Error: Title and due date cannot be empty.");
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    console.log("❌ Error: Invalid date format.");
    return;
  }

  tasks.push({ id: taskId++, title, dueDate, completed: false });
  console.log(`✅ Task "${title}" added.`);
}

// List Tasks
function listTasks() {
  if (tasks.length === 0) {
    console.log("📭 No tasks available.");
    return;
  }

  tasks.forEach((task) => {
    const status = task.completed ? "✅ Completed" : "⏳ Pending";
    console.log(`[${task.id}] ${task.title} | Due: ${task.dueDate} | Status: ${status}`);
  });
}

// Complete Task
async function completeTask() {
  const identifier = await prompt("Enter task ID or title to complete: ");
  const task = findTask(identifier);
  if (!task) return;

  if (task.completed) {
    console.log("ℹ️ Task already completed.");
  } else {
    task.completed = true;
    console.log(`✅ Task "${task.title}" marked completed.`);
  }
}

// Update Task
async function updateTask() {
  const identifier = await prompt("Enter task ID or title to update: ");
  const task = findTask(identifier);
  if (!task) return;

  const newTitle = await prompt("Enter new title (leave empty to keep current): ");
  const newDueDate = await prompt("Enter new due date (YYYY-MM-DD, leave empty to keep current): ");

  if (newTitle) task.title = newTitle;
  if (newDueDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDueDate)) {
      console.log("❌ Error: Invalid date format.");
      return;
    }
    task.dueDate = newDueDate;
  }

  console.log("✅ Task updated.");
}

// Delete Task
async function deleteTask() {
  const identifier = await prompt("Enter task ID or title to delete: ");
  const index = tasks.findIndex(
    (t) => t.id.toString() === identifier || t.title.toLowerCase() === identifier.toLowerCase()
  );

  if (index === -1) {
    console.log("❌ Task not found.");
    return;
  }

  const removed = tasks.splice(index, 1)[0];
  console.log(`🗑️ Task "${removed.title}" deleted.`);
}

// Search Tasks
async function searchTasks() {
  const keyword = await prompt("Enter title or due date to search: ");
  const results = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(keyword.toLowerCase()) ||
      t.dueDate.includes(keyword)
  );

  if (results.length === 0) {
    console.log("🔍 No matching tasks found.");
    return;
  }

  results.forEach((task) => {
    const status = task.completed ? "✅ Completed" : "⏳ Pending";
    console.log(`[${task.id}] ${task.title} | Due: ${task.dueDate} | Status: ${status}`);
  });
}

// Help
function showHelp() {
  console.log("\n📖 Available Commands:");
  console.log(" add-task       - Add a new task");
  console.log(" list-tasks     - Show all tasks");
  console.log(" complete-task  - Mark task as completed");
  console.log(" update-task    - Update title or due date of a task");
  console.log(" delete-task    - Delete a task");
  console.log(" search-tasks   - Search tasks by title or due date");
  console.log(" help           - Show this help menu");
  console.log(" exit           - Exit the application\n");
}

// Find task by ID or title
function findTask(identifier) {
  const task = tasks.find(
    (t) => t.id.toString() === identifier || t.title.toLowerCase() === identifier.toLowerCase()
  );
  if (!task) {
    console.log("❌ Task not found.");
  }
  return task;
}

// Main CLI
async function main() {
  console.log("📋 Welcome to Terminal Task Manager (L1 Version)");
  showHelp();

  while (true) {
    const command = await prompt("> ");

    switch (command.toLowerCase()) {
      case "add-task":
        await addTask();
        break;
      case "list-tasks":
        listTasks();
        break;
      case "complete-task":
        await completeTask();
        break;
      case "update-task":
        await updateTask();
        break;
      case "delete-task":
        await deleteTask();
        break;
      case "search-tasks":
        await searchTasks();
        break;
      case "help":
        showHelp();
        break;
      case "exit":
        console.log("👋 Exiting. Goodbye!");
        rl.close();
        return;
      default:
        console.log("❓ Unknown command. Type 'help' to see available commands.");
    }
  }
}

main();
