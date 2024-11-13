const jokeButton = document.querySelector('.btn');
const jokeResult = document.querySelector('.result');
const loader = document.querySelector('#loader');
const copyBtn = document.querySelector('.copy-btn');
const saveBtn = document.querySelector('.save-btn');
const toggleModeBtn = document.querySelector('.toggle-mode');
const showFavoriteBtn = document.querySelector('.show-favorite-btn');
const favoriteJokesContainer = document.querySelector('.favorite-jokes-container');
const favoriteJokesList = document.querySelector('.favorite-jokes');

let currentJoke = '';
let favoriteJokes = [];

// Load favorite jokes from localStorage when the page loads
const loadFavoriteJokesFromLocalStorage = () => {
  const savedJokes = localStorage.getItem('favoriteJokes');
  if (savedJokes) {
    favoriteJokes = JSON.parse(savedJokes);
  } else {
    favoriteJokes = [];  // If nothing is saved, initialize as empty array
  }
  displayFavoriteJokes();  // Display jokes after loading
};

// Save favorite jokes to localStorage
const saveFavoriteJokesToLocalStorage = () => {
  localStorage.setItem('favoriteJokes', JSON.stringify(favoriteJokes));
};

// Function to display favorite jokes
const displayFavoriteJokes = () => {
  favoriteJokesList.innerHTML = ''; // Clear previous list
  if (favoriteJokes.length === 0) {
    const noFavoriteMessage = document.createElement('li');
    noFavoriteMessage.textContent = 'No favorite jokes yet!';
    favoriteJokesList.appendChild(noFavoriteMessage);
    return;
  }
  favoriteJokes.forEach((joke, index) => {
    const jokeItem = document.createElement('li');
    jokeItem.textContent = joke;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      favoriteJokes.splice(index, 1); // Remove joke from favorites
      saveFavoriteJokesToLocalStorage(); // Save updated favorites
      displayFavoriteJokes(); // Re-render the list
    });
    jokeItem.appendChild(deleteBtn);
    favoriteJokesList.appendChild(jokeItem);
  });
};

// Function to toggle the visibility of favorite jokes
showFavoriteBtn.addEventListener('click', () => {
  favoriteJokesContainer.classList.toggle('active');
  if (favoriteJokesContainer.classList.contains('active')) {
    showFavoriteBtn.textContent = 'Hide Favorite Jokes';
    displayFavoriteJokes();  // Display jokes when container is shown
  } else {
    showFavoriteBtn.textContent = 'Show Favorite Jokes';
  }
});

// Fetch Dad Joke
const fetchJoke = async () => {
  try {
    loader.style.display = 'block';
    jokeResult.textContent = ''; // Reset joke text
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
    const data = await response.json();

    if (data.joke) {
      currentJoke = data.joke;
      jokeResult.textContent = currentJoke;
    } else {
      jokeResult.textContent = 'Oops! No joke found.';
    }
  } catch (error) {
    jokeResult.textContent = 'Failed to fetch joke!';
  } finally {
    loader.style.display = 'none';
  }
};

// Handle Get Joke Button Click
jokeButton.addEventListener('click', fetchJoke);

// Copy Joke to Clipboard
copyBtn.addEventListener('click', () => {
  if (currentJoke) {
    navigator.clipboard.writeText(currentJoke)
      .then(() => {
        alert('Joke copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy joke!');
      });
  }
});

// Save Joke to Favorites
saveBtn.addEventListener('click', () => {
  if (currentJoke && !favoriteJokes.includes(currentJoke)) {
    favoriteJokes.push(currentJoke); // Add joke to favorites
    saveFavoriteJokesToLocalStorage(); // Save to localStorage
    alert('Joke saved to favorites!');
  } else {
    alert('This joke is already in your favorites!');
  }
});

// Toggle Dark Mode
toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  toggleModeBtn.textContent = isDarkMode ? '🌙 Switch to Light Mode' : '🌚 Switch to Dark Mode';
});

// Load favorite jokes when the page is loaded
loadFavoriteJokesFromLocalStorage();
