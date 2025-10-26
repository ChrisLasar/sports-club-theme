---
description: "Task list for Sports Club Static Site Template implementation"
---

# Tasks: Sports Club Static Site Template

**Input**: Design documents from `/specs/001-sports-club-ssg/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No explicit tests requested in feature specification. Implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Hugo project structure with:

- `archetypes/` - Content type templates
- `assets/` - CSS, JS, and other resources requiring processing
- `content/` - Markdown content files
- `data/` - YAML data files
- `layouts/` - HTML templates
- `static/` - Static files (admin, images)
- `config/_default/` - Hugo configuration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Hugo structure

- [X] T001 Initialize Hugo Extended 0.152+ site structure with required directories (archetypes/, assets/, content/, data/, layouts/, static/, config/_default/)
- [X] T002 Create config/_default/hugo.toml with base configuration, taxonomies (team, tag, category), and performance settings
- [X] T003 Initialize Node.js project with package.json and install Tailwind CSS 4.x, daisyUI 5.x, PostCSS, and autoprefixer
- [X] T004 Create tailwind.config.js with daisyUI plugin, content paths, and custom theme configuration
- [X] T005 Create postcss.config.js for Tailwind CSS processing
- [X] T006 [P] Create assets/css/main.css entry point with Tailwind directives
- [X] T007 [P] Create .gitignore with Hugo, Node.js, and editor-specific exclusions
- [X] T008 [P] Create README.md with project overview, prerequisites, and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Create data/club.yaml with club metadata schema (name, logo, description, contact, socialChannels)
- [X] T010 Create data/venues.yaml with venue definitions schema (name, address, mapLink, facilities)
- [X] T011 Create layouts/_default/baseof.html with semantic HTML5 structure, head, header, main, and footer blocks
- [X] T012 [P] Create layouts/partials/head.html with meta tags, CSS imports, and Hugo Pipes CSS processing
- [X] T013 [P] Create layouts/partials/head/social-meta.html with Open Graph, Twitter Card, and canonical URL logic
- [X] T014 [P] Create layouts/partials/header.html with accessible site navigation and mobile-first layout
- [X] T015 [P] Create layouts/partials/footer.html with club info and social links
- [X] T016 [P] Create layouts/index.html homepage template with hero section and recent content listings
- [X] T017 Configure Hugo image processing settings in config/_default/hugo.toml for responsive images and WebP/AVIF generation
- [X] T018 Create layouts/partials/responsive-image.html partial for image processing with srcset and lazy loading
- [X] T019 [P] Add Alpine.js 3.x CDN script to baseof.html for optional progressive enhancements
- [X] T020 [P] Create layouts/partials/accessibility-skip-links.html for screen reader navigation

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Find training times and contact (Priority: P1) 🎯 MVP

**Goal**: Enable prospective members to find training times, venue, and contact person for a team

**Independent Test**: Visiting users can locate a team page and see current training schedule, venue address/map, and a contact within 30 seconds from the homepage

### Implementation for User Story 1

- [X] T021 [P] [US1] Create archetypes/teams/index.md archetype per contracts/archetype-team.md with all required front matter fields
- [X] T022 [P] [US1] Create archetypes/members.md archetype per contracts/archetype-member.md with privacy defaults
- [X] T023 [P] [US1] Add example content/teams/u13-boys/index.md with complete team data (training, coaches, season)
- [X] T024 [P] [US1] Add example content/teams/u15-girls/index.md with different sport/schedule
- [X] T025 [P] [US1] Add example content/members/john-smith.md coach profile with role and teams
- [X] T026 [P] [US1] Add example content/members/sarah-jones.md coach profile with different role
- [X] T027 [US1] Create layouts/teams/single.html template with training schedule table, venue info, coaches list, and contact section
- [X] T028 [US1] Create layouts/teams/list.html template with team cards grouped by sport
- [X] T029 [US1] Create layouts/members/single.html template with privacy-aware portrait display and role information
- [X] T030 [US1] Create layouts/members/list.html template with filterable member roster
- [X] T031 [P] [US1] Create layouts/partials/team-card.html component with team name, group, sport, and quick info
- [X] T032 [P] [US1] Create layouts/partials/member-card.html component with portrait consent checking
- [X] T033 [P] [US1] Create layouts/partials/training-schedule.html component with training times table and venue details
- [X] T034 [US1] Style team and member layouts with daisyUI components and Tailwind utilities for mobile-first responsive design
- [X] T035 [US1] Add venue data to data/venues.yaml for example teams (main-field, tennis-court)
- [X] T036 [US1] Implement off-season messaging logic in layouts/teams/single.html based on season.status
- [X] T037 [US1] Add social metadata support to team and member templates using social-meta.html partial
- [X] T038 [US1] Update homepage layouts/index.html to prominently link to teams listing

**Checkpoint**: User Story 1 complete - users can find training times and contacts for teams

---

## Phase 4: User Story 2 - Check fixtures, events, and results (Priority: P2)

**Goal**: Enable members and fans to view upcoming fixtures/events and past results with filtering

**Independent Test**: Users can view an events listing and a results archive filtered by team, with each item linking to a detail page

### Implementation for User Story 2

- [ ] T039 [P] [US2] Create archetypes/events.md archetype per contracts/archetype-event.md with event schema
- [ ] T040 [P] [US2] Create archetypes/results.md archetype per contracts/archetype-result.md with result schema
- [ ] T041 [P] [US2] Add example content/events/u13-boys-vs-rival-2025-11-15.md upcoming fixture
- [ ] T042 [P] [US2] Add example content/events/u15-tournament-2025-12-01.md tournament event
- [ ] T043 [P] [US2] Add example content/events/u13-training-camp-2025-10-20.md past event
- [ ] T044 [P] [US2] Add example content/results/u13-boys-win-3-1.md linked to completed event
- [ ] T045 [P] [US2] Add example content/results/u15-tournament-2nd-place.md tournament result
- [ ] T046 [US2] Create layouts/events/single.html template with event details, date/time, location, registration info, and status
- [ ] T047 [US2] Create layouts/events/list.html template with filterable card list (upcoming/past, by team)
- [ ] T048 [US2] Create layouts/results/single.html template with score/placement, highlights, and media gallery
- [ ] T049 [US2] Create layouts/results/list.html template with filterable archive by team and date
- [ ] T050 [P] [US2] Create layouts/partials/event-card.html component with date, opponent, location, team badge, and status indicator
- [ ] T051 [P] [US2] Create layouts/partials/result-card.html component with score display and outcome
- [ ] T052 [US2] Add Alpine.js-based filter controls to layouts/events/list.html for team and date filtering with graceful degradation
- [ ] T053 [US2] Add Alpine.js-based filter controls to layouts/results/list.html for team filtering with graceful degradation
- [ ] T054 [US2] Style event and result layouts with daisyUI card components and status badges
- [ ] T055 [US2] Add empty state messaging to event and result list templates when no items match filters
- [ ] T056 [US2] Update layouts/teams/single.html to auto-list related events and results using team taxonomy
- [ ] T057 [US2] Add social metadata with event posters and result highlights to event and result templates
- [ ] T058 [US2] Update homepage layouts/index.html to show upcoming events and recent results sections

**Checkpoint**: User Story 2 complete - users can view and filter events and results independently

---

## Phase 5: User Story 3 - Publish a news post without technical skills (Priority: P3)

**Goal**: Enable non-technical club editors to publish news posts with images and team associations

**Independent Test**: An editor can draft, preview, and publish a post with title, summary, body, images, tags, and team associations without using command line or code

### Implementation for User Story 3

- [ ] T059 [P] [US3] Create archetypes/posts.md archetype per contracts/archetype-post.md with post schema
- [ ] T060 [P] [US3] Add example content/posts/2025-10-20-season-kickoff.md with team tags and social image
- [ ] T061 [P] [US3] Add example content/posts/2025-10-25-u13-tournament-preview.md with multiple team associations
- [ ] T062 [P] [US3] Add example content/posts/2025-11-01-training-update.md with discuss link example
- [ ] T063 [US3] Create layouts/posts/single.html template with featured image, author, date, body, and optional discuss link
- [ ] T064 [US3] Create layouts/posts/list.html template with paginated post cards
- [ ] T065 [P] [US3] Create layouts/partials/post-card.html component with summary, image, date, and team tags
- [ ] T066 [US3] Style post layouts with daisyUI prose components and article formatting
- [ ] T067 [US3] Add conditional discuss link display in layouts/posts/single.html (only if discussLink set)
- [ ] T068 [US3] Update layouts/teams/single.html to show team-tagged posts automatically using team taxonomy
- [ ] T069 [US3] Add social metadata with featured images to post template
- [ ] T070 [US3] Update homepage layouts/index.html to display recent posts feed
- [ ] T071 [US3] Create static/admin/index.html Sveltia CMS entry point HTML file
- [ ] T072 [US3] Create static/admin/config.yml Sveltia CMS configuration per contracts/sveltia-cms-config.md
- [ ] T073 [US3] Configure Git backend in static/admin/config.yml for GitHub/GitLab integration
- [ ] T074 [US3] Test content creation workflow through Sveltia CMS for posts, teams, members, events, and results
- [ ] T075 [US3] Document CMS access and usage in specs/001-sports-club-ssg/quickstart.md editor section

**Checkpoint**: User Story 3 complete - editors can manage all content through Sveltia CMS without technical knowledge

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T076 [P] Apply daisyUI theme customization in tailwind.config.js with club branding colors
- [ ] T077 [P] Optimize Tailwind CSS purge configuration to remove unused styles for production builds
- [ ] T078 [P] Add font preloading and font-display: swap to layouts/partials/head.html
- [ ] T079 [P] Ensure all images have width/height attributes for CLS optimization
- [ ] T080 [P] Add loading="lazy" to below-fold images in all templates
- [ ] T081 Configure Hugo minify settings in config/_default/hugo.toml for HTML, CSS, and JS
- [ ] T082 [P] Verify keyboard navigation works across all interactive elements (nav, filters, links)
- [ ] T083 [P] Verify color contrast meets WCAG 2.1 AA (≥4.5:1 for body text) across all components
- [ ] T084 [P] Add ARIA labels to interactive elements (mobile menu toggle, filter controls)
- [ ] T085 [P] Test all layouts with JavaScript disabled to ensure core functionality
- [ ] T086 [P] Validate responsive breakpoints on mobile (≤320px) and desktop (≥1440px) screens
- [ ] T087 Create example media/images for teams, events, results, and posts in appropriate directories
- [ ] T088 [P] Update specs/001-sports-club-ssg/quickstart.md with deployment instructions (Netlify, Vercel, GitHub Pages)
- [ ] T089 [P] Add build and development scripts to package.json (dev, build, clean)
- [ ] T090 [P] Create .nvmrc or document Node.js version requirement
- [ ] T091 Verify performance metrics: LCP ≤ 2.5s on 3G, CLS ≤ 0.1, total JS ≤ 50KB gzip
- [ ] T092 [P] Validate social share previews (title, description, image) for homepage, team page, and post
- [ ] T093 [P] Add content security policy meta tags to layouts/partials/head.html
- [ ] T094 [P] Create CONTRIBUTING.md with editor guidelines and content standards
- [ ] T095 Perform final accessibility audit on all example pages (homepage, teams, members, events, results, posts)
- [ ] T096 [P] Validate HTML output with W3C validator
- [ ] T097 Test complete quickstart workflow from fresh clone following specs/001-sports-club-ssg/quickstart.md
- [ ] T098 [P] Add example robots.txt and sitemap.xml configuration to config/_default/hugo.toml
- [ ] T099 [P] Document privacy policy considerations for member data in specs/001-sports-club-ssg/quickstart.md
- [ ] T100 Final review: verify all FR-001 through FR-013 requirements from spec.md are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Can proceed independently
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) - Integrates with US1/US2 but independently testable
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Teams and Members - Foundation for club presence
  - Required for: Homepage team listings
  - Blocks: Team-based filtering in US2, team tagging in US3
  
- **User Story 2 (P2)**: Events and Results - Built on team taxonomy from US1
  - Required for: Event/result listings on team pages
  - Can start: After US1 team content structure exists
  - Independent: Has own layouts and can be tested separately
  
- **User Story 3 (P3)**: News Posts and CMS - Integrates with teams from US1
  - Required for: Complete editorial workflow
  - Can start: After US1 team content exists for tagging
  - Independent: CMS configuration works for all content types

### Within Each User Story

**User Story 1 (Teams & Members)**:

1. Archetypes first (T021-T022) - can run in parallel
2. Example content next (T023-T026) - can run in parallel
3. Layouts (T027-T030) - single before list, members after teams
4. Partials (T031-T033) - can run in parallel
5. Styling and enhancements (T034-T038) - sequential on layouts

**User Story 2 (Events & Results)**:

1. Archetypes first (T039-T040) - can run in parallel
2. Example content next (T041-T045) - can run in parallel
3. Layouts (T046-T049) - single before list
4. Partials (T050-T051) - can run in parallel
5. Filters, styling, integration (T052-T058)

**User Story 3 (Posts & CMS)**:

1. Archetype and examples (T059-T062) - can run in parallel
2. Layouts and partials (T063-T065) - can run in parallel
3. Styling and integration (T066-T070)
4. CMS setup (T071-T073) - sequential
5. Testing and documentation (T074-T075)

### Parallel Opportunities

- **Phase 1 (Setup)**: T006-T008 can run in parallel
- **Phase 2 (Foundational)**: T012-T015, T018-T020 can run in parallel after base templates
- **Phase 3 (US1)**: T021-T026, T031-T033 can run in parallel
- **Phase 4 (US2)**: T039-T045, T050-T051 can run in parallel
- **Phase 5 (US3)**: T059-T062, T063-T065 can run in parallel
- **Phase 6 (Polish)**: T076-T080, T082-T086, T088-T090, T092-T094, T096-T099 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all archetypes together:
Task T021: "Create archetypes/teams/index.md archetype"
Task T022: "Create archetypes/members.md archetype"

# Launch all example content together:
Task T023: "Add example content/teams/u13-boys/index.md"
Task T024: "Add example content/teams/u15-girls/index.md"
Task T025: "Add example content/members/john-smith.md"
Task T026: "Add example content/members/sarah-jones.md"

# Launch all partials together:
Task T031: "Create layouts/partials/team-card.html"
Task T032: "Create layouts/partials/member-card.html"
Task T033: "Create layouts/partials/training-schedule.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. **Complete Phase 1: Setup** (T001-T008)
   - Hugo project initialization
   - Tailwind/daisyUI setup
   - Basic project structure

2. **Complete Phase 2: Foundational** (T009-T020) ⚠️ CRITICAL
   - Base layouts and partials
   - Social metadata
   - Image processing
   - Accessibility foundation

3. **Complete Phase 3: User Story 1** (T021-T038)
   - Teams and Members content types
   - Training schedule display
   - Contact information
   
4. **STOP and VALIDATE**:
   - Test team page accessibility
   - Verify training times are visible
   - Check contact information display
   - Test on mobile and desktop
   - Validate 30-second findability goal

5. **Deploy/Demo MVP**: Working sports club site with team information

### Incremental Delivery

1. **Foundation** (Phase 1 + 2) → Hugo site with base templates
2. **+ User Story 1** (Phase 3) → Teams and training schedules visible → **Deploy MVP**
3. **+ User Story 2** (Phase 4) → Events and results tracking → **Deploy v1.1**
4. **+ User Story 3** (Phase 5) → Full CMS editorial workflow → **Deploy v1.2**
5. **+ Polish** (Phase 6) → Optimized, accessible, production-ready → **Deploy v2.0**

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phases 1-2)
   
2. **Once Foundational is done, split work:**
   - **Developer A**: User Story 1 (Teams/Members) - T021-T038
   - **Developer B**: User Story 2 (Events/Results) - T039-T058 (starts after T021-T026 for team taxonomy)
   - **Developer C**: User Story 3 (Posts/CMS) - T059-T075 (starts after T021-T026 for team tagging)

3. **Stories integrate and test independently**

4. **Team completes Polish together** (Phase 6)

---

## Success Criteria Validation

### SC-001: Performance Metrics

- **Validate at**: T091
- **Tools**: Lighthouse CI, WebPageTest
- **Targets**: LCP ≤ 2.5s (3G), CLS ≤ 0.1, JS ≤ 50KB gzip

### SC-002: Accessibility

- **Validate at**: T095
- **Tools**: axe-core, WAVE, keyboard testing
- **Target**: WCAG 2.1 AA, 0 critical issues, ≤3 minor issues

### SC-003: Editor Experience

- **Validate at**: T074-T075
- **Test**: New editor publishes post in ≤10 minutes
- **Tool**: Sveltia CMS workflow test

### SC-004: Findability

- **Validate at**: T038 (end of US1)
- **Test**: User finds training time in ≤30 seconds from homepage
- **Method**: Usability testing

### SC-005: Social Sharing

- **Validate at**: T092
- **Test**: Preview with social media debuggers
- **Pages**: Homepage, one team page, one post

---

## Notes

- All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- [P] indicates parallelizable tasks (different files, no blocking dependencies)
- [Story] labels (US1, US2, US3) map to user stories from spec.md
- Each user story phase is independently completable and testable
- No tests included as none were explicitly requested in specification
- Commit after each task or logical group of related tasks
- Stop at checkpoints to validate story completion before proceeding
- Total: 100 tasks across 6 phases supporting 3 user stories
