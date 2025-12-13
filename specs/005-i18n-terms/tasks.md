---
description: "Task list for Multilingual UI Terminology implementation"
---

# Tasks: Multilingual UI Terminology

**Input**: Design documents from `/specs/005-i18n-terms/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/i18n-term-partial.md

**Tests**: Not explicitly requested in specification - focusing on implementation and validation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and i18n directory structure

- [ ] T001 Create i18n directory structure at repository root: `i18n/`
- [ ] T002 [P] Verify Hugo version 0.152+ (Extended) is installed
- [ ] T003 [P] Create i18n-term helper partial in `layouts/partials/i18n-term.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Configure language settings in `config/_default/hugo.toml` with languages.en, languages.de, languages.fr sections
- [ ] T005 [P] Create English translation file `i18n/en.yaml` with all MVP term keys (navigation, headings, actions, accessibility)
- [ ] T006 [P] Create German translation file `i18n/de.yaml` with all MVP term keys (matching en.yaml structure)
- [ ] T007 [P] Create French translation file `i18n/fr.yaml` with all MVP term keys (matching en.yaml structure)
- [ ] T008 Implement fallback chain logic in `layouts/partials/i18n-term.html` (config override → i18n → default language → key)
- [ ] T009 Update site header template in `layouts/partials/header.html` to use i18n-term partial for navigation labels
- [ ] T010 Update base HTML template in `layouts/_default/baseof.html` to include correct lang attribute from site.Language.LanguageCode

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View site labels in selected language (Priority: P1) 🎯 MVP

**Goal**: Enable visitors to view all interface labels in English, German, or French based on site configuration

**Independent Test**: Build site for each language (en/de/fr) separately; verify all navigation, headings, and section labels appear in the correct language without modifying content files

### Implementation for User Story 1

- [ ] T011 [P] [US1] Replace hard-coded "Home" with i18n-term partial call in `layouts/partials/header.html`
- [ ] T012 [P] [US1] Replace hard-coded "Teams" navigation label with i18n-term partial call in `layouts/partials/header.html`
- [ ] T013 [P] [US1] Replace hard-coded "Events" navigation label with i18n-term partial call in `layouts/partials/header.html`
- [ ] T014 [P] [US1] Replace hard-coded "Results" navigation label with i18n-term partial call in `layouts/partials/header.html`
- [ ] T015 [P] [US1] Replace hard-coded "News" navigation label with i18n-term partial call in `layouts/partials/header.html`
- [ ] T016 [P] [US1] Replace hard-coded "Members" navigation label with i18n-term partial call in `layouts/partials/header.html`
- [ ] T017 [P] [US1] Update teams list page heading in `layouts/teams/list.html` to use i18n-term partial for "teams_heading"
- [ ] T018 [P] [US1] Update news/posts list page heading in `layouts/posts/list.html` to use i18n-term partial for "news_heading"
- [ ] T019 [P] [US1] Update events list page heading in `layouts/events/list.html` to use i18n-term partial for "events_heading"
- [ ] T020 [P] [US1] Update results list page heading in `layouts/results/list.html` to use i18n-term partial for "results_heading"
- [ ] T021 [P] [US1] Update members list page heading in `layouts/members/list.html` to use i18n-term partial for "members_heading"
- [ ] T022 [P] [US1] Update "Read More" button/link text in card partial `layouts/partials/card.html` to use i18n-term partial
- [ ] T023 [P] [US1] Update accessibility skip links in `layouts/partials/accessibility-skip-links.html` to use i18n-term partial for "skip_to_content"
- [ ] T024 [P] [US1] Update footer labels in `layouts/partials/footer.html` to use i18n-term partial for any hard-coded section titles
- [ ] T025 [US1] Update page title generation in `layouts/_default/baseof.html` to use translated section names from i18n
- [ ] T026 [US1] Update breadcrumbs (if present in any template) to use i18n-term partial for section names
- [ ] T027 [US1] Build site with defaultContentLanguage="en" and verify all UI labels render in English
- [ ] T028 [US1] Build site with defaultContentLanguage="de" and verify all UI labels render in German
- [ ] T029 [US1] Build site with defaultContentLanguage="fr" and verify all UI labels render in French
- [ ] T030 [US1] Validate HTML output includes correct lang attribute in HTML tag for each language build
- [ ] T031 [US1] Verify accessibility landmarks (nav, main, etc.) maintain proper labels in all three languages
- [ ] T032 [US1] Document default language configuration in `quickstart.md` (already exists, verify accuracy)

**Checkpoint**: At this point, User Story 1 should be fully functional - site can render in any of the three languages with proper UI labels

---

## Phase 4: User Story 2 - Maintain terminology via configuration (Priority: P2)

**Goal**: Enable site maintainers to override specific UI terms per language via configuration without code changes

**Independent Test**: Update hugo.toml to set languages.en.params.terms.news="Blog", rebuild, confirm "Blog" appears in English navigation/headings but German/French remain unchanged

### Implementation for User Story 2

- [ ] T033 [P] [US2] Add example term override configuration to `config/_default/hugo.toml` in languages.en.params.terms section (commented examples)
- [ ] T034 [P] [US2] Add example term override configuration to `config/_default/hugo.toml` in languages.de.params.terms section (commented examples)
- [ ] T035 [P] [US2] Add example term override configuration to `config/_default/hugo.toml` in languages.fr.params.terms section (commented examples)
- [ ] T036 [US2] Verify i18n-term partial checks site.Language.Params.terms before i18n file lookup (already implemented in T008)
- [ ] T037 [US2] Test override by setting languages.en.params.terms.news="Blog" in hugo.toml and rebuild
- [ ] T038 [US2] Verify "Blog" appears in English navigation instead of "News" after rebuild with override
- [ ] T039 [US2] Verify "Blog" appears in English page headings instead of "News" after rebuild with override
- [ ] T040 [US2] Verify German navigation still shows "Nachrichten" (or German default) not "Blog" when only English has override
- [ ] T041 [US2] Verify French navigation still shows "Actualités" (or French default) not "Blog" when only English has override
- [ ] T042 [US2] Test multiple overrides by setting both terms.news="Blog" and terms.teams="Groups" in English config
- [ ] T043 [US2] Verify both "Blog" and "Groups" appear consistently across all affected UI locations in English
- [ ] T044 [US2] Test per-language override independence by setting terms.teams="Squads" in English and terms.teams="Gruppen" in German
- [ ] T045 [US2] Document override mechanism in `quickstart.md` with examples (verify existing examples section)
- [ ] T046 [US2] Add documentation comment to hugo.toml explaining available term keys that can be overridden

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - site renders in multiple languages AND supports custom term overrides per language

---

## Phase 5: User Story 3 - Safe fallbacks for missing terms (Priority: P3)

**Goal**: Ensure site gracefully handles missing translations or overrides with sensible defaults

**Independent Test**: Remove a French override for "teams", rebuild, verify the default French label appears; remove a term entirely from French i18n file, verify English default is used

### Implementation for User Story 3

- [ ] T047 [US3] Verify i18n-term partial returns key itself as last resort if all lookups fail (already implemented in T008, validate)
- [ ] T048 [US3] Test missing override: Remove terms.teams from languages.fr.params, rebuild, verify French default "Équipes" appears
- [ ] T049 [US3] Test missing i18n key: Remove "teams" key from i18n/fr.yaml, rebuild, verify English fallback "Teams" appears
- [ ] T050 [US3] Test missing i18n key in all files: Remove "teams" from all i18n files, rebuild, verify raw key "teams" appears (failsafe)
- [ ] T051 [US3] Test empty override value: Set terms.news="" in English config, rebuild, verify i18n default "News" is used (empty ignored)
- [ ] T052 [US3] Test partial override scenario: Override 2 of 6 navigation terms, verify remaining 4 use i18n defaults without mixing languages
- [ ] T053 [US3] Test defaultContentLanguage fallback: Set site language to "de", remove a key from de.yaml, verify en.yaml value appears
- [ ] T054 [US3] Enable Hugo i18n warnings with `--printI18nWarnings` flag and validate missing key detection during build
- [ ] T055 [US3] Document fallback behavior in `quickstart.md` (add new "Fallback Behavior" section if not present)
- [ ] T056 [US3] Document troubleshooting steps for missing translations in `quickstart.md`

**Checkpoint**: All user stories should now be independently functional with robust fallback mechanisms

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T057 [P] Validate all i18n term keys follow snake_case naming convention in all three language files
- [ ] T058 [P] Verify all three language files (en.yaml, de.yaml, fr.yaml) have identical key sets (no missing keys across languages)
- [ ] T059 [P] Update quickstart.md with complete list of available term keys that can be overridden
- [ ] T060 [P] Add table of common term overrides to quickstart.md (e.g., News→Blog, Teams→Squads, Members→Athletes)
- [ ] T061 Run HTML validation on English build output to verify proper lang attributes and structure
- [ ] T062 Run HTML validation on German build output to verify proper lang attributes and structure
- [ ] T063 Run HTML validation on French build output to verify proper lang attributes and structure
- [ ] T064 [P] Run accessibility audit (pa11y or axe) on example pages in English to verify translated labels maintain WCAG 2.1 AA
- [ ] T065 [P] Run accessibility audit on example pages in German to verify translated labels maintain WCAG 2.1 AA
- [ ] T066 [P] Run accessibility audit on example pages in French to verify translated labels maintain WCAG 2.1 AA
- [ ] T067 Verify performance budget: Confirm JavaScript weight unchanged (0 KB added) compared to baseline
- [ ] T068 Verify performance budget: Measure build time increase with 3 languages (should be <100ms)
- [ ] T069 [P] Update .github/copilot-instructions.md with i18n patterns and i18n-term partial usage guidelines
- [ ] T070 [P] Create example site configuration showcasing multilingual setup with overrides in config/_default/hugo.toml
- [ ] T071 Validate quickstart.md instructions by following them on a clean Hugo site from scratch
- [ ] T072 [P] Add code comments to i18n-term.html partial explaining fallback chain logic
- [ ] T073 Final review: Verify all three language builds produce valid, accessible, performant output
- [ ] T074 Final review: Verify backwards compatibility - single-language sites work without configuration changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel after Phase 2 (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Tests edge cases of US1 & US2 but independently verifiable

### Within Each User Story

- Core partial implementation (T008) must complete before US1 template updates
- Template updates within US1 (T011-T026) can run in parallel (different files)
- Validation tasks (T027-T032) must run after all template updates complete
- US2 configuration tasks (T033-T035) can run in parallel
- US2 testing tasks (T037-T044) must run sequentially to verify each scenario
- US3 testing tasks (T047-T056) must run sequentially to verify fallback behaviors

### Parallel Opportunities

- **Phase 1**: T002 and T003 can run in parallel with T001
- **Phase 2**: T005, T006, T007 (language files) can all run in parallel
- **Phase 2**: T009 (header) and T010 (baseof) can run in parallel
- **User Story 1**: T011-T024 (template updates) can run in parallel - all different files
- **User Story 2**: T033, T034, T035 (config examples) can run in parallel
- **User Story 3**: T048-T053 (test scenarios) can be prepared in parallel, executed sequentially
- **Polish Phase**: T057, T058, T059, T060 (documentation) can run in parallel
- **Polish Phase**: T061, T062, T063 (HTML validation) can run in parallel
- **Polish Phase**: T064, T065, T066 (accessibility audits) can run in parallel
- **Polish Phase**: T069, T070, T072 (documentation/examples) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all template updates for User Story 1 together:
Task: "Replace hard-coded 'Home' in layouts/partials/header.html"
Task: "Replace hard-coded 'Teams' in layouts/partials/header.html"
Task: "Replace hard-coded 'Events' in layouts/partials/header.html"
Task: "Update teams heading in layouts/teams/list.html"
Task: "Update news heading in layouts/posts/list.html"
Task: "Update skip links in layouts/partials/accessibility-skip-links.html"
Task: "Update card buttons in layouts/partials/card.html"

# Then validate all languages sequentially:
Task: "Build and verify English"
Task: "Build and verify German"
Task: "Build and verify French"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T010) ⚠️ CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T011-T032)
4. **STOP and VALIDATE**: Build site in all three languages, verify UI labels work correctly
5. Deploy/demo if ready - this is a complete MVP!

### Incremental Delivery

1. Complete Setup + Foundational → i18n infrastructure ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: multilingual labels work!)
3. Add User Story 2 → Test independently → Deploy/Demo (Added: custom overrides work!)
4. Add User Story 3 → Test independently → Deploy/Demo (Added: robust fallbacks!)
5. Complete Polish → Final validation → Production ready!

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T010)
2. Once Foundational is done:
   - Developer A: User Story 1 template updates (T011-T032)
   - Developer B: Prepare User Story 2 config examples (T033-T035)
   - Developer C: Write User Story 3 test scenarios (T047-T056)
3. Stories integrate and validate independently

---

## Task Count Summary

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 7 tasks ⚠️ BLOCKS all user stories
- **Phase 3 (US1 - P1)**: 22 tasks 🎯 MVP
- **Phase 4 (US2 - P2)**: 14 tasks
- **Phase 5 (US3 - P3)**: 10 tasks
- **Phase 6 (Polish)**: 18 tasks

**Total**: 74 tasks

**Parallel Opportunities**: 35+ tasks can run in parallel (marked with [P] or within parallel groups)

**MVP Scope**: Phases 1-3 only (32 tasks) delivers core multilingual UI functionality

**Independent Test Criteria**:

- US1: Build in each language, verify all labels render correctly
- US2: Add config overrides, verify they apply consistently
- US3: Remove translations/overrides, verify fallbacks work gracefully

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- [P] tasks target different files with no dependencies - safe to parallelize
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Stop at any checkpoint to validate story independently
- Tests are validation-focused (not unit/integration tests) per specification
- Build-time only solution: 0 KB JavaScript impact, fully static output
- Backwards compatible: Single-language sites work without changes
