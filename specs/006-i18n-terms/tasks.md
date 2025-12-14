# Tasks: Localization & Multilingual Content

**Feature**: 006-i18n-terms  
**Input**: Design documents from `/specs/006-i18n-terms/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No explicit test requirements in specification - tests omitted per optional testing policy.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Hugo project structure with all paths relative to repository root:

- `/i18n/` - Translation files
- `/layouts/partials/` - Reusable template components
- `/layouts/_default/` - Base templates
- `/config/_default/` - Configuration files
- `/content/` - Multilingual content

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization for multilingual support

- [ ] T001 Create i18n directory structure at `/i18n/`
- [ ] T002 Verify Hugo version 0.152+ (Extended) is installed and configured
- [ ] T003 [P] Review existing templates in `/layouts/` for hardcoded strings that need localization

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core i18n infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Configure language settings in `/config/_default/hugo.toml` with en/de/fr languages
- [ ] T005 [P] Create English translation file `/i18n/en.toml` with all required keys per data-model.md
- [ ] T006 [P] Create German translation file `/i18n/de.toml` with all required keys per data-model.md
- [ ] T007 [P] Create French translation file `/i18n/fr.toml` with all required keys per data-model.md
- [ ] T008 Create label resolution helper partial at `/layouts/partials/label.html` per contracts/i18n-function.md
- [ ] T009 Create language switcher component at `/layouts/partials/language-switcher.html` per contracts/language-switcher.md
- [ ] T010 [P] Add HTML lang attribute to `/layouts/_default/baseof.html` using `{{ .Site.Language.LanguageCode }}`
- [ ] T011 [P] Add hreflang links for SEO to `/layouts/partials/head.html` for all translations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Run the site UI in another language (Priority: P1) 🎯 MVP

**Goal**: Enable full site interface localization in German, English, and French

**Independent Test**: Build site with each language configured, verify navigation labels and UI elements display correctly in each language without template modifications

### Implementation for User Story 1

- [ ] T012 [P] [US1] Update navigation in `/layouts/partials/header.html` to use `{{ partial "label.html" "home" }}` pattern for all menu items
- [ ] T013 [P] [US1] Update footer links in `/layouts/partials/footer.html` to use i18n function for all labels
- [ ] T014 [P] [US1] Localize button/CTA text in `/layouts/partials/card.html` using i18n function
- [ ] T015 [P] [US1] Localize list page headings in `/layouts/posts/list.html` using i18n function
- [ ] T016 [P] [US1] Localize list page headings in `/layouts/events/list.html` using i18n function
- [ ] T017 [P] [US1] Localize list page headings in `/layouts/teams/list.html` using i18n function
- [ ] T018 [P] [US1] Localize list page headings in `/layouts/results/list.html` using i18n function
- [ ] T019 [P] [US1] Localize list page headings in `/layouts/members/list.html` using i18n function
- [ ] T020 [P] [US1] Localize date formats in single page templates using i18n date_format key
- [ ] T021 [P] [US1] Add accessibility labels using i18n in skip links at `/layouts/partials/accessibility-skip-links.html`
- [ ] T022 [US1] Integrate language switcher partial into `/layouts/partials/header.html`
- [ ] T023 [US1] Style language switcher component with daisyUI classes for responsive display
- [ ] T024 [US1] Verify all internal links use `.RelPermalink` for language-aware URLs across all templates
- [ ] T025 [US1] Add language switcher documentation to `/specs/006-i18n-terms/quickstart.md` section
- [ ] T026 [US1] Test site build in all three languages (en/de/fr) and verify UI is fully localized

**Checkpoint**: At this point, User Story 1 should be fully functional - site UI displays in selected language

---

## Phase 4: User Story 2 - Customize specific terms without editing templates (Priority: P2)

**Goal**: Enable operators to override UI labels via configuration without theme file edits

**Independent Test**: Add label overrides in hugo.toml for 5+ terms, rebuild site, verify custom labels appear in UI

### Implementation for User Story 2

- [ ] T027 [US2] Document label override configuration pattern in `/specs/006-i18n-terms/quickstart.md`
- [ ] T028 [US2] Add example label overrides to `/config/_default/hugo.toml` for teams/news labels per language
- [ ] T029 [US2] Create validation snippet in `/specs/006-i18n-terms/quickstart.md` for testing overrides
- [ ] T030 [P] [US2] Test label override for navigation items (teams → groups) in English
- [ ] T031 [P] [US2] Test label override for navigation items (news → blog) in English
- [ ] T032 [P] [US2] Test label override for German language labels
- [ ] T033 [P] [US2] Test label override for French language labels
- [ ] T034 [US2] Document precedence order (config override > i18n > key name) in quickstart
- [ ] T035 [US2] Add troubleshooting section for common override issues to quickstart

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - operators can customize labels

---

## Phase 5: User Story 3 - Publish selected pages in multiple languages with fallback (Priority: P3)

**Goal**: Support partial content translation with automatic fallback to default language

**Independent Test**: Create one fully translated page and one untranslated page, verify French version shows French page where available and English fallback where not

### Implementation for User Story 3

- [ ] T036 [P] [US3] Create example translated post at `/content/posts/example-multilingual-post.md` (English)
- [ ] T037 [P] [US3] Create German translation at `/content/posts/example-multilingual-post.de.md`
- [ ] T038 [P] [US3] Create French translation at `/content/posts/example-multilingual-post.fr.md`
- [ ] T039 [P] [US3] Create example event with only English version at `/content/events/test-fallback-event.md`
- [ ] T040 [US3] Update language switcher to handle missing translations gracefully (show/hide unavailable languages)
- [ ] T041 [US3] Add fallback notice partial at `/layouts/partials/translation-notice.html` per data-model.md
- [ ] T042 [US3] Integrate fallback notice into single page templates when translation missing
- [ ] T043 [US3] Document translation by filename workflow in `/specs/006-i18n-terms/quickstart.md`
- [ ] T044 [US3] Document fallback behavior in quickstart with examples
- [ ] T045 [US3] Test language switcher with partially translated content (some languages available, some not)
- [ ] T046 [US3] Test fallback behavior - verify English content shown when German/French translation missing
- [ ] T047 [US3] Add content editor guidelines for creating translations to quickstart

**Checkpoint**: All user stories should now be independently functional - partial translation with fallback works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T048 [P] Review all templates in `/layouts/` for any remaining hardcoded strings
- [ ] T049 [P] Verify menu integration uses i18n lookups per contracts/i18n-function.md
- [ ] T050 [P] Add SEO metadata section to quickstart documenting hreflang requirements
- [ ] T051 [P] Validate date/time formatting works correctly for each locale
- [ ] T052 Add troubleshooting section to quickstart for common i18n issues
- [ ] T053 Document performance impact (translation files add ~5KB total per plan.md)
- [ ] T054 Create visual examples/screenshots for quickstart showing language switcher
- [ ] T055 [P] Accessibility audit: verify language switcher is keyboard navigable
- [ ] T056 [P] Accessibility audit: verify screen reader compatibility of language switcher
- [ ] T057 Test complete multilingual workflow from clean clone per quickstart steps
- [ ] T058 Update main README.md with link to multilingual feature documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses US1's infrastructure but independently testable

### Within Each User Story

#### User Story 1 (UI Localization)

- Template updates (T012-T021) can run in parallel [P]
- Integration tasks (T022-T024) must run after templates complete
- Documentation and testing (T025-T026) run last

#### User Story 2 (Label Overrides)

- Documentation (T027-T029) first
- All override tests (T030-T033) can run in parallel [P]
- Final documentation (T034-T035) last

#### User Story 3 (Partial Translation)

- Example content creation (T036-T039) can run in parallel [P]
- Component updates (T040-T042) after examples
- Documentation and testing (T043-T047) last

### Parallel Opportunities

- **Setup (Phase 1)**: T003 can run parallel with T001-T002
- **Foundational (Phase 2)**: T005-T007 (translation files) in parallel, T010-T011 (HTML updates) in parallel
- **User Story 1**: All template updates (T012-T021) can run in parallel
- **User Story 2**: All override tests (T030-T033) can run in parallel
- **User Story 3**: All example content (T036-T039) can run in parallel
- **Polish (Phase 6)**: Most review/audit tasks (T048-T051, T055-T056) can run in parallel
- **Different user stories**: Once Foundational phase completes, all three user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all template localization tasks together:
Task: "Update navigation in /layouts/partials/header.html to use label helper"
Task: "Update footer links in /layouts/partials/footer.html to use i18n"
Task: "Localize card buttons in /layouts/partials/card.html"
Task: "Localize posts list in /layouts/posts/list.html"
Task: "Localize events list in /layouts/events/list.html"
Task: "Localize teams list in /layouts/teams/list.html"
Task: "Localize results list in /layouts/results/list.html"
Task: "Localize members list in /layouts/members/list.html"
Task: "Localize date formats in single templates"
Task: "Add accessibility labels to skip links"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~15 min)
2. Complete Phase 2: Foundational (~45 min - CRITICAL blocks all stories)
3. Complete Phase 3: User Story 1 (~90 min)
4. **STOP and VALIDATE**: Test site in all 3 languages independently
5. Deploy/demo if ready

**Total MVP Time**: ~2.5 hours for complete UI localization

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~1 hour)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - full UI localization!)
3. Add User Story 2 → Test independently → Deploy/Demo (+ custom label overrides!)
4. Add User Story 3 → Test independently → Deploy/Demo (+ partial content translation!)
5. Polish phase → Production ready

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers after Foundational phase completes:

- **Developer A**: User Story 1 (all template updates in parallel within story)
- **Developer B**: User Story 2 (prepare override examples and documentation)
- **Developer C**: User Story 3 (create example translated content)

Stories complete and integrate independently.

---

## Success Metrics (from spec.md)

### SC-001: Localized UI Labels

**Target**: 20+ representative UI labels correctly localized in each language (de/en/fr)
**Validation**: Tasks T012-T021 cover all major template areas (navigation, footer, lists, buttons, dates, accessibility)

### SC-002: Label Overrides

**Target**: Override 5+ specific terms without template edits
**Validation**: Tasks T028-T033 test overrides for teams, news, and other navigation labels across all languages

### SC-003: Translated Content

**Target**: Create 1+ page translated into second language
**Validation**: Tasks T036-T038 create fully translated example post in en/de/fr

### SC-004: Fallback Behavior

**Target**: View 2+ untranslated pages showing default language content
**Validation**: Task T039 creates untranslated page, T046 verifies fallback behavior

---

## Notes

- All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- [P] tasks = different files, no dependencies within phase
- [Story] label (US1/US2/US3) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks included - testing requirements not specified in spec.md
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Hugo's i18n system is build-time only - zero runtime cost, fully static output
- Maintain Constitution compliance: no JavaScript required, works without JS, fully accessible
