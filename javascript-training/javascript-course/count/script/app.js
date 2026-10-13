let number = parseInt(document.getElementById('number').textContent);
const btn = document.querySelectorAll('.btn');

btn.forEach((element) => {
  element.addEventListener('click', () => {
    const event = element.classList;
    if(event.contains('decrease')) {
      number--;
    }else if( event.contains('increase')) {
      number++;
    }else {
      number = 0;
    }
    document.getElementById('number').textContent = number;
    if(number > 0) {
      document.getElementById('number').style.color = 'green';
    }
    if(number < 0) {
      document.getElementById('number').style.color = 'red';
    }
    if(number === 0) {
      document.getElementById('number').style.color = 'black';
    }
  });
})