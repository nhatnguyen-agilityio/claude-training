//basic classes
class Person {
    name = 'nguyen'
    hello() {
        return 'Hello everyone'
    }
}
const a = new Person
console.log("🚀 ~ file: classes.js ~ line 5 ~ a", a.name)
a.name = 'Nhat'
console.log(a.name)
console.log(a)

//method
console.log(a.hello())

//constructor
class People {
    constructor (name, age) {
        this.name = name
        this.age = age
    }
    name = name
    hello() {
        return console.log(`My name is: ${this.name}, i'm ${this.age}`)
    }

    fnc() {
        return console.log(this.age  + this.name)
    }
}
const b = new People('Nhat', 22)
b.hello()
const c = new People('Nguyen', 25)
console.log(c.name)

//static
class Person1 {
    static hello() {
        return 'Hello'
    }
}
console.log(Person1.hello())

//Inheritance
class Main {
    hello() {
        return 'Hello main'
    }
}
class Programmer extends Main {
    hello() {
        return 'abc'
    }
    fnc() {
        return 'function'
    }

    hi() {
        return `Hello ${super.hello()}`
    }
}

const flavio = new Programmer()
const abc = new Main()
console.log(abc.hello())
console.log(flavio.hello())
console.log(flavio.fnc())
console.log(flavio.hi())