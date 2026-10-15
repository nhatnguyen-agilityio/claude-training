import Reactotron from 'reactotron-react-js';

window.global = window;


Reactotron
  .configure({ name: "React JS App", host: '192.168.86.65' })
  .connect();

console.tron = Reactotron;
console.tron.log("Reactotron is connected!");
