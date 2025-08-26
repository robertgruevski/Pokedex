namespace Pokedex.Server.Models
{
	public class PokemonListResponse
	{
		public List<PokemonResult> Results { get; set; } = new();
	}

	public class PokemonResult
	{
		public string Name { get; set; }
		public string Url { get; set; }
	}
}