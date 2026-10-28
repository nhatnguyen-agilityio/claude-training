// Exercise 2: Part 10
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

// selecting button, input element
const btnSubmit = document.getElementById('submit');
const volume = document.getElementById('volume');
let calculator;
// function handleSubmit
const handleSubmit = (e) => {
  // get value radius input
  let radius = document.getElementById('radius').value;
  radius = Math.abs(radius);
  // calculator volume
  calculator = ((4/3) * Math.PI * Math.pow(radius, 3)).toFixed(4);
  volume.value = calculator;
}

btnSubmit.addEventListener('click', handleSubmit);
