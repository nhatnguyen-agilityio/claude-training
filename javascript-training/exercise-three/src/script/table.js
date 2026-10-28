// Javascript exercise 3
/*
  Target: DOM manipulation with simple table, form
*/

//Create new task array
  const taskList = []; 
// selecting tbody element
  const tBody = document.getElementById('tb-body');
//selecting input, select, submit element
  const taskName = document.getElementById('taskName');
  const statusNumber = document.getElementById('status');
  const btnSubmit = document.getElementById('btnSubmit');

// function handleAddTask
const handleAddTask = (e) => {
  e.preventDefault();
  if(taskName.value === '') {
    alert('Please enter task name')
    return;
  }
  //push item into taskList
  taskList.push({
    taskName: taskName.value,
    statusNumber: 0,
    statusCount: parseInt(statusNumber.value),
    isFinish: false,
  });
  taskName.value = '';
  renderTask(taskList);
}

//render tbody in screen
const renderTask = (taskList) => {
  tBody.innerHTML = taskList.map((element, index) => {
    return `
      <tr>
        <td>${element.taskName}</td>
        <td>${element.statusNumber}/${element.statusCount} pomodori</td>
        <td>${element.isFinish ? 'Finish' : `<button class = "done" data-id = "${index}">Done</button><button class="increase" data-id = "${index}">Increase Pomodoro Count</button>`}
        <button class = "delete" data-id = "${index}">Delete</button>
        </td>
      </tr>
    `
  }).join('');
  taskEvent();
}

//handleDoneTask
const doneTask = (e) => {
  taskList[e.target.dataset.id].isFinish = true;
  renderTask(taskList);
}
//handleIncreasePomodoroDone
const handleIncreasePomodoroDone = (e) => {
  const begin = taskList[e.target.dataset.id].statusNumber;
  const end = taskList[e.target.dataset.id].statusCount;
  if(begin < end) {
    taskList[e.target.dataset.id].statusNumber += 1;
  renderTask(taskList);
  }
}

//handleDeleteTask
const handleDeleteTask = (e) => {
  taskList.splice(e.target.dataset.id, 1);
  renderTask(taskList);
}

// list event for table
const taskEvent = () => {
  // done task
  document.querySelectorAll('.done').forEach((element) => {
    element.addEventListener('click', doneTask);
  })
  //Increase Pomodoro Done
  document.querySelectorAll('.increase').forEach((element) => {
    element.addEventListener('click', handleIncreasePomodoroDone);
  })
  //delete task
  document.querySelectorAll('.delete').forEach((element) => {
    element.addEventListener('click', handleDeleteTask);
  })

}


window.addEventListener('load', () => {
  btnSubmit.addEventListener('submit', handleAddTask);
})
