using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Pokedex.Server.Models;

namespace Pokedex.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class PokedexController : Controller
	{
		private readonly string _apiUrl = "https://pokeapi.co/api/v2/pokemon";
		private readonly HttpClient _httpClient;

		public PokedexController(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		[HttpGet("GetAllPokemon")]
		public async Task<IActionResult> GetAllPokemon()
		{
			var response = await _httpClient.GetAsync($"{_apiUrl}?limit=151&offset=0");

			if (!response.IsSuccessStatusCode)
				return StatusCode((int)response.StatusCode);

			var content = await response.Content.ReadAsStringAsync();

			var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
			var result = JsonSerializer.Deserialize<PokemonListResponse>(content, options);

			// Enrich with IDs and sprite URLs
			var enriched = result.Results.Select((p, index) => new
			{
				id = index + 1,
				name = p.Name,
				sprite = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{index + 1}.png"
			});

			return Ok(enriched);
		}

		[HttpGet("{idOrName}")]
		public async Task<IActionResult> GetPokemonDetails(string idOrName)
		{
			var response = await _httpClient.GetAsync($"{_apiUrl}/{idOrName.ToLower()}");

			if (!response.IsSuccessStatusCode)
				return StatusCode((int)response.StatusCode);

			var content = await response.Content.ReadAsStringAsync();

			// Deserialize only the properties you care about
			var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
			var pokemon = JsonSerializer.Deserialize<PokemonDetailResponse>(content, options);

			return Ok(pokemon);
		}
	}
}
