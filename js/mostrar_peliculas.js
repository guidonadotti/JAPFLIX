const SEARCH_BUTTON = document.getElementById("btnBuscar");
const MOVIES_LIST = document.getElementById("lista");
const MOVIES_JSON = "https://japceibal.github.io/japflix_api/movies-data.json";
let inputSearch = "";
let moviesInfo = undefined;

//Obtiene JSON de películas
async function getMoviesData() {
    const moviesResponse = await fetch(MOVIES_JSON);
    const moviesData = await moviesResponse.json();
    moviesInfo = moviesData;
}

document.addEventListener("DOMContentLoaded", () => {
    getMoviesData();

    SEARCH_BUTTON.addEventListener("click", () => {
        inputSearch = (document.getElementById("inputBuscar").value).toLowerCase();
        if (moviesInfo) {
            MOVIES_LIST.classList.add("border", "border-secondary");
        }
        showMoviesList(moviesInfo, inputSearch);
    })
})

function voteToStars(vote) {
    let checkedStar = `
    <span class="fa fa-star checked"></span>
    `
    let uncheckedStar = `
    <span class="fa fa-star"></span>
    `
    let starsRating;
    averageVote = Math.round(vote / 2);

    starsRating = checkedStar.repeat(averageVote) + uncheckedStar.repeat(5 - averageVote);
    
    return starsRating;
}

function showMoviesList(array, input) {
    let HTMLContentToAppend = ``;

    for (const pelicula of array) {
        //Obtiene géneros de la película
        let genres = [];
        for (const genre of pelicula.genres) {
            genres.push(genre.name);
        }
        let spreadGenres = genres.join(" - ");
        let datos = (pelicula.title + pelicula.overview + pelicula.tagline + spreadGenres).toLowerCase();

        if (datos.includes(input)) {
            HTMLContentToAppend += `
            <li class="list-group pt-1 pb-1">
                <a class="btn text-white" role="button" data-bs-target="#id${pelicula.id}" data-bs-toggle="offcanvas"
                    aria-controls="#id${pelicula.id}">
                <div class="row d-flex w-100 justify-content-between">
                    <div class="col-7">
                        ${pelicula.title}
                    </div>
                    <div class="col-3 d-flex justify-content-end" id="ratingStars">
                        ${voteToStars(pelicula.vote_average)}
                    </div>
                </div>
                <div>
                    ${pelicula.tagline}
                </div>
                </a>
                <div class="offcanvas offcanvas-top bg-dark" tabindex="-1" id="id${pelicula.id}" aria-labelledby="offcanvasTopLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasTopLabel">${pelicula.title}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body pb-0 pt-0">
                    <p>
                        ${pelicula.overview}
                    </p>
                    <hr>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="ms-3 pt-2 text-muted">${spreadGenres}</p>
                    <div class="dropdown pb-3 pe-3">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" 
                        aria-expanded="false" data-bs-auto-close="outside">
                        More
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                        <li class="dropdown-item">Year: ${(pelicula.release_date).slice(0, 4)}</li>
                        <li class="dropdown-item">Runtime: ${pelicula.runtime} mins</li>
                        <li class="dropdown-item">Budget: $${(pelicula.budget).toLocaleString()}</li>
                        <li class="dropdown-item">Revenue: $${(pelicula.revenue).toLocaleString()}</li>
                        </ul>
                    </div>
                </div>
            </div>
            </li>
            <hr class="m-0">
            `
        }
        MOVIES_LIST.innerHTML = HTMLContentToAppend;
    }
}