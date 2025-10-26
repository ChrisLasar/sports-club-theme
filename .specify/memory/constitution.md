<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - IV. Simplicity for Non‑Technical Users (config preference clarified)
  - V. Themeability without JavaScript Dependence (Alpine.js preference)
  - VII. Accessibility & Performance Budgets (explicit mobile support)
  - X. Documentation & Quickstart (examples per feature + parallel docs)
- Added principles:
  - XI. Social Metadata & Sharing
- Added constraints:
  - Colocated page resources supported (not only `static/`)
- Templates requiring updates:
  - ⚠ .specify/templates/spec-template.md (add mobile/social/example/docs prompts)
  - ⚠ .specify/templates/tasks-template.md (include tasks for examples, docs, social meta)
  - ⚠ .specify/templates/plan-template.md (note Alpine.js as preferred enhancement)
  - ⚠ .specify/templates/commands/* (directory missing; cannot verify)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original adoption date unknown; set when first approved by maintainers
-->

# Dojo Hugo Static Site Template Constitution

## Core Principles

### I. Content as Plain Files (Human-Readable)

All user-authored content and settings MUST be stored in human-readable text files
(Markdown + front matter in YAML/TOML/JSON). No proprietary or binary-only formats
for primary content. Rationale: maximizes portability and longevity; users can read,
edit, and export with any editor.

### II. No-Login, Offline-First Authoring

The template MUST NOT require any login, account, or network dependency to author
content. Editing works locally with a file editor; Git is optional but supported.
Rationale: non-technical users can create/update content without credentials or servers.

### III. Zero-Backend, Static by Design

The delivered site MUST be a fully static artifact (HTML/CSS/JS, images, assets) with
no required runtime server or database. Optional client-side enhancements MUST degrade
gracefully. Rationale: simpler hosting, lower cost, fewer failures.

### IV. Simplicity for Non‑Technical Users

Out-of-the-box defaults MUST work without configuration. Configuration MUST be simple;
a single config file is PREFERRED (not required). Customization MUST be possible via a
small number of well-documented settings and copy‑paste content archetypes. Rationale:
reduce cognitive load and setup friction.

### V. Themeability without JavaScript Dependence

Core UX MUST function without JavaScript. Theming uses CSS variables/tokens and
modular partials/layouts. JavaScript, if present, is progressive enhancement only.
Preference: When JavaScript is needed, Alpine.js SHOULD be used for minimal, declarative
enhancements. Rationale: accessibility, performance, and maintainability.

### VI. Portability & Interoperability

Content schemas and front matter keys MUST be documented. The template SHOULD remain
compatible with common SSG ecosystems (e.g., Hugo preferred, concepts map to Jekyll/
Eleventy). Users MUST be able to export content as-is for migration.

### VII. Accessibility & Performance Budgets

The template MUST meet WCAG 2.1 AA for default components and be mobile-first responsive
across common breakpoints. Performance budgets: LCP ≤ 2.5s on 3G emulation, CLS ≤ 0.1,
JS ≤ 50KB (gzip) by default. Rationale: inclusive, fast experiences on low-end devices.

### VIII. Privacy by Default (No Tracking)

No analytics, trackers, or third‑party pixels are enabled by default. If optional
analytics are provided, they MUST be opt-in, cookie‑free by default, and clearly
documented. Rationale: respect user privacy and simplify legal compliance.

### IX. Reproducible Builds & Versioning

Builds MUST be deterministic with pinned tool versions. Template releases follow
SemVer: MAJOR (breaking content/layout changes), MINOR (new components/sections),
PATCH (fixes/clarifications). Migration notes MUST accompany MAJOR/MINOR.

### X. Documentation & Quickstart

Provide a one-page Quickstart covering: edit a page → preview locally → publish.
Include screenshots/GIFs and a glossary for non‑technical terms. For EACH feature,
provide a minimal example (content + usage) and maintain documentation in parallel
with implementation. Rationale: empowers users to self-serve and learn by example.

### XI. Social Metadata & Sharing

Each page MUST support social sharing best practices via default and per-page
front matter: Open Graph, Twitter/X cards, canonical URLs, and share images. Defaults
MUST be sensible and overridable per page. Rationale: better previews and discoverability.

## Additional Constraints

- No authentication or user accounts may be introduced by features or examples.
- No server-side rendering at request time; all rendering occurs at build time.
- Third-party embeds (maps, video) MUST be optional and isolated, with no impact
  to core functionality when disabled.
- All user data MUST be easily copyable as plain files for use in other systems.
- Default content types and archetypes MUST include clear examples ready to duplicate.
- Media files MAY be colocated next to content pages (page bundles/resources) and
  transformed at build time; not limited to `static/` only.

## Development Workflow & Quality Gates

### Authoring Flow

- Edit content in `content/` (Markdown with front matter) and add media.
- Update settings in a config file if necessary.
- Preview locally with a single command and no credentials.

### Quality Gates (Constitution Check)

- Gate A: No login/auth dependencies introduced.
- Gate B: Build is fully static; no runtime calls required for core pages.
- Gate C: Accessibility lint passes (AA) for default components.
- Gate D: Performance budgets met on example homepage and article page.
- Gate E: Content remains in human-readable files; schemas documented.
- Gate F: Mobile responsiveness validated (viewport, breakpoints, touch targets).
- Gate G: Social metadata present for key page types (OG, Twitter, canonical).
- Gate H: For any new feature, example content exists and docs updated in parallel.

### Delivery

- Releases pin SSG version and dependencies for reproducible builds.
- Changelog and migration notes included for MINOR/MAJOR.

## Governance

- This Constitution defines non‑negotiable constraints for this template. All changes
  MUST be checked against the Quality Gates.
- Amendments: Open a PR updating this file, include a migration note (if applicable),
  and obtain maintainer approval (at least one owner). Version bump per SemVer:
  MAJOR for breaking changes to content/layout conventions; MINOR for new components
  or sections; PATCH for clarifications and non‑semantic fixes.
- Compliance Reviews: Review at each release; block merges that violate gates.
- Dates: Ratification is the first approved adoption date; Last Amended is the date
  of the most recent merged change to this Constitution.

**Version**: 1.1.0 | **Ratified**: 2025-10-25 | **Last Amended**: 2025-10-25
