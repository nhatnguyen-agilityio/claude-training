  // Javascript file

  /* Target: 
      Selecting Elements, 
      Getting Values, 
      Setting Values
  */

  // Change the body style so it has a font-family of "Arial, sans-serif".
  // selecting element body
  const pageBody = document.body;
  // Change font-family
  pageBody.style.fontFamily = 'Arial, sans-serif';

  // Replace each of the spans (nickname, favorites, hometown) with your own information.
  // selecting element nickname, favorites, hometown
  const nickname = document.getElementById('nickname');
  const favorites = document.getElementById('favorites');
  const hometown = document.getElementById('hometown');
  // Replace each of the spans
  nickname.textContent = 'Nhat';
  favorites.textContent = 'Football';
  hometown.textContent = 'Da Nang';

  // Iterate through each li and change the class to "listitem". Add a style tag that sets a rule for "listitem" to make the color red.
  // selecting all li tag
  const list = document.querySelectorAll('li');
  // change the class to "list-item"
  list.forEach((element)=>{
    element.className = 'list-item';
  })
  // Create a new img element and set its src attribute to a picture of you. Append that element to the page.
  // Create a new img tag
  const img = document.createElement('img');
  // set src attribute
  img.setAttribute('src', 'http://localhost:1234/article1.17ab7be3.jpg')
  // Append that element to the page.
  pageBody.insertBefore(img, pageBody.lastChild)
  