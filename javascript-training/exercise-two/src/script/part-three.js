// Exercise 2: Part 3
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

// selecting button, paragraph element
const btn = document.querySelector('button');
const paragraph = document.querySelector('p');

// create function handle change background
const handleChangeBackground = () => {
  paragraph.style.backgroundImage = 'linear-gradient(to right, red , yellow)';
}

btn.addEventListener('click', handleChangeBackground);