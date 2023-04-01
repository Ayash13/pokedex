$(() => {
    const apiURL = 'https://pokeapi.co/api/v2/pokemon/';
    let offset = 0;
    const limit = 10;
    let pokemonData = [];

    const loadPokemon = async (searchTerm) => {
        let endpoint = `${apiURL}?offset=${offset}&limit=${limit}`;

        if (searchTerm) {
            endpoint = `${apiURL}${searchTerm}`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.results) {
            for (const pokemon of data.results) {
                const detailsResponse = await fetch(pokemon.url);
                const details = await detailsResponse.json();
                const types = details.types.map(type => type.type.name).join(' / ');
                const moves = details.moves
                    .map(move => move.move.name)
                    .slice(0, 4)
                    .map(move => `<li>${move}</li>`)
                    .join('');
                const { front_default: imageSrc } = details.sprites;
                const { id, name } = details;
                const html = `<tr class="${types.toLowerCase()}">
                            <td>#${id}</td>
                            <td>${name.charAt(0).toUpperCase() + name.slice(1)}</td>
                            <td>${types}</td>
                            <td><img class="img" src="${imageSrc}" alt="${name}"></td>
                            <td><ul class="moves">${moves}</ul></td>
                          </tr>`;
                $('#pokemon-data').append(html);
            }
        } else {
            const types = data.types.map(type => type.type.name).join(' / ');
            const moves = data.moves
                .map(move => move.move.name)
                .slice(0, 4)
                .map(move => `<li>${move}</li>`)
                .join('');
            const { front_default: imageSrc } = data.sprites;
            const { id, name } = data;
            const html = `<tr class="${types.toLowerCase()}">
                          <td>#${id}</td>
                          <td>${name.charAt(0).toUpperCase() + name.slice(1)}</td>
                          <td>${types}</td>
                          <td><img class="img" src="${imageSrc}" alt="${name}"></td>
                          <td><ul class="moves">${moves}</ul></td>
                        </tr>`;
            $('#pokemon-data').empty().append(html);
        }
    };


    const displayPokemon = (pokemonList) => {
        $('#pokemon-data').empty();
        for (const pokemon of pokemonList) {
            const { id, name, types, imageSrc, moves } = pokemon;
            const html = `<tr class="${types.toLowerCase()}">
                        <td>#${id}</td>
                        <td>${name.charAt(0).toUpperCase() + name.slice(1)}</td>
                        <td>${types}</td>
                        <td><img class="img" src="${imageSrc}" alt="${name}"></td>
                        <td><ul class="moves">${moves}</ul></td>
                      </tr>`;
            $('#pokemon-data').append(html);
        }
    }

    loadPokemon();

    $('#show-more').on('click', () => {
        offset += limit;
        loadPokemon();
    });

    $('#pokemon-data').on('mouseenter', 'tr', function () {
        $(this).addClass('hover');
    });
    $('#pokemon-data').on('mouseleave', 'tr', function () {
        $(this).removeClass('hover');
    });

    $('#search-bar').on('input', function () {
        const searchTerm = $(this).val().toLowerCase().trim();
        if (searchTerm) {
            loadPokemon(searchTerm);
        } else {
            $('#pokemon-data').empty();
            offset = 0;
            loadPokemon();
        }
    });

});
