# Feature Specification: Multilingual UI Terminology

**Feature Branch**: `005-i18n-terms`  
**Created**: 2025-11-05  
**Status**: Draft  
**Input**: User description: "The template should be multilingual. Accordingly, hard-coded terms such as “Home,” “Teams,” etc. must also be able to be displayed in the respective national language. Initially, the system should support the languages “German,” “English,” and “French.” Later, users should also be able to replace individual terms with their own terms. For example, the categories “Teams” with “Group” or ‘News’ with “Blog.” The latter can initially also be done in the configuration file. (See `attachments` above for file contents. You may not need to search or read the file again.)"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View site labels in selected language (Priority: P1)

A site visitor views the public site and sees all interface labels (e.g., Home, Teams, Members, Results, Events, News) in the selected language.

**Why this priority**: Core user-facing value; ensures the site is understandable to visitors in supported languages.

**Independent Test**: Build or configure the site to German, English, and French separately; verify UI labels render in the selected language without modifying content files.

**Acceptance Scenarios**:

1. **Given** the site language is set to German, **When** a visitor opens the homepage, **Then** all hard-coded UI terms appear in German.
2. **Given** the site language is set to French, **When** a visitor navigates to Teams and News pages, **Then** the navigation and section headings use French terms consistently.

---

### User Story 2 - Maintain terminology via configuration (Priority: P2)

A site maintainer updates the site configuration to replace specific UI terms with custom terms per language (e.g., replace “News” with “Blog” in English only).

**Why this priority**: Empowers non-developers to tailor terminology to their audience without code changes.

**Independent Test**: Update configuration to change English “News” → “Blog”, rebuild, and confirm the change appears across the interface in English but not in German/French.

**Acceptance Scenarios**:

1. **Given** a configuration mapping that sets English “News” → “Blog”, **When** the English site is built, **Then** all occurrences of the UI term display as “Blog” and metadata or breadcrumbs use “Blog” consistently.
2. **Given** the same configuration, **When** the German site is built, **Then** “News” remains the German default equivalent (unchanged) and does not show “Blog”.

---

### User Story 3 - Safe fallbacks for missing terms (Priority: P3)

If a custom term or translation is missing, the site falls back to a sensible default for that language without showing broken keys.

**Why this priority**: Prevents broken UX when translations or overrides are incomplete.

**Independent Test**: Remove a French override for “Teams,” rebuild, and verify the default French label appears; remove a default term and verify the default site language is used as fallback.

**Acceptance Scenarios**:

1. **Given** a missing override in French for a supported term, **When** the site is built, **Then** the French default for that term is displayed.
2. **Given** a missing language entry for a term entirely, **When** the site is built, **Then** the default site language term is displayed.

---

Additional stories may be added later (e.g., end-user language picker) if brought into scope.

### Edge Cases

- Missing override for a specific term in a language → use that language’s default; if absent, use default site language.
- Unsupported locale requested → use default site language.
- Partial terminology maps (only some terms overridden) → unchanged terms use defaults without mixing languages.
- Case sensitivity and capitalization (e.g., title case in navigation vs. sentence case in breadcrumb) → follow the original template’s casing rules, apply to translated/overridden strings.
- Pluralization nuances (e.g., “Team” vs. “Teams”) → site owners provide the exact desired form per place; no automatic pluralization in MVP.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support multilingual rendering of all hard-coded UI terms (e.g., main navigation, section headings, breadcrumbs) for the public site.
- **FR-002**: The system MUST support initially three languages: English, German, and French for all targeted UI terms.
- **FR-003**: Site maintainers MUST be able to override individual UI terms with custom wording per language via site configuration (no code change required).
- **FR-004**: Overrides MUST apply consistently across the interface wherever that term appears (navigation, headings, lists, index pages).
- **FR-005**: When a translation/override is missing, the system MUST fall back to the default term for that language; if the language default is missing, fall back to the site’s default language.
- **FR-006**: The feature MUST operate without requiring client-side JavaScript (progressive enhancement is allowed but not required).
- **FR-007**: Provide a minimal demonstration showing: (a) default labels in each language, and (b) at least two custom term overrides (e.g., “News” → “Blog”, “Teams” → “Group”) and their effect after rebuild.
- **FR-008**: Documentation MUST describe how to (a) set the site language, (b) add or edit term overrides per language, and (c) add new languages in the future.
- **FR-009**: All rendered labels MUST remain accessible and meaningful (e.g., consistent use in landmarks, aria-labels, and page titles) in the chosen language.
- **FR-010**: The feature MUST NOT require translating content bodies; scope is only UI terminology/labels.
- **FR-011**: The feature MUST NOT degrade performance; building in different languages should keep total JS weight unchanged.

Clarified scope items:

- **FR-012**: No public language switcher in MVP. Language is selected via site configuration per build; runtime switching is out of scope for this feature.
- **FR-013**: Terminology coverage in MVP includes navigation, section headings, breadcrumbs, footer link groups, and page titles.

### Key Entities *(include if feature involves data)*

- **Language**: A supported locale (English, German, French initially); identified by a human-readable name and a code; has a set of default terms.
- **Term**: A semantic UI label key (e.g., home, teams, members, results, events, news) with language-specific default values and optional custom overrides.
- **Terminology Map**: A collection of Terms per Language representing both defaults and any user-provided overrides that determine what is rendered.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: For each of English, German, and French builds, 100% of targeted UI terms render in the correct language on the example pages (home, teams list, news/posts list).
- **SC-002**: Two example overrides (“News” → “Blog”, “Teams” → “Group”) apply consistently across all affected UI locations in the respective language without mismatches.
- **SC-003**: When any single translation/override is removed, the site renders the corresponding default term without broken keys on all example pages.
- **SC-004**: The feature introduces no increase in total client-side JavaScript size versus baseline (±0KB change on example pages).
- **SC-005**: Example pages with translated labels pass an accessibility review for understandable navigation and landmarks (WCAG 2.1 AA alignment).

### Acceptance Criteria

- **AC-FR-001**: For each supported language, the homepage, teams list, and news/posts list render navigation, main section headings, and breadcrumbs using that language’s default terms.
- **AC-FR-002**: The three languages (English, German, French) are available with complete default terms for the targeted UI labels.
- **AC-FR-003**: Site maintainers can change at least two terms per language (e.g., “News” → “Blog”, “Teams” → “Group”) solely via configuration; no template edits required.
- **AC-FR-004**: When an override is applied, all instances of that term update consistently across navigation, headings, breadcrumbs, footer link groups, and page titles for that language.
- **AC-FR-005**: If a language-specific override is missing, the default term for that language is used; if the language default is missing, the default site language term is used; no raw keys are shown.
- **AC-FR-006**: All functionality works with client-side JavaScript disabled.
- **AC-FR-007**: The example demonstrates both defaults and overrides and includes brief instructions to reproduce.
- **AC-FR-008**: Documentation includes steps to (a) set site language, (b) set per-language overrides, and (c) add a new language by defining its terminology map.
- **AC-FR-009**: Translated/overridden labels are reflected in accessible names (e.g., navigation landmarks or aria-labels where applicable) in the selected language.
- **AC-FR-010**: Content body text remains unchanged; only UI terminology is affected.
- **AC-FR-011**: Comparing baseline vs. with-feature example pages shows no increase in total client-side JavaScript size.

---

## Constitution Alignment Checklist

> Verify the feature complies with the Constitution quality gates.

- No login/auth or server/database introduced by this feature.
- Output remains fully static; enhancements degrade gracefully without JS.
- Content stays human-readable; terminology configuration documented.
- Mobile responsiveness and accessibility validated on example pages.
- Social metadata and headings use appropriate translated labels where applicable.

## Assumptions

- The scope covers UI terminology/labels only; translating content bodies is out of scope for this feature.
- Site language is selected via site configuration for the build; a public language switcher is out of scope for MVP and may be considered later.
- Overrides are provided per language; if an override is absent, defaults apply as described.
- No automatic pluralization or grammatical inflection in MVP; site owners provide desired strings.

## Dependencies

- A site-wide configuration mechanism exists to declare the default language and provide per-language term overrides.
- Build tooling can generate localized variants or a localized build as configured; no runtime services are required.

## Open Questions

None.
