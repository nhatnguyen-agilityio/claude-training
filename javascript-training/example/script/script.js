const a = 10;
console.log("🚀 ~ file: script.js ~ line 2 ~ a", a)
let b = 5;
console.log("🚀 ~ file: script.js ~ line 3 ~ b", b)
b += 4;
console.log("🚀 ~ file: script.js ~ line 6 ~ b", b)
b += 'example';
console.log("🚀 ~ file: script.js ~ line 8 ~ b", b)
let c = 4;
console.log("🚀 ~ file: script.js ~ line 10 ~ c", c)
let d = c++
console.log("🚀 ~ file: script.js ~ line 11 ~ c", c)
console.log("🚀 ~ file: script.js ~ line 12 ~ d", d)
const e = ++c
console.log("🚀 ~ file: script.js ~ line 13 ~ c", c)
console.log("🚀 ~ file: script.js ~ line 14 ~ e", e)

// The addition operator (+)
console.log("The addition operator (+)")
const one = 1 + 2;
console.log("🚀 ~ file: script.js ~ line 21 ~ one", one)
const two = one + 3;
console.log("🚀 ~ file: script.js ~ line 23 ~ two", two)
const three = two + 'two';
console.log("🚀 ~ file: script.js ~ line 25 ~ three", three)

//The subtraction operator (-)
console.log("The subtraction operator (-)")
const h = 5, f = 10;
const g = f - h;
console.log("🚀 ~ file: script.js ~ line 31 ~ g", g)

//The division operator (/)
console.log("The division operator (/)")
const result = 20 / 7;
console.log("🚀 ~ file: script.js ~ line 36 ~ result", result)

//The remainder operator (%)
console.log("The remainder operator (%)")
const remainder = 20 % 7;
console.log("🚀 ~ file: script.js ~ line 40 ~ remainder", remainder)

//The multiplication operator (*)
console.log("The multiplication operator (*)")
const i = 5 * 10;
console.log("🚀 ~ file: script.js ~ line 44 ~ i", i)

//The exponentiation operator (**)
console.log("The exponentiation operator (**)")
const k = 2 ** 10;
console.log("🚀 ~ file: script.js ~ line 51 ~ k", k)

//Precedence
console.log("Precedence")
const l = 3 * 5 + 2 / 2 + 9 % 4;
console.log("🚀 ~ file: script.js ~ line 56 ~ l", l)

//Disequality comparison operators
console.log("Disequality comparison operators")
let m = 5;
console.log("🚀 ~ file: script.js ~ line 62 ~ m", m > 2)
const a1 = 5, a2 = '5'
console.log("a1 == a2", a1 == a2)
console.log("a1 === a2", a1 === a2)

//Conditionals
const n = 5
console.log("Conditionals")
if (n > 2) {
  console.log("true")
}
else {
  console.log("false")
}

//Strings
console.log("Strings")
const string = `m = ${m}`;
console.log("🚀 ~ file: script.js ~ line 78 ~ string", string)

//Loops
console.log("Loops")
//while
console.log("while")
const number = 10
let index = 0
while (index < 10) {
  console.log(index);
  index++;
}
let index1 = 0
console.log('do..while')
do {
  console.log(index1);
  index1++
} while (index1 < number);
//for
console.log("for")
const arr = [0,2,4,6,8]
for (let index2 = 0; index2 < arr.length; index2++){
  console.log(index2)
  console.log(arr[index2])
}

//for...of
console.log("for...of")
for (const value of arr) {
  console.log(value)
}