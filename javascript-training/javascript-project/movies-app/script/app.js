const APIURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

// select items
const main = document.querySelector('main');
const searchSubmit = document.querySelector('.search');
const searchValue = document.getElementById('search-value');

// get movies
const getMovies = async () => {
  const resp = await fetch(APIURL);
  const resData = await resp.json();
  resData.results.forEach(element => {
    renderMovies(element)
  });
}

// get movies by search value
const getMoviesSearch = async (value) => {
  const resp = await fetch(SEARCHAPI + value);
  const resData = await resp.json();
  if (!!resData.results.length) {
    resData.results.forEach(element => {
      renderMovies(element)
    });
  }
  else {
    getMovies()
  }
}

// render movies
const renderMovies = (movie) => {
console.log("🚀 ~ file: app.js ~ line 38 ~ renderMovies ~ movie", movie)
  const {poster_path, title, vote_average, overview} = movie
  const movieEL = document.createElement('div');
  movieEL.classList.add('movie')
  movieEL.innerHTML = `
    <img src="${IMGPATH + poster_path}" alt="${title}">
    <div class="movie-info">
      <h4>${title}</h4>
      <span class="${setRateColor(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
    <h4>Overview</h4>
    ${overview}
    </div>
  `;
  main.appendChild(movieEL);
}

const setRateColor = (vote) => {
  if(vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'yellow';
  } else {
    return 'red';
  }
}

// search movies
// const searchMovies = () => {

// }

searchSubmit.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = searchValue.value;
  if(value) {
    main.innerHTML = '';
    getMoviesSearch(value);
  }
})

getMovies();