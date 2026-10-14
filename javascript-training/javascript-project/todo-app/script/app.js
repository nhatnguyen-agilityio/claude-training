// select items
const input = document.getElementById("text");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".list-todo");

const todosLS = JSON.parse(localStorage.getItem('todos'));
const completedLS = JSON.parse(localStorage.getItem('completed')) || [];

// handle submit
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

// add todo
const addTodo = (todo, index) => {
  let text = input.value;
  let checked = false;

  if(todo) {
    text = todo.todo;
    checked = completedLS.includes(index);
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
      const position = [...todoList.children].indexOf(todo);
      updateCompleted(position, check.checked);
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
      todo: todo.querySelector('.todo-text').innerHTML
    })
  })
  localStorage.setItem('todos', JSON.stringify(todoLS));
}

// save completed todos by their position in the list
const updateCompleted = (position, checked) => {
  const found = completedLS.indexOf(position);
  if (checked && found === -1) completedLS.push(position);
  if (!checked && found !== -1) completedLS.splice(found, 1);
  localStorage.setItem('completed', JSON.stringify(completedLS));
}

todosLS.forEach((item, index) => {
  addTodo(item, index)
})