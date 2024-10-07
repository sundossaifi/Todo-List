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
    for (let i = 0; i < todoArray.length; i++) {
        const todo = todoArray[i];
        const rowClass = todo.completed ? 'completed' : '';
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
    document.getElementById('tbody').innerHTML = tab;
    totalTasks.innerText = todoArray.length;
    localStorage.setItem('todos', JSON.stringify(todoArray));
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
        "userId": Date.now()
    };

    todos.push(newTodoTask);
    updateTodoList(todos);
    newTask.value = "";
    searchField.value = "";
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
        todos = todos.filter(todo => todo.id !== id);
        todos.forEach((todo, i) => {
            todo.id = i + 1;
        });
        updateTodoList(todos);
    }
}

function markAsDone(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        updateTodoList(todos);
    }
}

searchField.addEventListener('input', function () {
    let searchValue = searchField.value.toLowerCase();
    let filteredTodos = todos.filter(todo => todo.todo.toLowerCase().includes(searchValue));
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
        event.target.innerText = todos.find(todo => todo.id === id).todo;
        return;
    }

    const todo = todos.find(todo => todo.id === id);
    if (todo && todo.todo !== updatedTask) {
        todo.todo = updatedTask;
        updateTodoList(todos);
    }
}




