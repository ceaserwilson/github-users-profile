const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No User with this name");
    }
  }
}
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addRepos(data);
  } catch (err) {
    createErrorCard("Problem fetching repos ");
  }
}

function createCard(user) {
  const cardHTML = `
        <div class="card">
        <div class="profile-img">
          <img src="${user.avatar_url}" alt="${user.name}" class="profile-pic" />
        </div>
        <div class="user-info">
          <h2 class="username">${user.name}</h2>
          <p>
            ${user.bio}
          </p>
          <p class='italics'>
            ${user.company}
          </p>
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
          <div id="repos">
          </div>
        </div>
      </div>
    `;

  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class='card'>
            <h1>${msg}<h1/>        
        </div>
    `;
  main.innerHTML = cardHTML;
}

function addRepos(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 6).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerHTML = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
