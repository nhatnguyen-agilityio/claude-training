// select items
const toggleBtn = document.querySelector('.sidebar-toggle');
const close = document.querySelector('.close-btn');
const sidebar = document.querySelector('.sidebar');

//toggle show sidebar
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('show-sidebar');
})

//close sidebar
close.addEventListener('click', () => {
  sidebar.classList.remove('show-sidebar');
})