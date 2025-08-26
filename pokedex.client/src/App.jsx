import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        axios.get('/api/pokedex/GetAllPokemon')
            .then(res => setPokemonList(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredPokemon = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>

            <h1>Pokédex</h1>

            <div>
                <input
                    type="text"
                    placeholder="Search Pokemon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div>
                {filteredPokemon.map(pokemon => (
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