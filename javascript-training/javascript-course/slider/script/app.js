// select items
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prevBtn');
const next = document.querySelector('.nextBtn');
let counter = 0

slides.forEach((item, index) => {
  item.style.left = `${index*100}%`;
})

next.addEventListener('click', () => {
  if(counter > 2) {
    counter = 0;
  }
  else {
    counter += 1;
  }
  carousel();

})

prev.addEventListener('click', () => {
  if(counter < 1) {
    counter = 3;
  }
  else{
    counter -= 1;
  }
  carousel();

})

const carousel = () => {
  slides.forEach((item) => {
    item.style.transform = `translateX(-${counter * 100}%)`;
  })
}