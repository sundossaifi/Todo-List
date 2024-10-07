const apiBaseUrl = "https://dummyjson.com/todos";
let newTask = document.getElementById("task");
let addButton = document.getElementById("add");
let searchField = document.getElementById("search");
let totalTasks = document.getElementById("total");
let todos = [];
let filteredTodos = [];

if (localStorage.getItem("todos") != null) {
    todos = JSON.parse(localStorage.getItem("todos"));
    filteredTodos = todos;
    updateTodoList(filteredTodos);
} else {
    fetchTodos();
}


async function fetchTodos() {
    try {
        const response = await fetch(apiBaseUrl);
        const data = await response.json();
        todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : data.todos;
        filteredTodos = todos;
        updateTodoList(filteredTodos);
    } catch (error) {
        console.error("Error fetching the todos:", error);
    }
}

function updateTodoList(todoArray) {
    let tab = "";
    for (let todo of todoArray) {
        const rowClass = todo.completed ? "completed" : "";
        tab += `<tr data-id="${todo.id}" class="${rowClass}">
                  <td>${todo.id}</td>
                  <td contenteditable="true" class="${rowClass}" onblur="saveNewTaskDescription(event, ${todo.id})" 
                  onkeydown="checkEnter(event)">${todo.todo}</td>
                  <td>${todo.userId}</td>
                  <td>${todo.completed ? "Completed" : "Pending"}</td>
                  <td>
                      <div class="action-buttons">
                          <button class="delete-btn">Delete</button>
                          <button class="done-btn">${todo.completed ? "Undo" : "Done"}</button>
                      </div>
                  </td>
              </tr>`;
    }
    document.getElementById("tbody").innerHTML = tab;
    totalTasks.innerText = filteredTodos.length;
}

addButton.addEventListener("click", function () {
    let task = newTask.value.trim();
    if (task === "") {
        alert("Task field cannot be empty!");
        return;
    }
    const duplicateTask = todos.find(
        (todo) => todo.todo.toLowerCase() === task.toLowerCase()
    );
    if (duplicateTask) {
        alert("Task already exists!");
        return;
    }

    let newTodoTask = {
        id: todos.length + 1,
        todo: task,
        completed: false,
        userId: Math.floor(Math.random() * 200) + 1,
    };

    fetch(`${apiBaseUrl}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodoTask),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                todos.push(newTodoTask);
                filteredTodos = todos;
                updateTodoList(filteredTodos);
                localStorage.setItem("todos", JSON.stringify(todos));
                const tbody = document.getElementById("tbody");
                const newRow = tbody.lastElementChild;
                newRow.scrollIntoView({ behavior: "smooth", block: "end" });
                newTask.value = "";
                searchField.value = "";
            } else {
                console.error("Failed to add the task.");
            }
        })
        .catch((error) => {
            console.error("Error while adding the task:", error);
        });
});

document.getElementById('tbody').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = parseInt(event.target.closest('tr').dataset.id);
        deleteTodo(id);
    }
    if (event.target.classList.contains('done-btn')) {
        const id = parseInt(event.target.closest('tr').dataset.id);
        markAsDone(id);
    }
});

function deleteTodo(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        fetch(`${apiBaseUrl}/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    todos = todos.filter((todo) => todo.id !== id);
                    filteredTodos = filteredTodos.filter((todo) => todo.id !== id);
                    todos.forEach((todo, i) => {
                        todo.id = i + 1;
                    });
                    updateTodoList(filteredTodos);
                    localStorage.setItem("todos", JSON.stringify(todos));
                } else {
                    console.error("Failed to delete the task.");
                }
            })
            .catch((error) => {
                console.error("Error while deleting the task:", error);
            });
    }
}

function markAsDone(id) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
        const newStatus = !todo.completed;

        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newStatus }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    todo.completed = newStatus;
                    const filteredTodo = filteredTodos.find((t) => t.id === id);
                    if (filteredTodo) {
                        filteredTodo.completed = newStatus;
                    }
                    updateTodoList(filteredTodos);
                    localStorage.setItem("todos", JSON.stringify(todos));
                } else {
                    console.error("Failed to update the task.");
                }
            })
            .catch((error) => {
                console.error("Error while updating the task:", error);
            });
    }
}

searchField.addEventListener('input', function () {
    let searchValue = searchField.value.toLowerCase();
    filteredTodos = todos.filter(todo => todo.todo.toLowerCase().includes(searchValue));
    updateTodoList(filteredTodos);
});

function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
    }
}

function saveNewTaskDescription(event, id) {
    const updatedTask = event.target.innerText.trim();
    if (updatedTask === "") {
        alert("Task description cannot be empty!");
        event.target.innerText = todos.find((todo) => todo.id === id).todo;
        return;
    }

    const todo = todos.find((todo) => todo.id === id);
    if (todo && todo.todo !== updatedTask) {
        todo.todo = updatedTask;
        const filteredTodo = filteredTodos.find((t) => t.id === id);
        if (filteredTodo) {
            filteredTodo.todo = updatedTask;
        }
        updateTodoList(filteredTodos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}