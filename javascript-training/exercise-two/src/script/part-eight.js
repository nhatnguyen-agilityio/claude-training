// Exercise 2: Part 8
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/
// selecting button, select
const btnRemove = document.getElementById('btn');
const list = document.getElementById('colorSelect');

const handleRemove = () => {
  // find index option
  const index = list.selectedIndex;
  // remove option
  list.remove(index)
}

btnRemove.onclick = handleRemove;