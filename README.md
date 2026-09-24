# PokéExplorer

A Pokédex web app built with Next.js (Pages router), TypeScript, and Tailwind CSS, using data from [PokéAPI](https://pokeapi.co/).

## Overview

The app lets you browse, search, and inspect Pokémon data from all generations. It combines static generation for high-traffic entries with on-demand fallback rendering to handle the full Pokédex catalog without ballooning build times.

## Features

- **Pokédex Grid & Search**: Browse Pokémon cards with live filtering by name or number (press `/` to jump to search).
- **Type Filtering & Sorting**: Filter by elemental type chips or sort by national dex number and name.
- **Detail View**:
  - Base battle stats breakdown with stat bars and tier badges.
  - Full evolution line with trigger levels and evolution items.
  - Abilities with English descriptions (including hidden abilities).
  - Move pool categorized by learn method (level-up, TM/HM, egg, tutor).
  - Regular and shiny artwork toggle.
  - Pokémon cry audio playback using official audio assets.
- **Performance & Data Strategy**:
  - Pre-renders the first batch of 48 Pokémon at build time (`getStaticProps`).
  - On-demand ISR (`fallback: 'blocking'`) for the rest of the 1,000+ entries to avoid PokéAPI rate limits during builds.
  - Payloads from PokéAPI are trimmed in `lib/pokeapi.ts` before serialization so page props stay lightweight.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm run start
```

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React
- PokéAPI

## Author

- **Abhay Kumar** — [@itsabhayhere](https://github.com/itsabhayhere)
