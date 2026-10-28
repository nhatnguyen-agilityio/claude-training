// select items
const mealContent = document.querySelector('.recipe');
const mealsFavorite = document.querySelector('.meals-content');
const searchValue = document.getElementById('search');
const searchBtn = document.querySelector('.btn-search');

//random meal
const getRandomMeal = async () => {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  const randomMeal = data.meals[0]
  addMeal(randomMeal, true)
}

// get meals favorite
const getMealsFavorite = async (id) => {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
  const data = await res.json();
  const arrMeal = data.meals[0];
  return arrMeal;
}

// getMealsSearch
const getMealsSearch = async (value) => {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + value);
  const data = await res.json();
  const meals = data.meals;
  return meals;
}

// add meal
const addMeal = (meal, random = false) => {
  const mealItem = document.createElement('div');
  mealItem.classList.add('meal');
  mealItem.innerHTML = `
  ${random ? '<h3 id="randomMeal">Random recipe</h3>': ''}
  <img
    src="${meal.strMealThumb}"
    alt="${meal.strMeal}"
  />
  <div class="favorite">
    <h4>${meal.strMeal}</h4>
    <button class="btn-heart"><i class="fas fa-heart"></i></button>
  </div>
  `;
  const heartBtn = mealItem.querySelector('.favorite .btn-heart');
  const mealContainer = mealItem.querySelector('.meal');
  heartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(heartBtn.classList.contains('active')) {
      removeMealLs(meal.idMeal);
      heartBtn.classList.remove('active');
    }
    else {
      setMealLS(meal.idMeal);
      heartBtn.classList.add('active');
    }
    fetchMeals();
  })
  mealItem.addEventListener('click', () => {
    showMealDetail(meal);
  })
  mealContent.appendChild(mealItem)
}

// get local storage
const getMealLS = () => {
  const listMeals = JSON.parse(localStorage.getItem('meals'));
  return listMeals === null ? [] : listMeals
}

// set local storage
const setMealLS = (id) => {
  const listMeals = getMealLS();
  localStorage.setItem('meals', JSON.stringify([...listMeals, id]))
}

// remove local storage
const removeMealLs = (id) => {
  const listMeals = getMealLS();
  const mealRemove = listMeals.filter((item) => {
    return item !== id
  })
  localStorage.setItem('meals', JSON.stringify(mealRemove))
}

// fetch meal by id
const fetchMeals = async () => {
  mealsFavorite.innerHTML ='';
  let meals = [];
  const listMealId = getMealLS();
  for (let index = 0; index < listMealId.length; index++) {
    meals = await getMealsFavorite(listMealId[index])
    renderMealsFavorite(meals);
  }
}

// render list meals
const renderMealsFavorite = (arr) => {
  const meal = document.createElement('li');
  meal.innerHTML = `
    <img
    src="${arr.strMealThumb}"
    alt="${arr.strMeal}"
    /><span>${arr.strMeal}</span>
    <button class="remove-meal"><i class="fas fa-times-circle"></i></button>
  `
  mealsFavorite.appendChild(meal)
  const removeBtn = meal.querySelector('.remove-meal');
  removeBtn.addEventListener('click', () => {
    removeMealLs(arr.idMeal);
    fetchMeals();
  })
}

// search meal
searchBtn.addEventListener('click', async () => {
  if(!!searchValue.value) {
    const meals = await getMealsSearch(searchValue.value);
    if(meals) {
      meals.forEach((item) => {
        addMeal(item);
      })
    }
  }
})

// show meal detail
const showMealDetail = (meal) => {
  console.log(meal.strInstructions)
  const showDetail = document.querySelector('.show-meal');
  const mealContent = document.querySelector('.detail');
  const closeBtn = document.querySelector('.btn-close');
  mealContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p>${meal.strInstructions}</p>
  `
  showDetail.classList.add('meal-detail');
  closeBtn.addEventListener('click', () => {
    showDetail.classList.remove('meal-detail');
  })
}


window.addEventListener('load', () => {
  getRandomMeal();
  fetchMeals();
})
