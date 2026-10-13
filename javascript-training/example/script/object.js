//Define an object
const obj1 = {
  fullName: 'Nhat',
  age: 22,
  address: 'Da nang'
}
console.log("🚀 ~ file: object.js ~ line 7 ~ obj1", obj1)

//new Object
const obj2 = new Object({
  fullName: 'Nhat',
  age: 22,
  address: 'Da nang'
})
console.log("🚀 ~ file: object.js ~ line 8 ~ obj2", obj2)

//Object.create()
const obj3 = Object.create({
  fullName: 'Nhat',
  age: 22,
  address: 'Da nang'
})
console.log("🚀 ~ file: object.js ~ line 19 ~ obj3", obj3)

//function
function Obj4(brand, model) {
  this.brand = brand
  this.model = model
}
const myObj = new Obj4("Ford", 'abc')
console.log(myObj.brand)

//Objects are always passed by reference.
const obj5 = {
  age: 22,
  fullName: 'Nhat'
}
console.log("🚀 ~ file: object.js ~ line 38 ~ obj5", obj5)
let obj6 = obj5;
console.log("🚀 ~ file: object.js ~ line 41 ~ obj6", obj6)
obj6.age = 25;
console.log("🚀 ~ file: object.js ~ line 41 ~ obj6", obj6)
console.log("🚀 ~ file: object.js ~ line 38 ~ obj5", obj5)

//Object properties
const obj7 = {
  color: 'red',
  name: 'abc'
}
console.log("🚀 ~ file: object.js ~ line 50 ~ obj7", obj7)
console.log("🚀 ~ file: object.js ~ line 50 ~ name", obj7.name)
console.log("🚀 ~ file: object.js ~ line 50 ~ name", obj7['color'])
delete obj7.name
console.log("🚀 ~ file: object.js ~ line 54 ~ obj7", obj7)

//Object method
const obj8 = {
  name: 'Nhat',
  age: 22,
  start: function(address) {
    console.log(`Object method: ${this.name} + ${this.age} + ${address}`)
  }
}
obj8.start('Da Nang')


