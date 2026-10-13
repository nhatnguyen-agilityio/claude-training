// select items
const switchBtn = document.querySelector('.switch');
const video = document.querySelector('.video-container');
const btnContainer = document.querySelector('.switch-btn');
const listBtn = document.querySelectorAll('.video-btn');
const preloader = document.querySelector('.preloader');
// variables

// handleSwitch
listBtn.forEach((element) => {
  element.addEventListener('click', (e) => {
    if(e.currentTarget.dataset.id === 'play') {
      video.play();
      btnContainer.classList.remove('slide');
    }
    else {
      video.pause();
      btnContainer.classList.add('slide');
    }
  }) 
})

// load page
window.addEventListener('load', () => {
  preloader.classList.add('hide-preloader')
})