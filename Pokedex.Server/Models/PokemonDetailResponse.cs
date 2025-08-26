using System.Text.Json.Serialization;

namespace Pokedex.Server.Models
{
    public class PokemonDetailResponse
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public List<PokemonTypeWrapper> Types { get; set; } = new();
        public List<PokemonAbilityWrapper> Abilities { get; set; } = new();
        public PokemonSprites Sprites { get; set; }
    }

    public class PokemonTypeWrapper
    {
        public PokemonType Type { get; set; }
    }

    public class PokemonType
    {
        public string Name { get; set; }
    }

    public class PokemonAbilityWrapper
    {
        public PokemonAbility Ability { get; set; }
    }

    public class PokemonAbility
    {
        public string Name { get; set; }
    }

    public class PokemonSprites
    {
		[JsonPropertyName("front_default")]
		public string FrontDefault { get; set; }
    }
}