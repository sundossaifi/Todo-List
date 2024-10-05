let newTask = document.getElementById('task');
let addButton = document.getElementById('add');
let searchField = document.getElementById('search');
let totalTasks = document.getElementById('total');
let todos;

if (localStorage.getItem("todos") != null) {
    todos = JSON.parse(localStorage.getItem('todos'));
    updateTodoList();
} else {
    fetchTodos();
}

async function fetchTodos() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        todos = data.todos;
        updateTodoList();
    } catch (error) {
        console.error('Error fetching the todos:', error);
    }
}

function updateTodoList() {
    let tab = '';
    todos.forEach(todo => {
        tab += `<tr data-id="${todo.id}">
            <td>${todo.id}</td>
            <td>${todo.todo}</td>
            <td>${todo.userId}</td>
            <td>${todo.completed ? "Completed" : "Pending"}</td>
            <td>
                <div class="action-buttons">
                    <button class="delete-btn" onclick=deletTodo(${todo.id})>Delete</button>
                    <button class="done-btn" onclick=>${todo.completed ? "Undo" : "Done"}</button>
                </div>
            </td>
        </tr>`;
    });
    document.getElementById('tbody').innerHTML = tab;
    totalTasks.innerText = todos.length;
    localStorage.setItem('todos', JSON.stringify(todos));
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
    updateTodoList();
    newTask.value = "";
});

function deletTodo(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        todos = todos.filter(todo => todo.id !== id);
        updateTodoList();
    }
}

