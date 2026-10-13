const btnCheck = document.getElementById("btn");
const container = document.querySelector(".container");
const text = document.querySelectorAll("p");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const username = document.getElementById("username");
const password = document.getElementById("password");

const checkValue = [
  {
    item: firstName,
    textError: "Please enter your first name",
  },
  {
    item: lastName,
    textError: "Please enter your last name",
  },
  {
    item: username,
    textError: "Please enter your username",
  },
  {
    item: password,
    textError: "Please enter your password",
  },
];

const handleLoadPage = () => {
  container.style.transform = "translate(0%)";
  container.style.transition = "transform 1s";
};
const handleHover = () => {
  btnCheck.style.backgroundImage =
    "linear-gradient(to right, #D9BA09, #ED2800)";
  btnCheck.textContent = "OK";
};
const mouseLeave = () => {
  btnCheck.style.backgroundImage =
    "linear-gradient(to right, #00EDE5, #071212)";
  btnCheck.textContent = "Submit";
};

const handleKeyPress = (e) => {
  if(e.keyCode === 13) {
    handleCheck();
  }
}

const handleCheck = () => {
  if (
    firstName.value !== "" &&
    lastName.value !== "" &&
    username.value !== "" &&
    password.value !== ""
  ) {
    text.forEach((element) => {
      element.textContent = "";
    });
    alert("Register success !");
  } else {
    checkValue.forEach((element, index) => {
      if (element.item.value === "") {
        text[index].textContent = element.textError;
        text[index].style.color = "red";
      } else {
        text[index].textContent = "";
      }
    });
  }
};



window.addEventListener("load", () => {
  handleLoadPage();
  btnCheck.addEventListener("mouseenter", handleHover);
  btnCheck.addEventListener("mouseleave", mouseLeave);
  btnCheck.addEventListener("click", handleCheck);
  checkValue.forEach((element)=> {
    element.item.addEventListener('keypress', handleKeyPress)
  })
});

