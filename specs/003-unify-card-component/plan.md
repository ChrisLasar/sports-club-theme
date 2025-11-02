# Implementation Plan: Unified Card System

**Branch**: `001-unify-card-component` | **Date**: 2025-11-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-unify-card-component/spec.md`

## Summary

Unify all archetype card layouts (events, posts, results, teams, members) behind a single reusable Hugo partial (`layouts/_partials/card.html`) using daisyUI card components. This eliminates duplicate card markup across templates and establishes a single source of truth for card styling and structure. Changes to the card design will propagate automatically to all usages. The approach uses Hugo's `partial` function with standardized card data model, archetype-specific mappers, and daisyUI CSS classes (no JavaScript required).

## Technical Context

**Language/Version**: Hugo 0.152+ (Extended edition)  
**Primary Dependencies**: 
- daisyUI 5.x (card components, utilities)
- Tailwind CSS 4.x (CSS framework, required by daisyUI)
- Alpine.js 3.x (optional; not needed for cards)
- Sveltia CMS (Git-based CMS; uses Decap CMS documentation)

**Storage**: Files only (Markdown + YAML/TOML front matter); page bundles supported for colocated media  
**Testing**: 
- HTML validation
- Accessibility linting (WCAG 2.1 AA)
- Lighthouse (performance, accessibility)
- Manual QA (keyboard navigation, screen reader)

**Target Platform**: Static web hosting, CDN  
**Project Type**: Static site generator (Hugo)  
**Constraints**: 
- Fully static output; no runtime server or database
- No login/auth requirements
- Performance: LCP ≤ 2.5s (3G emulation), CLS ≤ 0.1, JS ≤ 50KB gzip
- Mobile-first responsive design
- Privacy by default (no tracking)
- Accessibility: WCAG 2.1 AA

**Card Implementation Approach**:
- Single reusable partial: `layouts/_partials/card.html`
- Archetype mappers: `layouts/_partials/mappers/{type}-to-card.html` (event, post, result, team, member)
- daisyUI components: `card`, `card-body`, `card-title`, `card-actions`
- Variants: Default (base `card`) and Compact (`card-sm`)
- No custom CSS; Tailwind + daisyUI utilities only  

## Constitution Check

*STATUS: PASS - No violations. Feature aligns with all Constitution gates.*

### Pre-Phase 0 Check (Initial)

- ✅ **Gate A**: No login/auth dependencies introduced. Card system is purely presentational.
- ✅ **Gate B**: Build is fully static. Cards render at build time via Hugo partials; no runtime calls.
- ✅ **Gate C**: Accessibility (AA) for default components. daisyUI cards use semantic HTML; partials enforce alt text and keyboard navigation.
- ✅ **Gate D**: Performance budgets will be validated on example pages. CSS-only cards (no JS) prevent performance degradation.
- ✅ **Gate E**: Content remains human-readable. Front matter schemas documented in data-model.md; no proprietary formats.
- ✅ **Gate F**: Mobile responsiveness validated. daisyUI cards are mobile-first; Tailwind responsive utilities applied.
- ✅ **Gate G**: Social metadata not affected. Card system is for internal list/grid rendering; does not alter OG/Twitter card metadata.
- ✅ **Gate H**: Example content and docs exist. Quickstart.md created; will add example card usages in content/.

### Post-Phase 1 Check (After Design)

- ✅ **Gate A**: Confirmed. No auth logic in card partial or mappers.
- ✅ **Gate B**: Confirmed. Data model and contracts specify static rendering only.
- ✅ **Gate C**: Confirmed. Card partial contract requires semantic HTML (`<article>`, `<h2>`, `<a>`) and alt text.
- ✅ **Gate D**: Pending validation. Will measure LCP/CLS on list pages post-implementation.
- ✅ **Gate E**: Confirmed. Data model documents all card fields; mappers transform Hugo front matter (YAML/TOML).
- ✅ **Gate F**: Confirmed. Responsive grid layouts in quickstart examples (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- ✅ **Gate G**: Not applicable. Card system does not modify page-level metadata.
- ✅ **Gate H**: Confirmed. Quickstart.md completed; example content will be added during implementation.

**Conclusion**: No Constitution violations. Feature ready for implementation.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
archetypes/
assets/
content/
data/
i18n/
layouts/
static/
config/
config/_default/hugo.toml (or .yaml/.json)
```

Notes:

- Prefer a single config file where possible.
- Support colocated page bundles/resources under `content/`.
- Keep JS optional; if needed, prefer Alpine.js for enhancements.

**Structure Decision**:
Default Hugo directory structure:

- archetypes: The archetypes directory contains templates for new content.
- assets: The assets directory contains global resources typically passed through an asset pipeline. This includes resources such as images, CSS, Sass, JavaScript, and TypeScript.
- config: The config directory contains your site configuration, possibly split into multiple subdirectories and files. For projects with minimal configuration or projects that do not need to behave differently in different environments, a single configuration file named hugo.toml in the root of the project is sufficient.
- content: The content directory contains the markup files (typically Markdown) and page resources that comprise the content of your site.
- data: The data directory contains data files (JSON, TOML, YAML, or XML) that augment content, configuration, localization, and navigation.
- i18n: The i18n directory contains translation tables for multilingual sites.
- layouts: The layouts directory contains templates to transform content, data, and resources into a complete website.
- public: The public directory contains the published website, generated when you run the hugo or hugo server commands. Hugo recreates this directory and its content as needed.
- resources: The resources directory contains cached output from Hugo’s asset pipelines, generated when you run the hugo or hugo server commands. By default this cache directory includes CSS and images. Hugo recreates this directory and its content as needed.
- static: The static directory contains files that will be copied to the public directory when you build your site. For example: favicon.ico, robots.txt, and files that verify site ownership. Before the introduction of page bundles and asset pipelines, the static directory was also used for images, CSS, and JavaScript.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
