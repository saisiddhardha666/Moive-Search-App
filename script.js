const API_KEY = "912fa09d";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieList = document.getElementById("movieList");
const favoritesList = document.getElementById("favoritesList");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return alert("Please enter a movie name!");

  movieList.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieList.innerHTML = "<p>No movies found!</p>";
    }
  } catch (error) {
    console.error(error);
    movieList.innerHTML = "<p>Error fetching data.</p>";
  }
}

function displayMovies(movies) {
  movieList.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addToFavorites('${movie.imdbID}', '${movie.Title}', '${movie.Year}', '${movie.Poster}')">❤️ Add to Favorites</button>
    `;

    movieList.appendChild(card);
  });
}

function addToFavorites(id, title, year, poster) {
  if (favorites.some(fav => fav.id === id)) {
    alert("Already in favorites!");
    return;
  }

  const movie = { id, title, year, poster };
  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  favoritesList.innerHTML = "";

  favorites.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.poster !== "N/A" ? movie.poster : "https://via.placeholder.com/200"}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.year}</p>
      <button onclick="removeFromFavorites('${movie.id}')">Remove</button>
    `;

    favoritesList.appendChild(card);
  });
}

function removeFromFavorites(id) {
  favorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

searchBtn.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMovies();
});

renderFavorites();
