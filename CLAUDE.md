# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based website for Flora Leicarrague, an interior architect based in Toulon, France. The site integrates with Notion as a CMS for dynamic content management and uses TailwindCSS for styling.

## Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview built site locally |
| `npm install` | Install dependencies |

## Architecture & Key Components

### Notion Integration
- **Primary CMS**: Uses Notion as headless CMS via `@notionhq/client`
- **Data Layer**:
  - `src/lib/notion.ts`: Core Notion API functions (`getPages()`, `getPageContent()`)
  - `src/lib/parseNotion.ts`: Maps Notion data to typed objects via `mapPageData()`
  - `src/types/ParsedPage.ts`: TypeScript interface for Notion page data
- **Environment**: Requires `NOTION_SECRET` and `NOTION_DATABASE_ID` in `.env`

### Content Structure
- **Dynamic Pages**: Content sourced from Notion database with properties like:
  - Multiple content fields (`content`, `content2`-`content5`, `montexte`)
  - Multiple image arrays (`images`, `images02`-`images06`)
  - Metadata (`title`, `slug`, `status`, `published`, `category`, `label`)
  - SEO fields (`excerpt`, `btnText`, `link`)

### Styling & UI
- **Framework**: Astro with TailwindCSS
- **Custom Theme**: Extended Tailwind config with:
  - Brand colors (`primary: #242a2b`, `accent: #e2bb9e`)
  - Custom breakpoints, shadows, and background images
  - Font family: Raleway (primary), Montserrat (secondary)
- **Components**: Reusable Astro components in `src/components/`
- **Layout**: Single main layout in `src/layouts/Layout.astro` with full SEO setup

### Site Structure
- **Static Routes**: Standard Astro file-based routing in `src/pages/`
- **Dynamic Routes**:
  - `/projet/[slug]/` for individual projects
  - `/architecture-interieur/[slug]/` for architecture content
- **Key Pages**: Home, About (`a-propos`), Services (`prestations`), Portfolio (`realisations`), Reviews (`avis`), Contact

### External Dependencies
- **Carousel**: Glide.js for image sliders
- **Animations**: ScrollReveal for scroll animations
- **Image Handling**: Astro's built-in Image component with external domain support for Notion images
- **SEO**: Comprehensive meta tags, Open Graph, Twitter Cards, structured data

### Configuration Notes
- **Static Site**: Output configured as 'static' for deployment
- **Site URL**: `https://www.flora-architecteinterieur.com`
- **Image Domains**: Configured to allow `i.imgur.com` for external images
- **TypeScript**: Strict configuration extending Astro's strict preset