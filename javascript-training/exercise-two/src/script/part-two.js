// Exercise 2: Part 2
/* 
  Target:
    Attributes,
    Classes, 
    CSS Manipulation
*/

// selecting form, firstName, lastName
const form = document.getElementById('form1');
const firstName = document.querySelector('[name="fname"]');
const lastName = document.querySelector('[name="lname"]');
const fullName = document.querySelector('.fullname');

// function getValue
const getValue = (e) => {
  console.log("🚀 ~ file: part-two.js ~ line 16 ~ firstName", firstName.value);
  console.log("🚀 ~ file: part-two.js ~ line 17 ~ lastName", lastName.value);
  fullName.textContent = `Fisrt Name: ${firstName.value}, Last Name: ${lastName.value}`;
}
//submit form
form.addEventListener('submit', getValue);