class MovieService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://kinopoiskapiunofficial.tech/api/";
  }

  async searchMoviesByKeyword(keyword, page = 1) {
    try {
      const url = `${this.baseURL}v2.1/films/search-by-keyword?keyword=${keyword}&page=${page}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  }

  async getPremiereMovies(year, month, page = 1) {
    try {
      const url = `${this.baseURL}v2.1/films/premieres?year=${year}&month=${month}&page=${page}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.apiKey,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting premiere movies:", error);
      throw error;
    }
  }
}

const API_KEY = "4521a67b-3a33-44bf-b107-6747f1e3e709";
const movieService = new MovieService(API_KEY);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = search.value.trim();
  if (keyword) {
    currentPage = 1;
    try {
      const searchData = await movieService.searchMoviesByKeyword(keyword);
      showMovies(searchData);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
    search.value = "";
  }
});

async function getPremiereMovies() {
  try {
    const premiereData = await movieService.getPremiereMovies(2024, "JANUARY");
    showMovies(premiereData);
  } catch (error) {
    console.error("Error getting premiere movies:", error);
  }
}

function showMovies(data) {
  const moviesContainer = document.querySelector(".movies");
  moviesContainer.innerHTML = "";

  data.items.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          class="movie__cover"
          src='${movie.posterUrlPreview}'
          alt="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => `${genre.genre}`
        )}</div>
      </div>
    `;
    moviesContainer.appendChild(movieEl);
  });
}

function nextPage() {
  currentPage++;
  const keyword = search.value.trim();
  if (keyword) {
    try {
      movieService
        .searchMoviesByKeyword(keyword, currentPage)
        .then(showMovies)
        .catch((error) => console.error("Error fetching movies:", error));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    const keyword = search.value.trim();
    if (keyword) {
      try {
        movieService
          .searchMoviesByKeyword(keyword, currentPage)
          .then(showMovies)
          .catch((error) => console.error("Error fetching movies:", error));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  }
}
