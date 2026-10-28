const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const items = document.querySelectorAll('.deadline-format h4');
const giveaway = document.querySelector('.giveaway');

let giveDate = new Date(2021, 11, 29, 8, 0, 0)
const year = giveDate.getFullYear();
let month = giveDate.getMonth();
month = months[month];
let weekday = giveDate.getDay();
weekday = weekdays[weekday];
const hours = giveDate.getHours();
const minutes = giveDate.getMinutes();
const date= giveDate.getDate();
giveaway.textContent = `giveaway ends on ${weekday}, ${date} ${month} ${year} ${hours}:${minutes}am`

// calculate day
const futureTime = giveDate.getTime();
const getRemaindingTime = () => {
  const today = new Date().getTime();
  const t = futureTime - today;
  // 1s = 1000ms
  // 1m = 60s
  // 1h = 60m
  // 1d = 24h
  const oneMinute = 60*1000;
  const oneHour = 60*60*1000;
  const oneDay = 24*60*60*1000;
  let days = Math.floor(t/oneDay);
  let hours = Math.floor((t%oneDay) / oneHour);
  let minutes = Math.floor((t % oneHour) / oneMinute);
  let seconds = Math.floor((t % oneMinute) / 1000);

  const values = [days, hours, minutes, seconds]
  const  format = (item) => {
    if(item < 10) {
      return (item = `0${item}`)
    }
    else{
      return item
    }
  }

  items.forEach((element, index) => {
    element.innerHTML = format(values[index])
  })

  if(t < 0) {
    clearInterval(countdown)
    giveaway.textContent = 'sorry, this giveaway has expired!';
  }
}

let countdown = setInterval(getRemaindingTime, 1000)
getRemaindingTime();


