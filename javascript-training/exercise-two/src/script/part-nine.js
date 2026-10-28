// Exercise 2: Part 9
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

//selecting button, select paragraph element
const btnCount = document.getElementById('btn');
const list = document.getElementById('mySelect');
const text = document.getElementById('paragraph');
console.log("🚀 ~ file: part-nine.js ~ line 13 ~ text", text)
let paragraph = '';
const count = list.childElementCount;
paragraph += `Count:${count} `
// function handleCount
const handleCount = () => {
  for (let index = 0; index < list.children.length; index++) {
    // const element = array[index];
    paragraph += `${list.children[index].value} `
    text.textContent = paragraph
  }
}

btnCount.addEventListener('click', handleCount);