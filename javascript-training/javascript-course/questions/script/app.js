// select items
const questionBtn = document.querySelectorAll('.question-btn');
const questionBox = document.querySelectorAll('.question');
questionBtn.forEach((element, index) => {
  element.addEventListener('click', () => {
    questionBtn.forEach((item, i) => {
      if (item !== element) {
        console.log(item)
        questionBox[i].classList.remove('show-text');
      }
    })
    questionBox[index].classList.toggle('show-text');
  })
})