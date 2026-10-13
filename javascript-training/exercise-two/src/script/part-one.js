// Exercise 2: Part 1
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

//create function jt_style()
const pageBody = document.body;

js_style = () => {
  // change font
  pageBody.style.fontFamily = 'Arial, sans-serif';
  // change font-size
  pageBody.style.fontSize = '2em';
  // change color
  pageBody.style.color = 'red';
}