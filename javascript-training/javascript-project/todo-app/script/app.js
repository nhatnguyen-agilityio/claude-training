// select items
const input = document.getElementById("text");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".list-todo");

const todosLS = JSON.parse(localStorage.getItem('todos'));

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
      todo: todo.firstElementChild.nextElementSibling.innerHTML,
      checked: todo.firstElementChild.checked
    })
  })
  localStorage.setItem('todos', JSON.stringify(todoLS));
}

todosLS.forEach((item) => {
  addTodo(item)
})