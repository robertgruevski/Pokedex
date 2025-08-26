import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const res = await axios.get('/api/pokedex/GetAllPokemon');
                setPokemonList(res.data);
            }
            catch (err) {
                console.error("Failed to fetch. Retrying...", err);
                setTimeout(fetchPokemon, 2000);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchPokemon();
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
        <div className="p-6 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold text-center mb-6">Pokédex</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Pokemon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>

            {isLoading ?
                <div>Loading...</div>
                :
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredPokemon.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className="bg-white shadow rounded-2xl p-4 flex flex-col items-center"
                            onClick={() => openDetail(pokemon.name)}
                        >
                            <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 mb-2" />
                            <p className="capitalize font-semibold">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            }

            {selectedPokemon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl w-80">
                        <button onClick={closeDetail} className="mb-4 text-red-500 font-bold">Close</button>
                        <h2 className="text-xl font-bold capitalize">{selectedPokemon.name}</h2>
                        <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="w-32 h-32 my-4" />
                        <p>
                            <strong>Height:</strong>
                            {(() => {
                                const totalInches = selectedPokemon.height * 3.93701;
                                const feet = Math.floor(totalInches / 12);
                                const inches = Math.round(totalInches % 12);
                                return ` ${feet}'${inches}"`;
                            })()}
                        </p>

                        <p>
                            <strong>Weight:</strong>
                            {` ${(selectedPokemon.weight * 0.220462).toFixed(1)} lbs`}
                        </p>
                        <p><strong>Types:</strong> {selectedPokemon.types.map(t => t.type.name).join(', ')}</p>
                        <p><strong>Abilities:</strong> {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;