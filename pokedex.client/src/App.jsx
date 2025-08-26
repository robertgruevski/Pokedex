import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [pokemonList, setPokemonList] = useState([]);

    useEffect(() => {
        axios.get('/api/pokedex/GetAllPokemon')
            .then(res => setPokemonList(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Pokédex</h1>
            <div>
                {pokemonList.map(pokemon => (
                    <div key={pokemon.id}>
                        <img src={pokemon.sprite} alt={pokemon.name}></img>
                        <p>{pokemon.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;