// select items
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sizeEl = document.getElementById('size');
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
const colorEl = document.getElementById('color');
const clearEL = document.getElementById('clear');
const circleEL = document.getElementById('circle');
const lineEL = document.getElementById('line');
const textEL = document.getElementById('text');
const textValue = document.getElementById('text-value');

// size
let size = 30;
// isPress
let isPress = false;
// color ;
let color = '#000';
// is circle
let isCircle = 'circle';
// x1, y1
let x1, y1 = undefined;
// text
let text = '';

canvas.addEventListener('mousedown', (e) => {
  isPress = true;
  x1 = e.offsetX;
  y1 = e.offsetY;
})

canvas.addEventListener('mouseup', (e) => {
  isPress = false;
  x1, y1 = undefined;
  if(isCircle === 'text') {
    const x = e.offsetX;
    const y = e.offsetY;
    drawText(x, y)
  }
})

const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

const drawLine = (x, y, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.stroke();
}

const drawText = (x, y) => {
  ctx.font = "30px Arial";
  ctx.fillText(text, x, y);
}

canvas.addEventListener('mousemove', (e) => {
  if(isPress) {
    if(isCircle === 'circle') {
      const x = e.offsetX;
      const y = e.offsetY;
      drawCircle(x, y)
    } else if(isCircle === 'line'){
      const x2 = e.offsetX;
      const y2 = e.offsetY;
      drawLine(x1, y1, x2, y2);
      x1 = x2;
      y1 = y2
    }
    else {
      const x = e.offsetX;
      const y = e.offsetY;
      drawText(x, y)
    }
  }
})

// increase
increase.addEventListener('click', () => {
  size += 5
  if(size >= 50) {
    size = 50
  }
  setSize();
})

// decrease
decrease.addEventListener('click', () => {
  size -= 5
  if(size <=5) {
    size = 5;
  }
  setSize();
})

// change color
colorEl.addEventListener('change', () => {
  color = colorEl.value
})

// clear
clearEL.addEventListener('click', () => {
  ctx.clearRect(0, 0 ,canvas.width, canvas.height)
})

// set draw
circleEL.addEventListener('click', () => {
  isCircle = 'circle';
  circleEL.classList.add('disabled');
  textValue.classList.remove('show-text');
  textEL.classList.remove('disabled');
  lineEL.classList.remove('disabled');
  size = 30;
  setSize();
})

lineEL.addEventListener('click', () => {
  isCircle = 'line';
  size = 1;
  lineEL.classList.add('disabled');
  textEL.classList.remove('disabled');
  textValue.classList.remove('show-text');
  circleEL.classList.remove('disabled');
  setSize();
})

textEL.addEventListener('click', () => {
  isCircle = 'text';
  lineEL.classList.remove('disabled');
  circleEL.classList.remove('disabled');
  textEL.classList.add('disabled');
  textValue.classList.add('show-text');
})

textValue.addEventListener('keypress', (e) => {
  if(e.keyCode === 13) {
    text = textValue.value;
  }
})

window.addEventListener('load', () => {
  setSize();
})

const setSize = () => {
  sizeEl.value = size;
}