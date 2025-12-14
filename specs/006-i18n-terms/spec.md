# Feature Specification: Localization & Multilingual Content

**Feature Branch**: `006-i18n-terms`  
**Created**: 2025-12-14  
**Status**: Draft  
**Input**: User description: "We use multilingual mechanisms for different use cases for this theme. The operator wants to operate the website in a different language and should be able to replace all expressions in the template with local language terms. Hard-coded navigation terms like Home, Teams, etc. must be localizable. Initially support German, English, and French. The operator should be able to override individual terms with custom wording (e.g., Teams->Group, News->Blog), including via configuration. If needed (e.g., international events), the operator can offer individual pages in multiple languages without translating all pages; pages without translation should fall back to the default language."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run the site UI in another language (Priority: P1)

As a site operator, I want to switch the site’s interface language (navigation labels, buttons, headings, reusable UI text) so the full site chrome appears in my chosen language.

**Why this priority**: If the operator cannot localize the UI, the theme is not usable for non-default language sites.

**Independent Test**: Can be fully tested by building/previewing the site in each supported language and verifying that key UI labels are localized without changing theme templates.

**Acceptance Scenarios**:

1. **Given** the site is configured to use English as default and German as an additional language, **When** a visitor views the German version, **Then** all navigation items and common UI labels are displayed in German.
2. **Given** the same site with French enabled, **When** a visitor views the French version, **Then** all navigation items and common UI labels are displayed in French.

---

### User Story 2 - Customize specific terms without editing templates (Priority: P2)

As a site operator, I want to replace certain labels (e.g., “Teams” → “Group”, “News” → “Blog”) so the theme matches my club’s preferred wording.

**Why this priority**: Clubs often use different vocabulary; forcing theme source edits increases maintenance burden and blocks upgrades.

**Independent Test**: Can be tested by applying term overrides in configuration, rebuilding/previewing, and verifying the updated labels appear in relevant UI locations.

**Acceptance Scenarios**:

1. **Given** the operator defines an override for the navigation label “Teams” in English, **When** a visitor views the English version, **Then** the navigation shows “Group” instead of “Teams”.
2. **Given** the operator defines an override for the navigation label “News” in German, **When** a visitor views the German version, **Then** the navigation shows the operator’s custom German wording.

---

### User Story 3 - Publish selected pages in multiple languages with fallback (Priority: P3)

As a content editor, I want to publish translations for specific pages (e.g., international events) while leaving most pages only in the default language, and have untranslated pages automatically fall back to the default language.

**Why this priority**: Selective translation reduces editorial workload while still supporting multilingual audiences for key content.

**Independent Test**: Can be tested by creating one translated page and one untranslated page and verifying language-specific navigation works and fallback behavior is correct.

**Acceptance Scenarios**:

1. **Given** a page exists in both English and French, **When** a visitor views the French version, **Then** they see the French content of that page.
2. **Given** a page exists only in the default language, **When** a visitor views the site in a non-default language, **Then** the page content shown is the default-language version (and the page does not appear missing/broken).

### Edge Cases

- A UI label has no translation in a non-default language: the system falls back to the default language label (no raw placeholder keys shown to visitors).
- An operator sets an override to an empty/whitespace-only value: the system ignores it and uses the language translation/fallback.
- A page translation exists but is incomplete (e.g., missing title or summary): the system uses a consistent fallback rule so visitors do not see blank headings.
- A visitor requests an unsupported language: the site responds with the default language experience.
- Mixed-language site: some pages translated, others not; navigation remains usable and does not strand the visitor.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The theme MUST support the interface languages German, English, and French.
- **FR-002**: All visitor-visible template labels (navigation items, common buttons/CTAs, section headings in shared templates, footer labels, and system messages) MUST be localizable per language.
- **FR-003**: The operator MUST be able to switch the default language of the site without editing theme templates.
- **FR-004**: The operator MUST be able to override individual UI terms with custom wording without editing theme templates.
- **FR-005**: Term overrides MUST be language-aware (an override can be different per language).
- **FR-006**: Term resolution MUST follow a predictable precedence: operator override (if provided) takes precedence over built-in translation, which takes precedence over default-language fallback.
- **FR-007**: The theme MUST support publishing a subset of pages in multiple languages.
- **FR-008**: When a page is not available in a requested language, the system MUST render the default-language page content rather than failing the request.
- **FR-009**: The language selection UI (if present) MUST show language options using localized language names (e.g., “Deutsch”, “English”, “Français”).
- **FR-010**: Documentation MUST include: how to set default language, enable additional languages, add/modify translations, and apply term overrides.

### Key Entities *(include if feature involves data)*

- **Language**: A supported visitor-facing language of the site (e.g., German/English/French), including a default language.
- **Translation Key**: A stable identifier for a visitor-visible label in the theme (e.g., navigation label for “Teams”).
- **Translation Value**: The localized label shown to visitors for a given translation key in a given language.
- **Term Override**: An operator-provided replacement translation value for a translation key (optionally per language).
- **Page Translation**: A language-specific version of a page’s content; may be absent for many pages.

## Assumptions

- The default language is fully authored; other languages may be partial.
- If a page translation is missing, showing the default-language page is preferable to hiding the page or showing an error.
- Operators can edit a site configuration file and translation files as part of normal site setup.

## Out of Scope

- Automated machine translation.
- Per-user language preference storage or personalization.
- Complex linguistic rules beyond basic text translation (e.g., advanced pluralization rules), unless already supported by the platform.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For each of German, English, and French, a reviewer can verify at least 20 representative UI labels are correctly localized (header nav, footer, list pages, single pages).
- **SC-002**: A reviewer can override at least 5 specific terms (e.g., Teams, News, Events, Results, Members) and confirm the overrides appear in the UI without any theme template edits.
- **SC-003**: A reviewer can create at least 1 page translated into a second language and confirm the translated variant is shown when viewing that language.
- **SC-004**: A reviewer can view at least 2 pages that have no translation and confirm the default-language content is shown in non-default languages without broken navigation.

---

## Constitution Alignment Checklist

> Verify the feature complies with the Constitution quality gates.


- No login/auth or server/database introduced by this feature.
- Output remains fully static; the site remains usable without JavaScript.
- All visitor-visible labels are localizable and can be overridden by the operator.
- Default-language fallback prevents broken pages when translations are missing.
- Documentation enables an operator to configure languages and overrides without editing theme templates.
