//Modifying Attributes
const list = document.querySelectorAll('div')
console.log("🚀 ~ file: dom.js ~ line 2 ~ list", list)
list[0].setAttribute('class', 'container');
console.log("🚀 ~ file: dom.js ~ line 3 ~ list", list)
console.log("🚀 ~ file: dom.js ~ line 6 ~ list[1].hasAttribute('class')", list[1].hasAttribute('class'))
console.log(list[0].getAttribute('class'))
list[0].removeAttribute('class')
console.log(list)

//Modifying classes
console.log('Modifying classes')
list[1].className = 'container'
console.log(list)
list[0].classList.add('box')
console.log(list)
list[0].classList.toggle('header')
console.log(list)

//Modifying styles
list[0].style.color = 'red'
list[1].style.backgroundColor = 'blue'
list[1].style.color = '#fff'
