// Exercise 2: Part 4
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

// selecting button, a element
const btn = document.querySelector("button");
const link = document.getElementById("w3r");
const info = document.getElementById("info");

// function handle getValue attribute
const getValue = () => {
  // get href
  const href = link.getAttribute("href");
  // get hreflang
  const hreflang = link.getAttribute("hreflang");
  // get rel
  const rel = link.getAttribute("rel");
  // get target
  const target = link.getAttribute("target");
  // get type
  const type = link.getAttribute("type");
  info.innerHTML = `href = ${href}<br> hreflang = ${hreflang}<br> rel = ${rel}<br> target = ${target}<br> type = ${type}<br>`;
};

btn.addEventListener("click", getValue);
