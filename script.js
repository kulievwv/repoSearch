const search = document.querySelector('.search')
const searchInput = document.querySelector('.search-field');
const repositoriesList = document.querySelector('.repositories-list');
const addedRepositoriesList = document.querySelector('.added-repositories');
let stars = [];
let owners = [];

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm) {
    searchRepositories(searchTerm);
  } else {
    clearRepositories();
  }
});

function searchRepositories(searchTerm) {
  const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}+language:javascript`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const repositories = data.items.slice(0, 5);
      
      displayRepositories(repositories);
    })
    .catch(error => console.error(error));
}

function displayRepositories(repositories) {
  repositoriesList.innerHTML = '';
  
  if (repositories.length === 0) {
    repositoriesList.innerHTML = '<p>No repositories found.</p>';
    search.style.height = '60px'
    return;
  }
  const repositoriesHeight = 40 + repositories.length * 25;
  search.style.height = `${repositoriesHeight}px`;
  repositories.forEach(repository => {
    const repositoryLink = document.createElement('a');
    repositoryLink.target = '_blank';
    repositoryLink.innerText = repository.name;
    // repositoryLink.href = repository.html_url;
    stars.push(repository.stargazers_count);
    owners.push(repository.owner.login);
    const repositoryItem = document.createElement('li');
    repositoryItem.appendChild(repositoryLink);

    repositoriesList.appendChild(repositoryItem);
  });
  
}

function clearRepositories() {
  repositoriesList.innerHTML = '';
  search.style.height = '40px'

}

repositoriesList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    const repositoryName = event.target.innerText;
    const repositoryUrl = event.target.href;
    clearRepositories();
    addRepositoryToList(repositoryName, repositoryUrl);
  }
});

function addRepositoryToList(name, url) {
  const repositoryItem = document.createElement('li');
  
  const repositoryLink = document.createElement('a');
  const remove = document.createElement('button');
  remove.classList.add('remove-button')
  repositoryLink.href = url;
  repositoryLink.target = '_blank';
  repositoryLink.innerText = `${name} \nStars: ${stars[Math.floor(Math.random() * (stars.length + 1))]} \nOwner: ${owners[Math.floor(Math.random() * (stars.length + 1))]}`;;
  
  repositoryItem.appendChild(repositoryLink);
  repositoryItem.appendChild(remove);
  
  addedRepositoriesList.appendChild(repositoryItem);
}
addedRepositoriesList.addEventListener('click', function(event) {
    if (event.target.className != 'remove-button') return;

    let pane = event.target.closest('li');
    pane.remove();
  });