async function fetchTodos() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        const todos = data.todos;

        let tab = '';
        todos.forEach(todo => {
            tab += `<tr>
                <td>${todo.id}</td>
                <td>${todo.todo}</td>
                <td>${todo.userId}</td>
                <td>${todo.completed}</td>
                <td>
                  <div class="action-buttons">
                    <button id="delete">Delete</button>
                    <button id="done" class="done">Done</button>
                  </div>
                </td>
              </tr>`
        });
        document.getElementById('tbody').innerHTML = tab;
    } catch (error) {
        console.error('Error fetching the todos:', error);
    }
}