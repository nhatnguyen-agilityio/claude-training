// Exercise 2: Part 5
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

// selecting button, table
const button = document.querySelector('#btn');
const table = document.querySelector('table');

const handleInsert = () => {
  // create new row
  const newRow = table.insertRow(0);
  // create two column
  const firstCell = newRow.insertCell(0);
  const secondCell = newRow.insertCell(1);
  firstCell.textContent = 'New Row 1';
  secondCell.textContent = 'New Row 2';
}

button.addEventListener('click', handleInsert);