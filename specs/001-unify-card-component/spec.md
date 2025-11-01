# Feature Specification: Unified Card System

**Feature Branch**: `001-unify-card-component`  
**Created**: 2025-11-01  
**Status**: Draft  
**Input**: User description: "Unify all archetype card layouts behind a single source of truth so changing the card layout in one place updates cards for events, posts, results, teams, and members consistently across the site. Reduce duplicated partials and enforce consistent usage."

## Clarifications

### Session 2025-11-01

- Q: Migration strategy for existing card partials? → A: Remove old templates immediately.

## User Scenarios & Testing (mandatory)

### User Story 1 - Update once, reflect everywhere (Priority: P1)

As a site maintainer, I want to change the card layout in one place so that the visual and structural change propagates consistently to all card usages (events, posts, results, teams, members) without editing multiple files.

**Why this priority**: This eliminates redundancy and prevents visual drift, reducing maintenance time and risk of inconsistencies.

**Independent Test**: Modify a single card definition (e.g., adjust title size or add a badge slot) and verify that the five archetype listing pages and any widgets that show cards reflect the change after a rebuild.

**Acceptance Scenarios**:

1. Given a unified card definition, When the card title style is changed once, Then cards on events, posts, results, teams, and members list pages all show the new title style.
2. Given the unified card definition, When spacing between image and text is adjusted once, Then the same spacing is applied consistently across all card instances.

---

### User Story 2 - Consistent content mapping per type (Priority: P2)

As a content editor, I want each card to surface the right key fields for its content type (e.g., event date/venue, result score, post date/excerpt) so visitors get consistent, meaningful summaries across the site.

**Why this priority**: Ensures information scent and scannability, improving user comprehension and click-through.

**Independent Test**: For each archetype, verify the presence and order of key fields on the card and that missing/optional data gracefully hides without breaking the layout.

**Acceptance Scenarios**:

1. Given a result without an image, When rendered as a card, Then the layout remains balanced and shows score and opponent without empty placeholders.
2. Given an event with a long title and a venue, When rendered as a card, Then the title truncates/wraps appropriately and the venue remains visible.

---

### User Story 3 - Reduce duplication and enforce usage (Priority: P3)

As a developer, I want all card renderings to use one definition so there is a single source of truth and no accidental drift due to copy-pasted templates.

**Why this priority**: Reduces maintenance burden and defect surface; speeds up future design changes.

**Independent Test**: Search the codebase and confirm all list-page and widget card renderings reference the unified card system, and any previous per-type card templates have been removed.

**Acceptance Scenarios**:

1. Given the unified system is in place, When scanning templates, Then no duplicate bespoke card markup exists for the five archetypes.
2. Given the unified system is in place, When a new content type needs a card, Then it can be configured via the same card interface without new bespoke markup.

---

### Edge Cases

- Missing image: card renders with a neutral placeholder or no image, preserving alignment and accessibility text.
- Very long titles/excerpts: titles/excerpts truncate or wrap gracefully without layout shifts; tooltips are not required to complete core tasks.
- Minimal front matter: if key fields are absent, the card hides those areas but still renders tappable/linked affordance.
- Small screens (≤320px) and large screens (≥1440px): layout adapts to preserve readability, tap targets, and content hierarchy.
- No JavaScript: all interactions (navigation via card link) work without scripts; any enhancements degrade gracefully.

## Requirements (mandatory)

### Functional Requirements

- FR-001: Provide a single card definition that all card instances use across events, posts, results, teams, and members.
- FR-002: Define a standard card input model (title, description/excerpt, href, image URL + alt, primary meta, secondary meta, badge/label, tag list) that can be mapped from each archetype’s fields.
- FR-003: Support a small set of presentational variants to cover common use cases [NEEDS CLARIFICATION: exact variant set and names].
- FR-004: Ensure visual consistency: spacing, typography scale, color roles, and hover/focus states are uniform for all variants.
- FR-005: Accessibility: cards are fully keyboard-navigable; focus is visible; images include alt text (or are marked decorative); contrast meets WCAG 2.1 AA.
- FR-006: Graceful data fallbacks: if an optional field is empty (e.g., image, secondary meta), the card hides that section without leaving visual gaps.
- FR-007: Performance: card usage must not materially regress page load experience; list pages maintain perceived speed comparable to baseline (see Success Criteria).
- FR-008: Adoption: all templates that currently render cards must adopt the unified system; prior per-type card renderers are removed immediately in this change and references are updated accordingly.
- FR-009: Documentation: provide usage guidance showing how each archetype maps its fields into the card model, including examples for typical and edge cases.
- FR-010: Examples for testing: create representative list pages or example content demonstrating all supported variants and archetypes for visual QA and accessibility checks.
- FR-011: Field mapping defaults: propose a default mapping for each archetype (see Key Entities) and allow override per usage [NEEDS CLARIFICATION: confirm mandatory vs. optional fields per archetype].

### Key Entities (data involved)

- Card: a display model comprising attributes: title, excerpt/description, href, image (src, alt), primary meta (e.g., date/score), secondary meta (e.g., venue/opponent), badge/label, tags, and variant.
- Archetype mapping: a per-content-type mapping that transforms native fields into the card model. Examples (defaults):
  - Event → title, date (primary meta), venue (secondary meta), image, href.
  - Post → title, published date (primary meta), excerpt (description), image, href, tags.
  - Result → title or opponent, score (primary meta), competition/round (secondary meta), image (optional), href.
  - Team → team name (title), age group/category (primary meta), coach (secondary meta), image (optional), href.
  - Member → name (title), role (primary meta), team/department (secondary meta), image, href.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: Single source of truth. A change made once to the card definition is reflected in 100% of card instances for the five archetypes on next build/release (verified by visual smoke test on list pages).
- SC-002: Consistency. All card instances share the same spacing, radius, and typography scale; audit finds 0 visually divergent card templates in the codebase.
- SC-003: Accessibility. Cards pass automated checks and manual keyboard testing on representative pages; no critical WCAG 2.1 AA violations related to the card component.
- SC-004: Performance. Representative listing pages’ initial render time remains within ±10% of current baseline and perceived interactivity is unaffected based on manual QA on a mid-tier device.
- SC-005: Maintainability. Duplicate card markup is reduced by ≥50% as measured by lines or files de-duplicated, confirmed via repository diff.

---

## Constitution Alignment Checklist

> Verify the feature complies with the Constitution quality gates.

- No login/auth or server/database introduced by this feature.
- Output remains fully static; enhancements degrade gracefully without JS.
- Content stays human-readable; front matter keys documented.
- Mobile responsiveness and accessibility validated on example pages.
- Social metadata defaults and overrides function as specified.

---

## Assumptions

- The site already has list pages for events, posts, results, teams, and members that currently render “cards”.
- A small number (≤3) of visual variants will cover all current uses; additional variants can be added later without breaking the model.
- Where images are optional, visual balance is preserved without requiring placeholders.
- Card is link-centric: the whole card or its title acts as the primary navigation to the detail page.

## Items Requiring Clarification (max 3)

1) Variants scope [NEEDS CLARIFICATION]: Which exact variants should the unified card support initially (e.g., Default, Compact, Media-left/Horizontal)?

2) Deprecation approach [NEEDS CLARIFICATION]: Should existing per-type card templates be removed, or kept as thin aliases to the unified system during a transition period?

3) Mandatory fields per archetype [NEEDS CLARIFICATION]: For each archetype, which fields are mandatory vs. optional for cards (e.g., is image required for members; is venue required for events)?
