# Implementation Plan: Sports Club Static Site Template

**Branch**: `001-sports-club-ssg` | **Date**: 2025-10-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sports-club-ssg/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. If a commands doc is missing, describe the execution workflow directly here.

## Summary

Create a Hugo-based static site template for sports clubs that enables non-technical editors to manage teams, training schedules, events, results, news posts, and member rosters via Sveltia CMS. The template uses daisyUI and Tailwind CSS for styling, supports privacy-first member profiles with consent-based portraits, and provides accessible, mobile-first layouts with social metadata for all content types. All content is stored as Markdown files with front matter, ensuring portability and zero backend dependencies.

## Technical Context

**Language/Version**: Hugo 0.122+ (Extended edition for Tailwind processing)  
**Primary Dependencies**: daisyUI 4.x, Tailwind CSS 3.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS (Git-based CMS; Decap CMS documentation as reference)  
**Storage**: Files only (Markdown + YAML/TOML front matter); page bundles supported for colocated media  
**Testing**: HTML validation, Accessibility lint (axe-core or similar), Lighthouse CI  
**Target Platform**: Static web hosting (Netlify, Vercel, GitHub Pages, CDN)  
**Project Type**: Static site generator (Hugo) with web-based CMS interface  
**Performance Goals**: LCP ≤ 2.5s on 3G emulation, CLS ≤ 0.1, total JS ≤ 50KB gzip  
**Constraints**: Fully static output; no login/auth; mobile-first; privacy by default; WCAG 2.1 AA  
**Scale/Scope**: ~10-50 teams per club; ~100-500 members; ~50-200 events/year; ~100-500 posts/year  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on constitution.md quality gates:

- ✅ **Gate A**: No login/auth dependencies introduced—fully static site with Git-based CMS.
- ✅ **Gate B**: Build is fully static; no runtime calls required for core pages—Hugo generates HTML at build time.
- ✅ **Gate C**: Accessibility (AA) for default components—daisyUI base + custom accessible components; lint validation required.
- ✅ **Gate D**: Performance budgets met on example pages—Tailwind purge, minimal Alpine.js, optimized images.
- ✅ **Gate E**: Human-readable content; schemas documented—Markdown + YAML front matter; archetypes and CMS config documented.
- ✅ **Gate F**: Mobile responsiveness validated—Tailwind mobile-first utilities; responsive breakpoints tested.
- ✅ **Gate G**: Social metadata present (OG, Twitter, canonical)—Hugo templates for social meta; per-page overrides via front matter.
- ✅ **Gate H**: Example content exists and docs updated in parallel—Quickstart, sample content, and archetypes included.

**Status**: All gates pass. No constitution violations.

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
