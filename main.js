let newTask = document.getElementById('task');
let addButton = document.getElementById('add');
let searchField = document.getElementById('search');
let totalTasks = document.getElementById('total');
let todos;

if (localStorage.getItem("todos") != null) {
    todos = JSON.parse(localStorage.getItem('todos'));
    updateTodoList(todos);
} else {
    fetchTodos();
}

async function fetchTodos() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        todos = data.todos;
        updateTodoList(todos);
    } catch (error) {
        console.error('Error fetching the todos:', error);
    }
}

function updateTodoList(todoArray) {
    let tab = '';
    todoArray.forEach(todo => {
        const rowClass = todo.completed ? 'completed' : '';
        tab += `<tr data-id="${todo.id}" class="${rowClass}">
            <td>${todo.id}</td>
            <td class="${rowClass}">${todo.todo}</td> <!-- Applies line-through style if completed -->
            <td>${todo.userId}</td>
            <td>${todo.completed ? "Completed" : "Pending"}</td>
            <td>
                <div class="action-buttons">
                    <button class="delete-btn" onclick="deletTodo(${todo.id})">Delete</button>
                    <button class="done-btn" onclick="markAsDone(${todo.id})">${todo.completed ? "Undo" : "Done"}</button>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('tbody').innerHTML = tab;
    totalTasks.innerText = todoArray.length;
    localStorage.setItem('todos', JSON.stringify(todoArray)); // Updated to use todoArray
}

addButton.addEventListener('click', function () {
    let task = newTask.value;
    if (task === "") {
        alert("Task field cannot be empty!");
        return;
    }

    let newTodoTask = {
        "id": todos.length + 1,
        "todo": task,
        "completed": false,
        "userId": parseInt(Math.random() * (1000 + 1) + 1)
    };

    todos.push(newTodoTask);
    updateTodoList(todos);
    newTask.value = "";
});

function deletTodo(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        todos = todos.filter(todo => todo.id !== id);
        updateTodoList(todos);
    }
}

function markAsDone(id) {
    todos.forEach(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
    });
    updateTodoList(todos);
}

