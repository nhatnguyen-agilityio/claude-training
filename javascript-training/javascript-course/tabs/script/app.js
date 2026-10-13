// select items
const tabBtn = document.querySelectorAll(".tab-btn");
const content = document.querySelectorAll(".content");
const about = document.querySelector(".about");

about.addEventListener("click", (e) => {
  const dataId = e.target.dataset.id;
  if (dataId) {
    tabBtn.forEach((element) => {
      element.classList.remove("active");
      e.target.classList.add("active");
    });
    content.forEach((item) => {
      const id = item.getAttribute("id");
      if (id === dataId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
});

