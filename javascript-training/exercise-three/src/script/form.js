//Javascript exercise 3: Form
/*
  Target: DOM manipulation with simple table, form
*/

//selecting email, username, password, confirmPassword, error message, message
const email = document.getElementById('email');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorMessage = document.querySelectorAll('.error-message');
const message = document.querySelector('.message');
//selecting signup, reset element
const signUp = document.getElementById('btnSubmit');
const reset = document.getElementById('reset');
// create input array
const listItem = [
  {
    item: email,
    message: 'Email is empty',
    regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    regexMessage: 'Email address wrong format'
  },
  {
    item: username,
    message: 'Username is empty',
    regex: /^[a-z0-9_-]{3,16}$/,
    regexMessage: 'Username wrong format'
  },
  {
    item: password,
    message: 'Password is empty',
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    regexMessage: 'Password wrong format'
  },
  {
    item: confirmPassword,
    message: 'Password is empty',
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    regexMessage: 'Re-enter the correct password'
  }
]

//handle check validate
const handleCheck = () => {
  return listItem.map((element, index) => {
    if(element.item.value === '') {
      errorMessage[index].textContent = element.message;
      errorMessage[index].style.color = 'red';
      return false;
    } 
    if(element.regex.test(element.item.value) === false) {
      errorMessage[index].textContent = element.regexMessage;
      errorMessage[index].style.color = 'red';
      return false;
    } else {
      errorMessage[index].textContent = '';
      return true;
    }
  })
}

//handleSignUp
const handleSignUp = (e) => {
  e.preventDefault();
  let check = true;
  let firstCheck = true;
  check = handleCheck();
  check.forEach(element => {
    firstCheck = firstCheck && element;
  });

  //firstCheck === true
  if(firstCheck) {
    if(confirmPassword.value !== password.value) {
      errorMessage[3].textContent = 'Re-enter the correct password !';
      errorMessage[3].style.color = 'red';
    } else {
      message.innerHTML = `
      <p>Email: ${email.value}</p>
      <p>Username: ${username.value}</p>
      <p>Password: ${password.value}</p>
      <p>Confirmation password: ${confirmPassword.value}</p>
      `;
      message.style.color = 'green';
    }
  }
}

const handleReset = () => {
  listItem.forEach((element) => {
    element.item.value = '';
  })
  message.innerHTML = '';
}

window.addEventListener('load', () => {
  signUp.addEventListener('submit', handleSignUp);
  reset.addEventListener('click', handleReset);
})
