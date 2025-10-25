# Research: Sports Club Static Site Template

**Feature**: 001-sports-club-ssg  
**Date**: 2025-10-25  
**Phase**: 0 (Outline & Research)

## Purpose

Resolve technical unknowns and document best practices for implementing a Hugo-based sports club website template with daisyUI/Tailwind styling and Sveltia CMS for non-technical content editing.

## Research Tasks & Findings

### 1. Hugo Best Practices for Sports Club Sites

**Task**: Research Hugo patterns for multi-team sports organizations with events, rosters, and news.

**Decision**: Use Hugo's built-in content organization:

- **Sections** for content types (`/content/teams/`, `/content/members/`, etc.)
- **Taxonomies** for teams, tags, categories (cross-reference)
- **Page bundles** for teams (colocate images/media with team pages)
- Default values from site config (`config/_default/hugo.toml`)
- Shared club/venue data in `/data/` YAML files

**Rationale**:
- Hugo's content organization maps naturally to sports club structure
- Taxonomies enable automatic cross-linking (e.g., show team's events on team page)
- Page bundles keep team assets colocated with content

**Alternatives considered**:
- Single flat `content/` directory: rejected due to poor scalability with 10-50 teams
- Data files for all content: rejected as harder for non-technical editors to understand

**References**:
- Hugo Content Organization: <https://gohugo.io/content-management/organization/>
- Hugo Taxonomies: <https://gohugo.io/content-management/taxonomies/>

---

### 2. daisyUI + Tailwind CSS Integration

**Task**: Determine optimal daisyUI theme setup for accessibility and mobile-first design.

**Decision**: Use daisyUI 4.x with custom theme extending the `light` base theme:
- Configure in `tailwind.config.js` with daisyUI plugin
- Override CSS variables for club branding (primary color, fonts)
- Purge unused styles via Tailwind's content configuration
- Process via Hugo Pipes: `{{ $css := resources.Get "css/main.css" | toCSS | postCSS | minify }}`

**Rationale**:
- daisyUI provides accessible components out of the box (WCAG 2.1 AA compliant)
- Theming via CSS variables simplifies customization for clubs
- Hugo Pipes integration avoids external build tools

**Alternatives considered**:
- Plain Tailwind without daisyUI: rejected due to need to build accessible components from scratch
- Bootstrap: rejected as heavier and less Tailwind-idiomatic

**References**:
- daisyUI Themes: <https://daisyui.com/docs/themes/>
- Hugo Pipes PostCSS: <https://gohugo.io/hugo-pipes/postcss/>

---

### 3. Sveltia CMS vs. Decap CMS

**Task**: Choose between Sveltia CMS and Decap CMS for Git-based content editing.

**Decision**: Sveltia CMS as primary; reference Decap CMS documentation for configuration patterns.

**Rationale**:
- Sveltia CMS is a modern, actively maintained fork of Decap CMS (formerly Netlify CMS)
- Config syntax is compatible with Decap CMS (`config.yml` format)
- Sveltia has better UX for media management and i18n
- Decap CMS documentation is more complete; use as reference

**Configuration approach**:
- Place `config.yml` in `static/admin/config.yml`
- Define collections for each content type (teams, events, results, posts, members)
- Use folder collections for teams (page bundles)
- Define front matter widgets matching Hugo archetypes

**Alternatives considered**:
- Decap CMS directly: viable but Sveltia has better active development
- Forestry.io/TinaCMS: rejected due to vendor lock-in and complexity

**References**:
- Sveltia CMS: <https://github.com/sveltia/sveltia-cms>
- Decap CMS Config: <https://decapcms.org/docs/configuration-options/>

---

### 4. Image Processing & Optimization

**Task**: Define image handling for portraits, event photos, and social sharing images.

**Decision**: Use Hugo's image processing with page resources:
- Store images in page bundles (`content/teams/u13/team-photo.jpg`)
- Process via `.Resize`, `.Fill`, `.Fit` in templates
- Generate responsive images with `srcset`
- Create WebP/AVIF variants for modern browsers
- Social share images: resize to 1200x630px via partial

**Rationale**:
- Hugo's native image processing avoids external tools
- Page bundles keep images near related content
- Responsive images improve mobile performance

**Alternatives considered**:
- External image CDN: rejected to maintain zero-backend constraint
- Manual image optimization: rejected as error-prone for non-technical users

**References**:
- Hugo Image Processing: <https://gohugo.io/content-management/image-processing/>

---

### 5. Performance Optimization Strategy

**Task**: Ensure LCP ≤ 2.5s, CLS ≤ 0.1, JS ≤ 50KB gzip on 3G.

**Decision**: Implement performance best practices:
- **CSS**: Inline critical CSS; defer non-critical; purge unused Tailwind classes
- **JS**: Alpine.js (~15KB gzip) only for progressive enhancements (mobile nav, filters)
- **Images**: Lazy load below fold; use `loading="lazy"`; size hints via `width`/`height`
- **Fonts**: Preload primary font; subset to Latin; use `font-display: swap`
- **HTML**: Minify output; use Hugo's `minify` config

**Rationale**:
- Meets performance budget with margin for future features
- Progressive enhancement ensures core content loads fast

**Measurement**:
- Lighthouse CI in GitHub Actions on example pages
- Test on throttled 3G network profile

**References**:
- Web Vitals: <https://web.dev/vitals/>
- Hugo Minify: <https://gohugo.io/getting-started/configuration/#configure-minify>

---

### 6. Accessibility Implementation

**Task**: Ensure WCAG 2.1 AA compliance for default components.

**Decision**: Accessibility checklist:
- Semantic HTML5 elements (`<nav>`, `<article>`, `<aside>`)
- ARIA labels for interactive elements (mobile menu toggle, filters)
- Color contrast ≥4.5:1 for body text, ≥3:1 for large text
- Keyboard navigation: all interactive elements focusable and operable
- Focus indicators visible (outline or custom ring)
- Alt text for images (required in CMS config)
- Skip links for screen readers

**Validation**:
- axe-core automated testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA/VoiceOver) on example pages

**References**:
- WCAG 2.1 Quick Reference: <https://www.w3.org/WAI/WCAG21/quickref/>
- daisyUI Accessibility: <https://daisyui.com/docs/accessibility/>

---

### 7. Social Metadata Strategy

**Task**: Define Open Graph, Twitter Card, and canonical URL patterns.

**Decision**: Use Hugo partial for meta tags:
- Template: `layouts/partials/head/social-meta.html`
- Default values from site config (`config/hugo.toml`)
- Per-page overrides via front matter (`socialImage`, `description`)
- Auto-generate titles: `{{ .Title }} | {{ site.Title }}`
- Canonical URL: `{{ .Permalink }}`
- Social image fallback: club logo resized to 1200x630px

**Front matter schema**:

```yaml
title: "U13 Boys Team"
description: "Training times, fixtures, and results for our U13 boys football team"
socialImage: "team-photo.jpg"  # relative to page bundle
```

**Rationale**:
- Improves link previews on social platforms
- Centralizes metadata logic in one partial
- Defaults reduce editor burden

**References**:
- Open Graph Protocol: <https://ogp.me/>
- Twitter Cards: <https://developer.twitter.com/en/docs/twitter-for-websites/cards/>

---

### 8. Multi-Language Preparation

**Task**: Document path from single-language to multilingual.

**Decision**: Single language at launch with migration path:
- Use `i18n/en.toml` for UI strings (nav labels, button text)
- Content in `content/` (default language)
- Migration: Add languages to config; create `content/de/`, `content/fr/`; translate i18n files

**Rationale**:
- Simplifies initial delivery
- Hugo's i18n support ready when needed
- Content duplication clear for editors

**References**:
- Hugo Multilingual: <https://gohugo.io/content-management/multilingual/>

---

## Summary of Decisions

| Area | Decision | Justification |
|------|----------|---------------|
| Content structure | Sections + taxonomies + page bundles | Natural mapping to sports club hierarchy |
| Styling | daisyUI 4.x + Tailwind CSS 3.x | Accessible components + customizable |
| CMS | Sveltia CMS (Decap CMS config compat) | Modern Git-based editing with good UX |
| Images | Hugo image processing with page resources | Zero-backend, responsive, optimized |
| Performance | Critical CSS inline, Alpine.js minimal, lazy images | Meets LCP/CLS/JS budgets |
| Accessibility | Semantic HTML, ARIA, contrast, keyboard nav | WCAG 2.1 AA compliance |
| Social meta | Partial with defaults + front matter overrides | Improved link previews |
| i18n | Single language + migration path via Hugo i18n | Simplified launch, ready to expand |

All NEEDS CLARIFICATION items from Technical Context resolved.
