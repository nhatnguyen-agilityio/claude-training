// select items

const openBtn = document.getElementById('open');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close-modal');

openBtn.addEventListener('click', () => {
  overlay.classList.add('open-modal');
})

closeBtn.addEventListener('click', () => {
  overlay.classList.remove('open-modal');
})