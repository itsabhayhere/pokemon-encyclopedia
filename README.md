# ⚡ PokéExplorer — Modern Pokémon Explorer Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PokéAPI](https://img.shields.io/badge/Data-PokéAPI-EF5350?style=for-the-badge&logo=pokemon)](https://pokeapi.co/)

A responsive, high-performance **Pokémon Explorer** web application built with **Next.js (Pages Router)**, **TypeScript**, and **Tailwind CSS**, consuming data from the official **PokéAPI**.

---

## ✨ Features

### 1. 🏠 Dynamic Homepage (`/`)
- **PokéAPI Integration:** Fetches and displays a grid of Pokémon with official high-resolution artwork, dual-type badges, and preview stats (HP, Attack, Speed).
- **Instant Search:** Real-time filtering by Pokémon name or Pokédex number (`#ID`). Press `/` anywhere to immediately focus the search bar.
- **Type Filter Badges:** Interactive filter chips covering all 18 Pokémon elemental types with bespoke color schemes and glows.
- **Sorting Options:** Sort results by Lowest/Highest Pokédex number or Alphabetically (A–Z, Z–A).
- **Batch Pagination / Load More:** Smooth "Load More" pagination fetching subsequent batches with non-blocking UI states.

### 2. 🔍 Detailed Pokémon Page (`/pokemon/[id]`)
- **Next.js Dynamic Routing:** Full dynamic routing support (`pages/pokemon/[id].tsx`).
- **Interactive Visuals:** 
  - Official high-definition artwork with dynamic ambient glow matching the Pokémon's primary type.
  - **Shiny Form Toggle:** Switch between regular and rare shiny forms on demand.
  - **Audio Cry Player:** Plays authentic Pokémon sound cries via the PokéAPI sound asset registry.
- **Physical Attributes:** Metric and Imperial height and weight conversions, genus classification, and base experience points.
- **Deep-Dive Tabs:**
  - **Base Stats:** Animated stat bars with letter grades (S+, S, A, B, C) and total stat calculations.
  - **Abilities:** Displays both standard and hidden abilities with complete English descriptions.
  - **Evolution Pathway:** Visual chain showing pre-evolutions, minimum levels, trigger items, and direct links to each stage.
  - **Learnable Moves:** Filterable move library categorized by learn method (Level-Up, Machine/TM, Egg, Tutor).
- **Quick Navigation:** Instant Previous (`← #024`) and Next (`#026 →`) Pokémon switcher buttons.

### 3. 🚀 Performance & Architecture
- **Static Generation (SSG) & ISR:** The first 50 Pokémon pages and the homepage are pre-rendered at build time with daily cache invalidation (`revalidate: 86400`).
- **On-Demand Blocking Fallback:** Any Pokémon from #1 to #1025 is statically generated and cached on first visit with zero delay.
- **Optimized Payloads:** Clean payload filtering reduces static JSON payloads from ~400 kB down to under 20 kB per page.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 (Custom color tokens, glassmorphism, responsive grid)
- **Data Source:** [PokéAPI](https://pokeapi.co/)
- **Icons:** Lucide React
- **Typography:** Plus Jakarta Sans & JetBrains Mono

---

## 📁 Project Structure

```text
pokemon-explorer/
├── components/
│   ├── AudioCryButton.tsx     # Authentic Pokémon cry audio player
│   ├── Footer.tsx             # Responsive footer with links
│   ├── Layout.tsx             # Global layout, ambient lighting & SEO meta
│   ├── Navbar.tsx             # Sticky header with random Pokémon picker
│   ├── PokemonCard.tsx        # Card component with 3D hover effects
│   ├── SearchBar.tsx          # Real-time search, sorting & type chips
│   └── StatBar.tsx            # Animated battle stat bar with tier badges
├── lib/
│   ├── colors.ts              # Custom style definitions for all 18 Pokémon types
│   └── pokeapi.ts             # Typed PokéAPI clients & data sanitizers
├── pages/
│   ├── _app.tsx               # Next.js App wrapper
│   ├── _document.tsx          # HTML document & Google fonts
│   ├── index.tsx              # Homepage with pre-rendered list & search
│   └── pokemon/
│       └── [id].tsx           # Dynamic detail page (SSG + ISR)
├── styles/
│   └── globals.css            # Tailwind directives, custom scrollbars & dark theme
├── types/
│   └── pokemon.ts             # Full TypeScript interfaces
├── next.config.mjs            # Remote image domains configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm:** v9.0.0 or higher

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd ~/Desktop/pokemon-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build & Verification

To test the production SSG build:
```bash
npm run build
npm run start
```

---

## 📝 GitHub Submission Instructions

To push this repository to your GitHub account:

1. **Create a new public repository** on GitHub named `pokemon-explorer`.
2. **Commit and push from your terminal:**
   ```bash
   cd ~/Desktop/pokemon-explorer
   git add .
   git commit -m "feat: complete Pokemon Explorer with Next.js, SSG, and Tailwind CSS"
   git branch -M main
   git remote add origin https://github.com/itsabhayhere/pokemon-explorer.git
   git push -u origin main
   ```

---

## 👨‍💻 Author

- **Abhay Kumar**
- GitHub: [@itsabhayhere](https://github.com/itsabhayhere)
- LinkedIn: [in/itsabhayhere](https://www.linkedin.com/in/itsabhayhere/)
