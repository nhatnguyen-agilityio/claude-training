import "regenerator-runtime/runtime"

//Asynchonous Programming
console.log("before");
const fncCallback = (callback) => {
  const name = "nhat";
  setTimeout(() => {
    callback(name);
  }, 2000);
};
console.log("after");
const call = (name) => {
  console.log("🚀 ~ file: asynchronous.js ~ line 7 ~ name", name);
};
fncCallback(call);

//callback
//map
const list    = [1, 2, 3, 4, 5];
const newList = list.map((e) => {
  return e + "ok";
});
console.log(
  "🚀 ~ file: asynchronous.js ~ line 19 ~ newList ~ newList",
  newList
);

//ex: function callback
const alertName = (name, age) => {
  console.log(`My name ${name}, I'm ${age}`);
};

const introduction = (name, age, callback) => {
  setTimeout(() => {
    callback(name, age);
  }, 3000);
};

introduction("Nhat", 22, alertName);

//Promise
console.log("Promises");
const getData = new Promise((resolve, reject) => {
  const data = {
    name: "Nhat",
    age : 22,
  };
  if (!!data) {
    resolve(data);
  } else {
    reject("data error");
  }
});
const myData = () => {
  getData
    .then(changeData)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

const changeData = function (data) {
  const message = `My name is ${data.name}, i'm ${data.age}`;
  return Promise.resolve(message);
};

myData();

//Async and await
const getName = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  return users
}
console.log("🚀 ~ file: asynchronous.js ~ line 78 ~ getName ~ getName", getName())

