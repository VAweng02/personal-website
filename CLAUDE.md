# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML personal portfolio website for Vincent Weng hosted on GitHub Pages at vincentweng.com. No build tools, frameworks, or package managers—just vanilla HTML/CSS/JavaScript.

## Development

**Local development:** Open HTML files directly in a browser, or use any simple HTTP server:
```bash
python -m http.server
```

**Deployment:** Push to `main` branch—GitHub Pages deploys automatically.

## Architecture

### Partial Injection System

The key architectural pattern is dynamic HTML component injection via `scripts/includes.js`:

```html
<div data-include="partials/header.html"></div>
<div data-include="partials/footer.html"></div>
```

At DOM load, elements with `data-include` attributes are replaced with fetched HTML content. After all partials load, a `partials:loaded` event fires for other scripts to initialize.

### Event-Driven JavaScript

Scripts wait for the `partials:loaded` event before initializing:
- `scripts/site.js` - Hamburger menu, footer year updates
- `scripts/articles.js` - Category filtering for article cards
- `js/toc.js` - Auto-generates table of contents for blog posts from h2/h3 headings

### File Structure

- `index.html`, `about.html`, `articles.html`, `projects.html`, `contact.html` - Main pages
- `partials/` - Reusable header and footer components
- `scripts/` - Main JavaScript (includes.js, site.js, articles.js)
- `styles/main.css` - Primary stylesheet with BEM-like class naming
- `blog/` - Blog post templates

### External Services

- **Formspree** - Contact form backend
- **Font Awesome 6.4.0** - Icons (CDN)
- **Google Fonts** - Poppins typeface
