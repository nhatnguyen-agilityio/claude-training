// select items
const items = document.querySelectorAll('.item h2');

const newYears = new Date(2022, 0, 1, 00, 00, 00 );
const futureTime = newYears.getTime();

const handleCountDown = () => {
  const now = new Date();
  const timeNow = now.getTime();
  const time = futureTime - timeNow;
  // get days, hours, minutes, seconds
  const days = Math.floor(time / (24*60*60*1000));
  const hours = Math.floor((time % (24*60*60*1000))/(60*60*1000));
  const minutes = Math.floor(((time % (24*60*60*1000))%(60*60*1000))/(60*1000))
  const seconds = Math.floor((((time % (24*60*60*1000))%(60*60*1000))%(60*1000))/1000)
  const countdown = [days, hours, minutes, seconds];
  
  // format value
  const formatTime = (value) => {
    if(value <10) {
      return `0${value}`
    }
    else {
      return value
    }
  }
  
  // set time
  items.forEach((item, index) => {
    item.innerHTML = formatTime(countdown[index]);
  })
  if(time <=0) {
    clearInterval(endCountDown);
  }

}

const endCountDown = setInterval(handleCountDown, 1000)

