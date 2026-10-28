// api url
const APIURL = "https://api.github.com/users/";
const APIREPOURL = "https://api.github.com/users/";

// select items
const form = document.querySelector(".form");
const contentEL = document.querySelector(".content");
const searchValue = document.querySelector(".search");

// get user API
const getUserAPI = async (user) => {
  const resp = await fetch(APIURL + user);
  const respData = await resp.json();
  showUser(respData);
  getRepos(user);
};

const getRepos = async (user) => {
  const resp = await fetch(APIREPOURL + user + "/repos");
  const respData = await resp.json();
  showRepos(respData);
};

// show user
const showUser = (user) => {
  if (!!user.message) {
    return alert("User not found");
  } else {
    const { avatar_url, name, bio, followers, following, public_repos, login } =
      user;
    contentEL.innerHTML = `
      <div class="avatar">
        <img class="img" src="${avatar_url}" alt="avatar" />
        </div>
        <div class="info">
          <h2>${name}</h2>
          <h4 class="skill">${bio ? bio : "Fullstack Developer"}</h4>
          <p>
            Github: <a href="https://github.com/${login}" target="_blank">https://github.com/${login}</a>
          </p>
          <div class="follow">
          <p class="follower">
            <i class="fas fa-eye"></i>
            <span>${followers}</span>
          </p>
          <p class="following">
            <i class="fas fa-heart"></i>
            <span>${following}</span>
          </p>
          <p class="repo">
            <i class="fas fa-folder-open"></i>
            <span>${public_repos}</span>
          </p>
        </div>
        <div class="repos">
            <h4>Repos</h4>
        </div>
      </div>
      `;
  }
};

// show repos
const showRepos = (repos) => {
  const reposEl = document.querySelector(".repos");
  (repos.length > 15
    ? repos.slice(15)
    : repos
  ).forEach((repo) => {
    const link = document.createElement("a");
    link.classList.add("item");
    link.target = "_blank";
    link.href = repo.clone_url;
    link.textContent = repo.name;
    reposEl.appendChild(link);
  });
};

// handle submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = searchValue.value;
  if (value) {
    getUserAPI(value);
  }
});
