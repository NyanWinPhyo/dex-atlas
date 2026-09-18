# DexAtlas

A modern, expandable Pokémon companion platform built with React and TypeScript.

DexAtlas is designed to combine universal Pokémon reference data with interactive tools, personal collection tracking, team analysis, and game-specific companion guides in one responsive application.

The current development focus is **Pokémon Legends: Z-A**, while the underlying architecture is designed to support additional Pokémon games over time.

> This project is currently under active development.

---

## Current Features

- Universal Pokédex containing 1,025 Pokémon species
- Fast local Pokédex index
- Search by Pokémon name or Pokédex number
- Filter by generation
- Filter by type
- Sort by:
  - Pokédex number
  - Name
  - HP
  - Attack
  - Defense
  - Speed
- Responsive Pokémon grid
- Pagination and page jumping
- Pokémon type badges
- Basic Pokémon stat data
- Responsive desktop and mobile application shell

---

## Planned Features

### Universal Tools

- Dedicated Pokémon detail pages
- Evolution information
- Pokémon comparison
- Type matchup calculator
- Team builder
- Team weakness and coverage analysis
- Personal collection tracker
- Shiny tracking
- Saved teams
- Import/export player data
- Optional account and cloud synchronization

### Pokémon Legends: Z-A

The first detailed game companion will focus on Pokémon Legends: Z-A.

Planned features include:

- Z-A-specific Pokédex
- Wild Zone guides
- Alpha Pokémon tracking
- Shiny tracking
- Mega Evolution tracking
- Z-A Royale progression
- Time, weather and spawn filtering
- Team analysis
- Battle reference tools
- Collection and completion tracking

Additional games may be added gradually in the future.

---

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- PokéAPI
- Git / GitHub

Future infrastructure may include:

- Supabase
- PostgreSQL
- PWA / offline support
- Cloud synchronization

---

## Architecture

The project separates universal Pokémon reference data from game-specific information.

```text
Universal Pokémon Data
        |
        +--- Game Data
        |       |
        |       +--- Pokémon Legends: Z-A
        |       +--- Future Games
        |
        +--- Player Data
                |
                +--- Collection
                +--- Teams
                +--- Progress