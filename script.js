
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.getElementById("clearCompleted");

// ========================================
// 1. INITIAL TASKS AND APPLICATION STATE
// ========================================

const savedTasks = localStorage.getItem("myTasks");

let tasks = savedTasks !== null
    ? JSON.parse(savedTasks)
    : [
        {
            id: 1,
            text: "Complete JavaScript assignment",
            completed: false
        },
        {
            id: 2,
            text: "Practice coding for 30 minutes",
            completed: false
        },
        {
            id: 3,
            text: "Review today's study notes",
            completed: true
        }
    ];

let currentFilter = "all";
let editingTaskId = null;

if (savedTasks === null) {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// ========================================
// 2. DISPLAY CURRENT DATE
// ========================================

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// ========================================
// 3. SAVE TASKS TO LOCAL STORAGE
// ========================================

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// ========================================
// 4. UPDATE TASK STATISTICS
// ========================================

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}

// ========================================
// 5. DISPLAY TASKS
// ========================================

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "action-btn edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            taskInput.value = task.text;
            editingTaskId = task.id;
            submitButton.textContent = "Update Task";
            taskInput.focus();
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "action-btn delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);

            if (editingTaskId === task.id) {
                resetForm();
            }

            saveTasks();
            renderTasks();
        });

        actions.append(editButton, deleteButton);
        taskItem.append(checkbox, taskText, actions);
        taskList.appendChild(taskItem);
    });

    updateStats();
}

// ========================================
// 6. RESET FORM
// ========================================

function resetForm() {
    taskInput.value = "";
    editingTaskId = null;
    submitButton.textContent = "+ Add Task";
}

// ========================================
// 7. ADD AND UPDATE TASKS
// ========================================

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        return;
    }

    if (editingTaskId !== null) {
        const task = tasks.find(item => item.id === editingTaskId);

        if (task) {
            task.text = text;
        }
    } else {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    resetForm();
    renderTasks();
});

// ========================================
// 8. FILTER TASKS
// ========================================

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// ========================================
// 9. CLEAR COMPLETED TASKS
// ========================================

clearCompletedButton.addEventListener("click", () => {
    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    if (completedCount === 0) {
        alert("There are no completed tasks to clear!");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete all completed tasks?"
    );

    if (confirmClear) {
        tasks = tasks.filter(task => !task.completed);

        if (
            editingTaskId !== null &&
            !tasks.some(task => task.id === editingTaskId)
        ) {
            resetForm();
        }

        saveTasks();
        renderTasks();
    }
});

// ========================================
// 10. INITIALIZE APPLICATION
// ========================================

renderTasks();
