// set date
const date = document.getElementById("date");
date.innerHTML = new Date().getFullYear();

// select items show menu
const menuContainer = document.querySelector(".links-container");
const toggleBtn = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

// show menu
toggleBtn.addEventListener("click", () => {
  const containerHeight = menuContainer.getBoundingClientRect().height;
  const linksHeight = links.getBoundingClientRect().height;
  if (containerHeight === 0) {
    menuContainer.style.height = `${linksHeight}px`;
  } else {
    menuContainer.style.height = 0;
  }
});

// select items fixed nav
const navbar = document.getElementById("nav");
const topLink = document.querySelector(".top-link");

// fixed header
window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  const navHeight = navbar.getBoundingClientRect().height;
  scrollHeight > navHeight
    ? navbar.classList.add("fixed-nav")
    : navbar.classList.remove("fixed-nav");
  scrollHeight > 500
    ? topLink.classList.add("show-link")
    : topLink.classList.remove("show-link");
});

const scrollLink = document.querySelectorAll('.scroll-link');

scrollLink.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const linkId = e.currentTarget.getAttribute('href').slice(1);
    const element = document.getElementById(linkId);
    const navHeight = navbar.getBoundingClientRect().height;
    const containerHeight = menuContainer.getBoundingClientRect().height;
    const fixedNav = navbar.classList.contains('fixed-nav');
    let position = element.offsetTop - navHeight;
    if(!fixedNav) {
      position -= navHeight;
    }
    if(navHeight > 82) {
      position += containerHeight;
    }
    window.scrollTo({
      left: 0,
      top: position
    });
    menuContainer.style.height = 0;
  })
})
