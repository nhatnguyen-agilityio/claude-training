// select items
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const groceryList = document.querySelector('.grocery-list');
const alertValue = document.querySelector('.alert');
const clear = document.querySelector('.clear-btn');
const submitBtn = document.querySelector('.submit-btn');
let listTask = [];
let isEdit = false;
let idItem;

// add item
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(grocery.value && !isEdit) {
    listTask.push({id: listTask.length +1, title: grocery.value});
    grocery.value = '';
    renderTask();
    renderAlert('Add task success', 'alert-success')
  }
  else if (grocery.value && isEdit) {
    listTask.forEach((item, index) => {
      if(item.id === idItem) {
        listTask.splice(index, 1, {id: item.id, title: grocery.value});
      }
    })
    grocery.value = '';
    isEdit = false;
    submitBtn.innerHTML = 'submit'
    renderTask();
    renderAlert('Edit task success', 'alert-success')
  }
  else {
    renderAlert('please enter value!', 'alert-danger')
  }
})

// render alert
const renderAlert = (message, classAlert) => {
  alertValue.innerHTML = message;
  alertValue.classList.add(classAlert)

  setTimeout(() => {
    alertValue.innerHTML = '';
    alertValue.classList.remove(classAlert)
  }, 1000);
} 

// render list
const renderTask = () => {
  groceryList.innerHTML = listTask.map((item) => {
    return `<article class="grocery-item">
    <p class="title">${item.title}</p>
    <div class="btn-container" data-id = "${item.id}">
      <button class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </article>`
  }).join('')
  editItem();
  deleteItem();
}

//clear list 
clear.addEventListener('click', () => {
  listTask = [];
  renderTask();
})

// edit item
const editItem = () => {
  const edit = document.querySelectorAll('.edit-btn');
  edit.forEach((item) => {
    item.addEventListener('click', () => {
      const valueEdit = item.parentElement.previousElementSibling.innerHTML;
      idItem = parseInt(item.parentElement.dataset.id);
      grocery.value = valueEdit;
      isEdit = true;
      submitBtn.innerHTML = 'edit'
    })
  })
}

// delete item
const deleteItem = () => {
  const deleteBtn = document.querySelectorAll('.delete-btn');
  deleteBtn.forEach((item) => {
    item.addEventListener('click', () => {
      idItem = parseInt(item.parentElement.dataset.id);
      listTask.forEach((item,index) => {
        if(item.id === idItem) {
          listTask.splice(index, 1);
        }
      })
      renderTask();
    })
  })
}
