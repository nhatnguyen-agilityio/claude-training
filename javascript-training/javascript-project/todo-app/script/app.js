// select items
const input = document.getElementById("text");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".list-todo");

const todosLS = JSON.parse(localStorage.getItem('todos'));

// todos saved by the old version kept their completed status by position
const legacyCompletedLS = JSON.parse(localStorage.getItem('completed'));
if (legacyCompletedLS && todosLS) {
  legacyCompletedLS.forEach((position) => {
    if (todosLS[position]) todosLS[position].checked = true;
  });
}
localStorage.removeItem('completed');

// handle submit
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

// add todo
const addTodo = (todo) => {
  let text = input.value;
  let checked = false;

  if(todo) {
    text = todo.todo;
    checked = todo.checked;
  }

  if (text) {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.innerHTML = `
      <input class="icon check" type="checkbox" ${checked ? 'checked' : ''}/>
      <p class="todo-text" for="">${text}</p>
      <button class="icon remove" type="button"><i class="fas fa-times"></i></button>
    `;
    todoList.appendChild(todo);
    input.value = "";

    const check = todo.querySelector('.check');
    check.addEventListener('click', () => {
      updateLS();
    })
    todo.addEventListener('contextmenu', () => {
      todo.remove();
      updateLS();
    })
    updateLS();
    removeTodo();
  }
}

// remove todo
const removeTodo = () => {
  const removeBtn = document.querySelectorAll(".remove");
  removeBtn.forEach((element) => {
    element.addEventListener("click", () => {
      const parentEl = element.parentElement;
      parentEl.remove();
      updateLS();
    });
  });
};

const updateLS = () => {
  const todos = document.querySelectorAll('.todo');
  const todoLS = [];
  todos.forEach((todo) => {
    todoLS.push({
      todo: todo.querySelector('.todo-text').innerHTML,
      checked: todo.querySelector('.check').checked
    })
  })
  localStorage.setItem('todos', JSON.stringify(todoLS));
}

todosLS.forEach((item) => {
  addTodo(item)
})