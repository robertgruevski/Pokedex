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
        <div className="p-6 bg-gray-900 min-h-screen text-white font-mono">

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
                            className="bg-gray-800 text-white shadow rounded-2xl p-4 flex flex-col items-center"
                            onClick={() => openDetail(pokemon.name)}
                        >
                            <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 mb-2" />
                            <p className="capitalize font-semibold">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            }

            {selectedPokemon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
                    onClick={closeDetail}
                >
                    <div
                        className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm border-4 border-red-600 shadow-lg relative text-white font-mono"
                        onClick={e => e.stopPropagation()}
                    >

                        <div className="absolute inset-x-0 top-0 h-8 bg-red-600 rounded-t-xl flex items-center justify-end px-3">
                            <button
                                onClick={closeDetail}
                                className="text-white text-3xl font-bold leading-none hover:text-red-200 transition-colors duration-200"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="pt-10 pb-2">

                            <h2 className="text-2xl font-bold text-center capitalize mb-4 text-cyan-400">{selectedPokemon.name}</h2>
                            <div className="bg-gray-800 border-2 border-red-400 rounded-lg p-3 mb-4 flex items-center justify-center h-64">
                                <img
                                    src={selectedPokemon.sprites.front_default}
                                    alt={selectedPokemon.name}
                                    className="max-w-full max-h-full object-contain h-48"
                                />
                            </div>

                            <div className="text-sm border-2 border-red-400 p-3 rounded-lg mb-4">
                                <div className="flex justify-between items-baseline mb-2">
                                    <p><strong className="text-red-300">Type:</strong> <span className="capitalize">{selectedPokemon.types.map(t => t.type.name).join(', ')}</span></p>
                                    <p><strong className="text-red-300">Abilities:</strong> <span className="capitalize">{selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</span></p>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <p><strong className="text-red-300">Height:</strong>
                                        {(() => {
                                            const totalInches = selectedPokemon.height * 3.93701;
                                            const feet = Math.floor(totalInches / 12);
                                            const inches = Math.round(totalInches % 12);
                                            return ` ${feet}'${inches}"`;
                                        })()}
                                    </p>
                                    <p><strong className="text-red-300">Weight:</strong>{` ${(selectedPokemon.weight * 0.220462).toFixed(1)} lbs`}</p>
                                </div>
                            </div>

                            <div className="p-3 border-2 border-red-400 rounded-lg bg-gray-800">
                                <h3 className="font-bold text-lg text-red-400 text-center mb-2">Base Stats</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-cyan-300">
                                    {selectedPokemon.stats.map(stat => (
                                        <div key={stat.stat.name} className="flex justify-between items-center py-0.5">
                                            <span className="capitalize">{stat.stat.name.replace('-', ' ')}:</span>
                                            <span className="font-semibold">{stat.base_stat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;