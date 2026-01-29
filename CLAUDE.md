# CLAUDE.md

Guide opérationnel pour travailler avec ce projet via Claude Code.

## Tech Stack

**Astro 5.5.4** • **Notion CMS** • **TailwindCSS 3.4** • **TypeScript (Strict)**

Site statique pour Flora Leicarrague, architecte d'intérieur à Toulon, France.

## Quick Reference

### Environment Variables (Required)
```env
NOTION_SECRET=your_integration_token
NOTION_DATABASE_ID=your_database_id
```

### Development Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview built site locally |
| `npm install` | Install dependencies |

---

## Critical File Map

```
📁 Core Architecture
├── src/lib/notion.ts                    - Notion API client (seul getPages() est utilisé)
├── src/lib/parseNotion.ts              - Transform Notion → ParsedPage (29 properties)
├── src/types/ParsedPage.ts             - TypeScript interface
├── astro.config.mjs                    - Static output, sitemap, image domains
└── tailwind.config.js                  - Brand colors, custom breakpoints, shadows

📁 UI Components (src/components/)
├── Icon.astro                          - SVG icon system (8 icons disponibles)
├── StructuredData.astro                - SEO schema markup (LocalBusiness)
├── LastProjects.astro                  - 3 dernières réalisations (rank sorted)
├── LastArchitecture.astro              - 3 derniers projets archi (label filtered)
├── LastProjets.astro                   - 3 derniers projets études (date sorted)
└── Welcome.astro                       - ⚠️ UNUSED (default Astro component)

📁 Layout & Styling
├── src/layouts/Layout.astro            - Single layout: SEO, nav, footer
├── src/styles/global.css               - Component classes (.btn, .h1-.h4, .section, etc)
└── tailwind.config.js                  - Extended theme configuration

📁 Dynamic Routes (Notion-powered)
├── src/pages/projet/[slug].astro                  - Project detail pages
└── src/pages/architecture-interieur/[slug].astro  - Architecture detail pages

📁 Static Pages (src/pages/)
├── index.astro                         - Homepage
├── a-propos.astro                      - About page
├── prestations.astro                   - Services
├── realisations.astro                  - Portfolio overview
├── avis.astro                          - Reviews/testimonials
└── contact.astro                       - Contact page
```

---

## Notion Integration Deep Dive

### Complete Property Mapping

| Notion Property | ParsedPage Field | Type | Usage |
|-----------------|------------------|------|-------|
| `Page` | `title` | title | Page title (required) |
| `Slug` | `slug` | rich_text | URL slug for routing |
| `Status` | `status` | multi_select | Filter: "En ligne", "En Cours" |
| `Published` | `published` | checkbox | Publish flag (not actively used) |
| `Label` | `label` | multi_select | "architecture intérieur" or "projet" |
| `Category` | `category` | select | Content category (defined but unused) |
| `Excerpt` | `excerpt` | rich_text | Card preview text |
| `Contenu` | `content` | rich_text | Main content block |
| `Contenu2` | `content2` | rich_text | Additional content section |
| `Contenu3` | `content3` | rich_text | Additional content section |
| `Contenu4` | `content4` | rich_text | Additional content section |
| `Contenu5` | `content5` | rich_text | Additional content section |
| `Montexte` | `montexte` | rich_text | Custom text field |
| `ImagePresentation` | `imagePresentation` | file | Hero/card image |
| `Images` | `images` | files[] | Gallery 1 (3-col grid, first spans 2) |
| `Images02` | `images02` | files[] | Gallery 2 (4-col responsive) |
| `Images03` | `images03` | files[] | Gallery 3 (4-col responsive) |
| `Images04` | `images04` | files[] | Gallery 4 (4-col responsive) |
| `Images05` | `images05` | files[] | Gallery 5 (4-col responsive) |
| `Images06projet` | `images06` | files[] | Gallery 6 (single column) |
| `Rank` | `rank` | number | Manual sort order |
| `Date` | `date` | date | Project date (ISO format) |
| `Btn_text` | `btnText` | rich_text | CTA button text |
| `Lien` | `link` | url | External link |
| `created_time` | `created` | timestamp | Auto-generated |
| `last_edited_time` | `edited` | timestamp | Auto-generated |

### Common Filtering Patterns

```typescript
// Get all published projects (any type)
const projects = parsedPages
  .filter(p => ["En ligne", "En Cours"].includes(p.status ?? ""))

// Get architecture projects only
const archiProjects = parsedPages
  .filter(p => p.label === "architecture intérieur")
  .filter(p => ["En ligne", "En Cours"].includes(p.status ?? ""))

// Get study projects only
const studyProjects = parsedPages
  .filter(p => p.label === "projet")
  .filter(p => ["En ligne", "En Cours"].includes(p.status ?? ""))

// Sort by rank (ascending - for architecture)
.sort((a, b) => {
  if (!a.rank && !b.rank) return 0;
  if (!a.rank) return 1;
  if (!b.rank) return -1;
  return a.rank - b.rank;
})

// Sort by date (descending - for projects)
.sort((a, b) => {
  if (a.date && b.date) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
  return 0;
})

// Limit to 3 items
.slice(0, 3)
```

### ⚠️ IMPORTANT NOTES

- **`getPageContent()` exists but is NEVER used** - Block-level content not needed, all content stored in properties
- **`notion-to-md` package installed but UNUSED** - Content stored as plain text in rich_text properties
- **All data fetched at BUILD TIME** - Static site generation, no runtime API calls to Notion
- **Content updates require rebuild** - `npm run build` to see changes in production
- **Dev server may cache data** - Restart dev server for fresh Notion data

---

## Component Patterns & Conventions

### Card Pattern

Used in [LastProjects.astro](src/components/LastProjects.astro:33-62), LastArchitecture.astro, LastProjets.astro:

```astro
<a
  href={isEnCours ? undefined : `/architecture-interieur/${project.slug}`}
  class={`h-full w-full xl:w-[380px] block ${
    isEnCours ? 'pointer-events-none cursor-default opacity-60' : 'group cursor-pointer'
  }`}
>
  <div class="blog__post flex flex-col h-full shadow-custom2 rounded-[10px] overflow-hidden">
    <div class="relative overflow-hidden h-[344px]">
      <img
        class={`w-full h-full object-cover ${!isEnCours ? 'group-hover:scale-110 transition-all duration-500' : ''}`}
        src={project.imagePresentation}
        alt={project.title}
      />
      {isEnCours && (
        <span class="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
          En cours
        </span>
      )}
    </div>
    <div class="px-6 py-8 flex-1 flex flex-col">
      <h4 class="h4 mb-4 line-clamp-1">{project.title}</h4>
      <p class="font-light line-clamp-2 flex-1">{project.excerpt}</p>
    </div>
  </div>
</a>
```

### Status Badge Pattern

For "En Cours" (in progress) projects:

```astro
{isEnCours && (
  <span class="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
    En cours
  </span>
)}
```

### Icon Component Usage

```astro
import Icon from '../components/Icon.astro';

<Icon name="phone" class="w-6 h-6 text-accent" />
```

**Available icons**: `menu`, `mapPin`, `mail`, `phone`, `google`, `instagram`, `facebook`, `linkedin`

### Gallery Layout Patterns

From [src/pages/projet/[slug].astro](src/pages/projet/[slug].astro):

**Gallery 1 (images)** - 3-column, first image spans 2 columns:
```astro
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
  {page.images?.map((img, idx) => (
    <div class={`relative overflow-hidden rounded-lg ${idx === 0 ? 'sm:col-span-2' : ''}`}>
      <img class="group-hover:scale-105 transition-all duration-300" />
    </div>
  ))}
</div>
```

**Gallery 2-5 (images02-05)** - 4-column responsive, special spans:
```astro
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  {page.images02?.map((img, idx) => (
    <div class={`relative overflow-hidden rounded-lg
      ${idx % 5 === 0 && idx !== 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
      ${idx % 3 === 0 && idx !== 0 ? 'sm:col-span-2' : ''}`}>
      <img class="group-hover:scale-105 transition-all duration-300" />
    </div>
  ))}
</div>
```

**Gallery 6 (images06)** - Single column, full-width:
```astro
<div class="grid grid-cols-1 gap-4">
  {page.images06?.map((img) => (
    <div class="relative overflow-hidden rounded-lg">
      <img class="group-hover:scale-105 transition-all duration-300" />
    </div>
  ))}
</div>
```

---

## Styling System

### Brand Colors

```javascript
primary:           '#242a2b'    // Dark charcoal (headings, main text)
secondary:         '#808080'    // Gray (body text, inactive)
accent:            '#e2bb9e'    // Warm beige (CTAs, hover, highlights)
accent-secondary:  '#FFFFFF'    // White (button hover states)
accent-tertiary:   '#F5C39E'    // Light peach (badges, decorative)
grey:              '#EEEAE6'    // Light gray (backgrounds)
```

### Component CSS Classes

From [global.css](src/styles/global.css):

**Typography**:
```css
.h1  - text-[36px] xl:text-[64px], font-semibold
.h2  - text-[30px] xl:text-[44px], font-light, uppercase, tracking-[0.44px]
.h3  - text-[20px] xl:text-[26px], font-semibold
.h4  - text-[20px] xl:text-[26px], font-semibold, capitalize
```

**Buttons**:
```css
.btn           - Base button: flex, rounded-full, uppercase
.btn-sm        - Height: h-14 (56px), Padding: px-10
.btn-lg        - Height: h-16 (64px), Padding: px-[50px]
.btn-accent    - bg-accent, hover:bg-white hover:text-primary
.btn-white     - bg-white text-secondary, hover:bg-white/90
.btn-outline   - border-2 border-accent, hover:bg-accent hover:text-white
```

**Layout**:
```css
.section       - py-12 xl:py-[150px] (standard section spacing)
```

**Mobile Navigation**:
```css
.mnav          - Fixed, left-[-100%], slide animation
.mnav--open    - left-0 (open state)
.mnav__close-btn-icon - Rotate 90° when open
```

**Form Elements**:
```css
.input, .select - h-[66px], rounded-[10px], border-[#dbdfdf]
```

### Hover Patterns

**Standard patterns across the site**:

```astro
<!-- Card images -->
class="group-hover:scale-110 transition-all duration-500"

<!-- Gallery images -->
class="group-hover:scale-105 transition-all duration-300"

<!-- Links/Text -->
class="hover:text-accent transition-all duration-300"

<!-- Overlay -->
class="group-hover:bg-opacity-20 transition-all duration-300"
```

### Responsive Breakpoints

```javascript
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

**Usage**: `xl:text-[64px]`, `lg:flex-row`, `md:grid-cols-2`

---

## Common Tasks Guide

### Task: Add a New Static Page

1. **Create file** in `src/pages/[name].astro`
2. **Import Layout**:
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   ---
   <Layout title="Page Title" description="Page description">
     <!-- Your content -->
   </Layout>
   ```
3. **Add navigation link** in [src/layouts/Layout.astro](src/layouts/Layout.astro):
   - Desktop nav: Lines 123-146
   - Mobile nav: Lines 158-171
4. **Follow existing patterns** - Reference [a-propos.astro](src/pages/a-propos.astro) or [prestations.astro](src/pages/prestations.astro)

### Task: Modify Notion Properties

1. **Update TypeScript interface**: [src/types/ParsedPage.ts](src/types/ParsedPage.ts)
2. **Update mapping function**: [src/lib/parseNotion.ts](src/lib/parseNotion.ts) → `mapPageData()`
3. **Update components** that use the new property
4. **Rebuild site** to see changes: `npm run build`

### Task: Create New Component

1. **Add file** to `src/components/[Name].astro` (use PascalCase)
2. **Import and use** in pages:
   ```astro
   ---
   import Name from '../components/Name.astro';
   ---
   <Name />
   ```
3. **Follow existing patterns**:
   - Simple components: See [Icon.astro](src/components/Icon.astro)
   - Data-driven: See [LastProjects.astro](src/components/LastProjects.astro)

### Task: Modify Styling

1. **Brand colors**: Edit [tailwind.config.js](tailwind.config.js) → `theme.extend.colors`
2. **Component classes** (.btn, .h1, etc): Edit [src/styles/global.css](src/styles/global.css)
3. **Page-specific styles**: Use Tailwind utilities directly in .astro files
4. **Avoid inline styles** - Prefer utility classes for consistency

### Task: Add New Icon

1. **Add SVG file** to `src/assets/icons/[name].svg`
2. **Import** in [src/components/Icon.astro](src/components/Icon.astro) frontmatter:
   ```typescript
   import newIcon from '../assets/icons/newIcon.svg?raw';
   ```
3. **Add to icons map**:
   ```typescript
   const icons = {
     // ... existing icons
     newIcon
   }
   ```
4. **Use in components**: `<Icon name="newIcon" class="w-6 h-6" />`

### Task: Debug Notion Data

1. **Check data is fetching**: Add `console.log(parsedPages)` in page component
2. **Verify status field**: Must contain "En ligne" or "En Cours" to display
3. **Check label field**: Must match filter ("architecture intérieur" or "projet")
4. **Ensure slug exists**: Required for dynamic routes (projet/[slug])
5. **Remember build-time**: Changes require rebuild or dev server restart

---

## Performance & SEO Strategy

### Static Site Generation

- **All pages generated at build time** via `getStaticPaths()`
- **No runtime API calls** to Notion
- **Fast page loads**, excellent SEO, low hosting costs
- **Trade-off**: Content updates require rebuild (`npm run build`)

### Image Optimization

- **External domain whitelisted**: `i.imgur.com` (configured in [astro.config.mjs](astro.config.mjs:15))
- **Astro Picture component** with formats: `['avif', 'webp']`
- **Responsive sizing** with `sizes` attribute
- **Loading strategy**:
  - Hero images: `loading="eager"`
  - Below-fold: `loading="lazy"` (default)

### Script Loading Strategy

Sequential loading (defined in [Layout.astro](src/layouts/Layout.astro:316-331)):
1. Swiper.js (image slider)
2. ScrollReveal.js
3. main.js (custom scripts)

This ensures dependencies load before usage.

### SEO Components

- **Comprehensive meta tags** in Layout.astro
- **Open Graph** for social media sharing
- **Twitter Cards** support
- **StructuredData component** for schema.org LocalBusiness markup
- **Sitemap** auto-generated via `@astrojs/sitemap`

---

## Known Issues & Gotchas

### ⚠️ Unused Code (Safe to Ignore or Remove)

- **[src/components/Welcome.astro](src/components/Welcome.astro)** - Default Astro component, never imported
- **`getPageContent()` in [notion.ts](src/lib/notion.ts:26)** - Defined but never called anywhere
- **`notion-to-md` package** - Installed in package.json but not used
- **ScrollReveal animations** - Library loaded but all animations commented out in [main.js](public/js/main.js:73-159)

### ⚠️ Duplicate Components Pattern

- **LastProjects.astro**, **LastArchitecture.astro**, **LastProjets.astro** are 95% identical
- **Only differences**: Filter logic (label/status), sort order (rank/date), heading text
- **Consider**: Could be unified into a single parameterized component

### ⚠️ Mobile Background

- **`.bg-mobile` class** applies different background image on screens <768px
- **Defined**: [global.css:53-61](src/styles/global.css:53-61)
- **Used**: Only on homepage hero section

### ⚠️ Notion Property Naming

- **Notion properties** use French names (Contenu, Images06projet, etc.)
- **ParsedPage interface** uses English names
- **Be careful** with exact spelling when debugging

### ⚠️ Build-Time Data Caching

- **Notion data** fetched during build, not at runtime
- **Dev server** may cache data between file changes
- **For fresh data**: Restart dev server (`Ctrl+C` → `npm run dev`)

---

## File Structure Overview

```
flora-website-v4/
├── src/
│   ├── assets/               - Images, icons (imported via Astro)
│   │   ├── icons/           - SVG icons for Icon component
│   │   └── img/             - Images organized by section
│   ├── components/          - 6 reusable Astro components
│   ├── data/                - Static JSON (avis.json for testimonials)
│   ├── layouts/             - Layout.astro (single layout)
│   ├── lib/                 - Business logic
│   │   ├── notion.ts        - Notion API client
│   │   └── parseNotion.ts   - Data transformation
│   ├── pages/               - File-based routing
│   │   ├── index.astro      - Homepage
│   │   ├── [static].astro   - 13 static pages
│   │   ├── projet/[slug].astro              - Dynamic project pages
│   │   └── architecture-interieur/[slug].astro - Dynamic architecture pages
│   ├── styles/              - Global styles
│   │   ├── global.css       - Component classes
│   │   └── swiper-bundle.min.css - Vendor CSS
│   └── types/               - TypeScript definitions
├── public/
│   ├── assets/              - Static assets (not optimized)
│   ├── js/                  - Vanilla JavaScript
│   │   ├── main.js          - Custom scripts
│   │   ├── swiper-bundle.min.js - Image slider
│   │   └── scrolreveal.min.js - Scroll animations
│   ├── favicon-32x32.svg    - Site favicon
│   └── robots.txt           - SEO crawling rules
├── astro.config.mjs         - Astro configuration
├── tailwind.config.js       - Tailwind theme customization
├── package.json             - Dependencies
└── .env                     - Environment variables (git-ignored)
```

---

## Third-Party Libraries

| Library | Usage | Loaded | Notes |
|---------|-------|--------|-------|
| **Glide.js** | Testimonials carousel | CDN (defer) | Initialized in main.js, `#testimonial-slider` |
| **Swiper.js** | Hero image slider | Local (sequential) | Loaded before ScrollReveal and main.js |
| **ScrollReveal** | Scroll animations | Local (sequential) | ⚠️ Currently disabled/unused in main.js |
| **TailwindCSS** | Utility-first styling | Build-time | Extended theme in tailwind.config.js |
| **Notion Client** | Headless CMS | Build-time | Only `getPages()` used, no runtime calls |
| **@astrojs/sitemap** | SEO sitemap | Build-time | Auto-generates sitemap.xml |

---

## When Working on This Codebase

### DO:
- ✅ Use existing component classes (`.btn`, `.h1-.h4`) for consistency
- ✅ Follow group hover patterns for interactive elements
- ✅ Test on mobile viewport (site is mobile-first)
- ✅ Use brand colors from [tailwind.config.js](tailwind.config.js:24-33)
- ✅ Filter Notion data by status ("En ligne", "En Cours")
- ✅ Rebuild after Notion property changes
- ✅ Reference similar components when unsure

### DON'T:
- ❌ Use `getPageContent()` - it's unused, content is in properties
- ❌ Import `Welcome.astro` - it's an unused default component
- ❌ Expect real-time Notion updates (build-time only)
- ❌ Use inline styles (prefer Tailwind utilities)
- ❌ Forget to add new pages to navigation (2 places in Layout.astro)
- ❌ Use ScrollReveal (currently disabled)

### WHEN IN DOUBT:
- 🔍 **Card layouts**: Reference [LastProjects.astro](src/components/LastProjects.astro)
- 🔍 **Notion filtering**: Check existing filter patterns in components
- 🔍 **Styling**: Look at similar components first
- 🔍 **Gallery layouts**: See [projet/[slug].astro](src/pages/projet/[slug].astro) for all 6 patterns
- 🔍 **Navigation**: Both desktop and mobile nav in [Layout.astro](src/layouts/Layout.astro)

---

## Additional Resources

- **Astro Documentation**: https://docs.astro.build
- **Notion API**: https://developers.notion.com
- **TailwindCSS**: https://tailwindcss.com/docs

---

*This file provides guidance to Claude Code when working with this repository. Keep it updated as the project evolves.*
