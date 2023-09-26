const pokeApiDetail = {}

const queryStringDetail = new URLSearchParams(window.location.search)

const idPokemon = queryStringDetail.get("id")

const bodyElement = document.getElementById("bodyElement")

var pokemon = new Pokemon()

function convertPokemonDetailToModel(pokemonDetail) {
    
    pokemon.number = pokemonDetail.id
    pokemon.name = pokemonDetail.name
    
    const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokemonDetail.sprites.other.dream_world.front_default

    const height = pokemonDetail.height
    const weight = pokemonDetail.weight
    pokemon.height = height != 0 ? (height / 10) : height
    pokemon.weight = weight != 0 ? (weight / 10) : weight

    pokemon.abilitie = pokemonDetail.abilities[0].ability.name.replace('-', ' ')

    const stats = pokemonDetail.stats.map((statsSlot) => statsSlot.base_stat)
    pokemon.stats = stats

    return pokemon
}

pokeApiDetail.getSpecie = (pokemonDetail) => {
    return fetch(pokemonDetail.species.url)
    .then((response) => response.json())
    .then((pokemonDetail2) => {
        pokemon.specie = pokemonDetail2.genera[7].genus
        return pokemon
    })
}

fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
    .then((response) => response.json())
    .then((pokemonDetail) => {
        pokemon = convertPokemonDetailToModel(pokemonDetail)
        return pokeApiDetail.getSpecie(pokemonDetail)
    })
    .then((pokemon) => bodyElement.innerHTML = convertModelToHtml(pokemon))

function convertModelToHtml(pokemon) {

    return `
            <section class="content ${pokemon.type}">
                <div class="identification">
                    <div>
                        <h1 class="namePokemon">${pokemon.name}</h1>
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                    </div>
                    <span class="number">#${pokemon.number}</span>
                </div>
                <img class="imgPokemon" src="${pokemon.photo}" alt="${pokemon.name}">
                <div class="about">
                    <h3>Details</h3>
                    <hr class="separator"/>
                    <ol class="details">
                        <li>Species</li>
                        <li>${pokemon.specie}</li>
                        <li>Height</li>
                        <li>${pokemon.height} m</li>
                        <li>Weight</li>
                        <li>${pokemon.weight} kg</li>
                        <li>Abilities</li>
                        <li class="abilitie">${pokemon.abilitie}</li>
                    </ol>
                    <h3>Stats</h3>
                    <hr class="separator"/>
                    <ol class="details">
                        <li>HP</li>
                        <li>${pokemon.stats[0]}</li>
                        <li>Attack</li>
                        <li>${pokemon.stats[1]}</li>
                        <li>Defense</li>
                        <li>${pokemon.stats[2]}</li>
                        <li>Special-Attack</li>
                        <li>${pokemon.stats[3]}</li>
                        <li>Special-Defense</li>
                        <li>${pokemon.stats[4]}</li>
                        <li>Speed</li>
                        <li>${pokemon.stats[5]}</li>
                    </ol>
                </div>
            </section>`
}


