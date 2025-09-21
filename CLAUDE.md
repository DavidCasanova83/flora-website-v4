# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional website for Flora Leicarrague, an interior architect based in Toulon, France. The site is built with Astro.js and integrates with Notion for content management.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview build locally before deploying |
| `npm run astro` | Run Astro CLI commands |

## Architecture & Structure

### Core Technologies
- **Astro.js** - Static site generator with component islands
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Notion API** - Content management via @notionhq/client

### Key Directories
- `src/pages/` - File-based routing (Astro pages)
- `src/components/` - Reusable Astro components
- `src/layouts/` - Page layout templates
- `src/lib/` - Utility functions and API integrations
- `src/assets/` - Static assets organized by type
- `public/` - Static files served directly

### Notion Integration
The site uses Notion as a headless CMS:
- `src/lib/notion.ts` - Notion API client and data fetching
- `src/lib/parseNotion.ts` - Transforms Notion content for display
- Environment variables required: `NOTION_SECRET` and `NOTION_DATABASE_ID`

### SEO & Performance
- Comprehensive meta tags and Open Graph support in Layout.astro
- Structured data for local business (StructuredData.astro)
- Image optimization with Astro's Image component
- Sitemap generation via @astrojs/sitemap

### Styling System
- Custom Tailwind configuration with design system colors
- Font families: Raleway and Montserrat from Google Fonts
- Custom CSS in src/styles/global.css
- Swiper.js for carousels and image galleries

### Dynamic Content
- Blog posts and project pages sourced from Notion
- Dynamic routing: `/projet/[slug].astro`, `/blog/[slug].astro`
- Client testimonials in src/data/avis.json

### Key Configuration
- Site URL: https://www.flora-architecteinterieur.com
- French language (lang="fr")
- Mobile-first responsive design
- Google Analytics and social media integration

## Environment Setup
Create `.env` file with:
```
NOTION_SECRET=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```