export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function formatDexNumber(number: number): string {
  return `#${number.toString().padStart(4, "0")}`;
}