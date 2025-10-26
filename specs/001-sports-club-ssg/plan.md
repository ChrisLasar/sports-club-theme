# Implementation Plan: Sports Club Static Site Template

**Branch**: `001-sports-club-ssg` | **Date**: 2025-10-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sports-club-ssg/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. If a commands doc is missing, describe the execution workflow directly here.

## Summary

Create a Hugo-based static site template for sports clubs that enables non-technical editors to manage teams, training schedules, events, results, news posts, and member rosters via Sveltia CMS. The template uses daisyUI and Tailwind CSS for styling, supports privacy-first member profiles with consent-based portraits, and provides accessible, mobile-first layouts with social metadata for all content types. All content is stored as Markdown files with front matter, ensuring portability and zero backend dependencies.

## Technical Context

**Language/Version**: Hugo 0.152+ (Extended edition for Tailwind processing)  
**Primary Dependencies**: daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS (Git-based CMS; Decap CMS documentation as reference)  
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

## Core Implementation

### Phase 1: Foundation Setup

**Goal**: Establish basic Hugo structure with build tooling

1. **Initialize Hugo Project** → See: [Project Structure](#project-structure)
   - Create directory structure (archetypes/, content/, layouts/, etc.)
   - Initialize `config/_default/hugo.toml` with taxonomies
   - Set up Hugo version requirements (0.152+)
   
2. **Configure Build Tooling** → See: [research.md § daisyUI + Tailwind](research.md#2-daisyui--tailwind-css-integration)
   - Install Node.js dependencies (Tailwind CSS 4.x, daisyUI 5.x, PostCSS)
   - Configure `tailwind.config.js` with daisyUI plugin
   - Set up Hugo Pipes for CSS processing
   - Create `assets/css/main.css` entry point

3. **Add Data Files** → See: [data-model.md § Club & Venue](data-model.md#1-club-site-configuration)
   - Create `data/club.yaml` with club metadata
   - Create `data/venues.yaml` with venue definitions
   - Document structure in README

### Phase 2: Content Types & Archetypes

**Goal**: Implement all content types with proper archetypes

4. **Create Content Archetypes** → See: [contracts/archetype-*.md](contracts/)
   - `archetypes/teams/index.md` → [contracts/archetype-team.md](contracts/archetype-team.md)
   - `archetypes/members.md` → [contracts/archetype-member.md](contracts/archetype-member.md)
   - `archetypes/events.md` → [contracts/archetype-event.md](contracts/archetype-event.md)
   - `archetypes/results.md` → [contracts/archetype-result.md](contracts/archetype-result.md)
   - `archetypes/posts.md` → [contracts/archetype-post.md](contracts/archetype-post.md)

5. **Create Example Content** → See: [data-model.md](data-model.md) for schemas
   - Add 2-3 example teams with full front matter
   - Add 3-5 example members (coaches, players with varied privacy settings)
   - Add 2-3 example events (upcoming, completed)
   - Add 1-2 example results
   - Add 2-3 example posts with team associations

### Phase 3: Layout Templates

**Goal**: Build Hugo templates for all content types

6. **Base Templates** → See: [research.md § Accessibility](research.md#6-accessibility-implementation)
   - `layouts/_default/baseof.html` - Base layout with semantic HTML5
   - `layouts/partials/head.html` - Meta tags, CSS links
   - `layouts/partials/head/social-meta.html` → [research.md § Social Metadata](research.md#7-social-metadata-strategy)
   - `layouts/partials/header.html` - Site header with accessible nav
   - `layouts/partials/footer.html` - Site footer

7. **Content Type Templates** → See: [data-model.md § Relationships](data-model.md#content-relationships-summary)
   - `layouts/teams/single.html` - Team detail page (training, coaches, related content)
   - `layouts/teams/list.html` - All teams listing
   - `layouts/members/single.html` - Member profile (privacy-aware)
   - `layouts/members/list.html` - Member roster
   - `layouts/events/single.html` - Event detail
   - `layouts/events/list.html` - Events listing with filters
   - `layouts/results/single.html` - Result detail
   - `layouts/results/list.html` - Results archive
   - `layouts/posts/single.html` - Post with discuss link
   - `layouts/posts/list.html` - News feed
   - `layouts/index.html` - Homepage

8. **Shared Partials** → See: [data-model.md](data-model.md) for field access
   - `layouts/partials/team-card.html` - Team preview card
   - `layouts/partials/event-card.html` - Event card with status
   - `layouts/partials/member-card.html` - Member card (portrait consent check)
   - `layouts/partials/post-card.html` - Post preview
   - `layouts/partials/training-schedule.html` - Training times table

### Phase 4: CMS Integration

**Goal**: Enable non-technical editing via Sveltia CMS

9. **Configure Sveltia CMS** → See: [contracts/sveltia-cms-config.md](contracts/sveltia-cms-config.md)
   - Create `static/admin/config.yml` from contract spec
   - Create `static/admin/index.html` (Sveltia entry point)
   - Configure Git backend (GitHub/GitLab)
   - Test content creation workflow

### Phase 5: Styling & Theming

**Goal**: Apply daisyUI theme with club customization

10. **Apply Base Styling** → See: [research.md § daisyUI](research.md#2-daisyui--tailwind-css-integration)
    - Configure daisyUI theme in `tailwind.config.js`
    - Add custom color variables for club branding
    - Style all component partials with Tailwind utilities
    - Ensure mobile-first responsive breakpoints

11. **Image Processing** → See: [research.md § Images](research.md#4-image-processing--optimization)
    - Implement responsive image partial
    - Add WebP/AVIF generation for modern browsers
    - Create social share image resize helper (1200x630px)
    - Add lazy loading for below-fold images

### Phase 6: Progressive Enhancements

**Goal**: Add optional JavaScript enhancements

12. **Alpine.js Enhancements** → See: [research.md § Performance](research.md#5-performance-optimization-strategy)
    - Mobile navigation toggle
    - Event/result filtering UI
    - Image galleries (if needed)
    - Keep total JS ≤ 50KB gzip

## Refinement

### Iteration 1: Accessibility Audit

→ See: [research.md § Accessibility](research.md#6-accessibility-implementation)

- Run axe-core on all example pages
- Test keyboard navigation (Tab, Enter, Escape)
- Test screen reader (NVDA/VoiceOver)
- Fix color contrast issues
- Add ARIA labels where needed
- Verify skip links work

### Iteration 2: Performance Optimization

→ See: [research.md § Performance](research.md#5-performance-optimization-strategy)

- Run Lighthouse on example pages
- Optimize LCP (inline critical CSS, preload fonts)
- Fix CLS issues (add image dimensions)
- Reduce unused CSS (Tailwind purge)
- Minify HTML/CSS/JS
- Validate 3G performance (LCP ≤ 2.5s)

### Iteration 3: Privacy & Data Validation

→ See: [data-model.md § Privacy Rules](data-model.md#privacy--visibility-rules)

- Verify portrait consent checks work
- Ensure generic team emails used (no personal contact)
- Test roster visibility flags
- Validate front matter schemas match archetypes
- Check social links hide when not configured

## Testing Strategy

### Unit/Component Tests

- Verify partial rendering with mock data
- Test image processing functions
- Validate schema compliance in example content

### Integration Tests

- Build site with example content (`hugo --minify`)
- Check all pages generate successfully
- Validate HTML (W3C validator)
- Test taxonomy cross-links work

### Acceptance Tests

→ Map to [spec.md User Stories](spec.md#user-scenarios--testing-mandatory)

- **SC-004**: Verify visitor finds training time in ≤30s
- **SC-005**: Check social previews render correctly
- **SC-003**: Test CMS workflow (create post in ≤10min)

### Performance Tests

→ See: [Success Criteria SC-001](spec.md#success-criteria-mandatory)

- Lighthouse CI on example pages
- 3G throttling tests
- Core Web Vitals validation

### Deployment Test

→ See: [quickstart.md § Deployment](quickstart.md#deployment)

- Test Netlify build
- Verify CMS access at `/admin/`
- Validate Git backend connection

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
