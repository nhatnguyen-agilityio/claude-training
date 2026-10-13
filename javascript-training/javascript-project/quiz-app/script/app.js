// list question
const listQuestion = [
  {
    question: "What is the most used programming language in 2019?",
    a: "Java",
    b: "C",
    c: "Python",
    d: "JavaScript",
    correct: "d",
},
{
    question: "What does CSS stand for?",
    a: "Hypertext Markup Language",
    b: "Document Object Model",
    c: "Cascading Style Sheet",
    d: "Jason Object Notation",
    correct: "c",
},
{
    question: "What does HTML stand for?",
    a: "Hypertext Markup Language",
    b: "Cascading Style Sheet",
    c: "Jason Object Notation",
    d: "Helicopters Terminals Motorboats Lamborginis",
    correct: "a",
},
{
    question: "What year was JavaScript launched?",
    a: "1996",
    b: "1995",
    c: "1994",
    d: "none of the above",
    correct: "b",
},
];

// select items
const btn = document.getElementById('btn');
const question = document.getElementById('question');
const answerA = document.getElementById('answer-a');
const answerB = document.getElementById('answer-b');
const answerC = document.getElementById('answer-c');
const answerD = document.getElementById('answer-d');
const answers = document.querySelectorAll('.answer');

let count = 0;
let score = 0;
window.addEventListener('load', () => {
  loadQuiz();
})

// load question and answers
const loadQuiz = () => {
  question.innerHTML = listQuestion[count].question;
  answerA.innerHTML = listQuestion[count].a;
  answerB.innerHTML = listQuestion[count].b;
  answerC.innerHTML = listQuestion[count].c;
  answerD.innerHTML = listQuestion[count].d;
}

// check answers
const checkAnswers = () => {
  let answerId = undefined;
    answers.forEach(element => {
      if(element.checked){
        answerId = element.getAttribute('id');
      }
    });
  return answerId;
}

// handle submit
btn.addEventListener('click', () => {
  const answerId = checkAnswers();
  if(answerId) {
    if(answerId === listQuestion[count].correct) {
      score += 1;
      console.log(score)
    }
    count += 1;
    if(count < listQuestion.length) {
      loadQuiz();
    }
    else {
      location.reload();
      alert(`You answered correctly at ${score}/${listQuestion.length} questions.`)
    }
  } 
  else {
    alert('Please choose your answer')
  }
})