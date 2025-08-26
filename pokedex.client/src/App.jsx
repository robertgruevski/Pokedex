import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        axios.get('/api/pokedex/GetAllPokemon')
            .then(res => setPokemonList(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredPokemon = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openDetail = (name) => {
        axios.get(`/api/pokedex/${name}`)
            .then(res => setSelectedPokemon(res.data))
            .catch(err => console.error(err));
    };

    const closeDetail = () => setSelectedPokemon(null);

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
                    <div
                        key={pokemon.id}
                        onClick={() => openDetail(pokemon.name)}>
                        <img src={pokemon.sprite} alt={pokemon.name}></img>
                        <p>{pokemon.name}</p>
                    </div>
                ))}
            </div>

            {selectedPokemon && (
                <div>
                    <div>
                        <button onClick={closeDetail}>Close</button>
                        <h2>{selectedPokemon.name}</h2>
                        <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name}/>
                        <p><strong>Types:</strong> {selectedPokemon.types.map(t => t.type.name).join(', ')}</p>
                        <p><strong>Abilities:</strong> {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default App;