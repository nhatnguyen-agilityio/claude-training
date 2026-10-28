// select items
const passEl = document.getElementById('pass');
const copyEl = document.getElementById('copy');
const lenEl = document.getElementById('len');
const upperEl = document.getElementById('upper');
const lowerEl = document.getElementById('lower');
const numberEl = document.getElementById('number');
const symbolEl = document.getElementById('symbol');
const generateEl = document.getElementById('generate');

// default value
const upperTexts = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
const lowerTexts = 'abcdefghjklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+=';

const getUpperText = () => {
  return upperTexts[Math.floor(Math.random() * upperTexts.length)]
}

const getLowerText = () => {
  return lowerTexts[Math.floor(Math.random() * lowerTexts.length)]
}

const getNumber = () => {
  return numbers[Math.floor(Math.random() * numbers.length)]
}

const getSymbol = () => {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const getPassword = () => {
  const arrPass = [];
  let password = ''

  if(upperEl.checked) {
    arrPass.push(getUpperText())
  }
  if(lowerEl.checked) {
    arrPass.push(getLowerText())
  }
  if(numberEl.checked) {
    arrPass.push(getNumber())
  }
  if (symbolEl.checked) {
    arrPass.push(getSymbol())
  }
  password += arrPass[Math.floor(Math.random() * arrPass.length)]
  return password;
}

// handle click generate password
generateEl.addEventListener('click', () => {
  const len = lenEl.value;
  let password = ''
  if(parseInt(len) >= 8 && parseInt(len) <=30) {
    for (let index = 0; index < len; index++) {
      password += getPassword();
    }
    passEl.innerText = password
  } else if (!upperEl.checked && !lowerEl.checked && !numberEl.checked && !symbolEl.checked) {
    alert('Please choose password format !')
  }
  else {
    alert('Password length >= 8 and <= 30')
  }
})

copyEl.addEventListener('click', () => {
  navigator.clipboard.writeText(passEl.textContent);
  alert('Password copied to clipboard')
})