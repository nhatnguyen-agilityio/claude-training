const listColor = [
  "red",
  "green",
  "#f35312",
  "rgba(133,122,200)",
  "#a63124",
  "#FFC0CB",
  "#E6E6FA",
  "#4B0082",
  "#FFA500",
  "#ADFF2F",
  "#87CEFA",
];
const listHex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
let isHex = false
const btn = document.getElementById("btn");
const color = document.querySelector(".color");
const simple = document.getElementById('simple');
const hex = document.getElementById('hex');


const handleChangecolor = () => {
  if(!isHex) {

    const number = randomNumber();
    color.textContent = listColor[number];
    document.body.style.backgroundColor = listColor[number];
  }
  else {
    let hexCode = '#'
    for(let i = 0 ; i < 6 ; i++) {
      const hexNumber = randomHex();
      hexCode += listHex[hexNumber]
      color.textContent = hexCode;
      document.body.style.backgroundColor = hexCode;
    }
  }
};

const randomNumber = () => {
  return Math.floor(Math.random() * listColor.length);
};

const randomHex = () => {
  return Math.floor(Math.random() * listHex.length)
}

const handleChangeHex = () => {
  isHex = true;
  hex.style.color ='rgb(28, 160, 160)';
  simple.style.color ='#000';
}

const handleChangeSimple = () => {
  isHex = false;
  simple.style.color ='rgb(28, 160, 160)';
  hex.style.color ='#000';
}

btn.addEventListener("click", handleChangecolor);
hex.addEventListener('click', handleChangeHex);
simple.addEventListener('click', handleChangeSimple);

