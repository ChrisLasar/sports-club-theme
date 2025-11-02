---
description: "Task list for unified card component implementation"
---

# Tasks: Unified Card System

**Input**: Design documents from `/specs/003-unify-card-component/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/card-partial.md

**Tests**: Not explicitly requested in specification - tests omitted. Using manual QA approach (HTML validation, accessibility linting, Lighthouse audits).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification

- [X] T001 Verify Hugo 0.152+ Extended edition is installed and available
- [X] T002 Verify daisyUI 5.x and Tailwind CSS 4.x are configured in assets/css/main.css
- [X] T003 [P] Scan existing codebase for current card implementations using `grep -r "class=\"card" layouts/`
- [X] T004 [P] Document current card usage locations in events, posts, results, teams, members templates

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core card infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create unified card partial in layouts/_partials/card.html per contract specification
- [X] T006 [P] Create event-to-card mapper in layouts/_partials/mappers/event-to-card.html
- [X] T007 [P] Create post-to-card mapper in layouts/_partials/mappers/post-to-card.html
- [X] T008 [P] Create result-to-card mapper in layouts/_partials/mappers/result-to-card.html
- [X] T009 [P] Create team-to-card mapper in layouts/_partials/mappers/team-to-card.html
- [X] T010 [P] Create member-to-card mapper in layouts/_partials/mappers/member-to-card.html

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Update once, reflect everywhere (Priority: P1) 🎯 MVP

**Goal**: Change card layout in one place and have it propagate consistently to all card usages (events, posts, results, teams, members) without editing multiple files.

**Independent Test**: Modify a single card definition (e.g., adjust title size or add a badge slot) and verify that the five archetype listing pages reflect the change after a rebuild.

### Implementation for User Story 1

- [X] T011 [P] [US1] Update events list page in layouts/events/list.html to use unified card partial with event mapper
- [X] T012 [P] [US1] Update posts list page in layouts/posts/list.html to use unified card partial with post mapper
- [X] T013 [P] [US1] Update results list page in layouts/results/list.html to use unified card partial with result mapper
- [X] T014 [P] [US1] Update teams list page in layouts/teams/list.html to use unified card partial with team mapper
- [X] T015 [P] [US1] Update members list page in layouts/members/list.html to use unified card partial with member mapper
- [X] T016 [US1] Remove old per-archetype card partials (event-card.html, post-card.html, result-card.html, team-card.html, member-card.html) from layouts/partials/
- [X] T017 [US1] Build site with `hugo` command and verify all five list pages render cards correctly
- [X] T018 [US1] Test change propagation: modify card title styling in layouts/_partials/card.html and verify all five pages reflect the change
- [ ] T019 [P] [US1] Run HTML validation on generated public/events/index.html
- [ ] T020 [P] [US1] Run HTML validation on generated public/posts/index.html
- [ ] T021 [P] [US1] Run HTML validation on generated public/results/index.html
- [ ] T022 [P] [US1] Run HTML validation on generated public/teams/index.html
- [ ] T023 [P] [US1] Run HTML validation on generated public/members/index.html
- [ ] T024 [P] [US1] Run accessibility audit (pa11y or axe) on public/events/index.html for WCAG 2.1 AA compliance
- [ ] T025 [P] [US1] Run accessibility audit on public/posts/index.html for WCAG 2.1 AA compliance
- [ ] T026 [P] [US1] Run accessibility audit on public/results/index.html for WCAG 2.1 AA compliance
- [ ] T027 [P] [US1] Run accessibility audit on public/teams/index.html for WCAG 2.1 AA compliance
- [ ] T028 [P] [US1] Run accessibility audit on public/members/index.html for WCAG 2.1 AA compliance
- [ ] T029 [P] [US1] Run Lighthouse audit on events list page (target: LCP ≤ 2.5s, CLS ≤ 0.1)
- [ ] T030 [P] [US1] Run Lighthouse audit on posts list page (target: LCP ≤ 2.5s, CLS ≤ 0.1)
- [ ] T031 [P] [US1] Run Lighthouse audit on results list page (target: LCP ≤ 2.5s, CLS ≤ 0.1)
- [ ] T032 [US1] Manual QA: Test keyboard navigation on all five list pages (Tab, Enter, Shift+Tab)
- [ ] T033 [US1] Manual QA: Test responsive behavior on mobile (≤320px) and desktop (≥1440px) viewports

**Checkpoint**: At this point, User Story 1 should be fully functional - cards unified and testable independently

---

## Phase 4: User Story 2 - Consistent content mapping per type (Priority: P2)

**Goal**: Each card surfaces the right key fields for its content type (event date/venue, result score, post date/excerpt) so visitors get consistent, meaningful summaries.

**Independent Test**: For each archetype, verify the presence and order of key fields on the card and that missing/optional data gracefully hides without breaking the layout.

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create test event content in content/events/test-event/ with mandatory fields only (title, date, no venue, no image)
- [ ] T035 [P] [US2] Create test post content in content/posts/test-post/ with minimal fields (title, date, no excerpt, no image)
- [ ] T036 [P] [US2] Create test result content in content/results/test-result/ with minimal fields (title, score, no image, no competition)
- [ ] T037 [P] [US2] Create test team content in content/teams/test-team/ with minimal fields (title only, no coach, no image)
- [ ] T038 [P] [US2] Create test member content in content/members/test-member/ with minimal fields (name, image only, no role, no team)
- [ ] T039 [US2] Verify event card gracefully handles missing venue and image in layouts/_partials/mappers/event-to-card.html
- [ ] T040 [US2] Verify post card gracefully handles missing excerpt and image in layouts/_partials/mappers/post-to-card.html
- [ ] T041 [US2] Verify result card gracefully handles missing image and competition in layouts/_partials/mappers/result-to-card.html
- [ ] T042 [US2] Verify team card gracefully handles missing coach and image in layouts/_partials/mappers/team-to-card.html
- [ ] T043 [US2] Verify member card gracefully handles missing role and team in layouts/_partials/mappers/member-to-card.html
- [ ] T044 [US2] Build site and visually verify test content cards render without layout breaks
- [ ] T045 [P] [US2] Create test event content with very long title (>100 chars) in content/events/test-long-title/
- [ ] T046 [US2] Verify long title truncation/wrapping in card.html partial using CSS (text-ellipsis or line-clamp)
- [ ] T047 [US2] Test edge case: event with long title and venue both present, verify venue remains visible
- [ ] T048 [US2] Manual QA: Verify field order consistency across all five archetypes (title → primary meta → secondary meta → description)
- [ ] T049 [US2] Manual QA: Verify cards maintain visual balance when optional fields are missing

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - cards unified and content mapping validated

---

## Phase 5: User Story 3 - Reduce duplication and enforce usage (Priority: P3)

**Goal**: All card renderings use one definition so there is a single source of truth and no accidental drift due to copy-pasted templates.

**Independent Test**: Search the codebase and confirm all list-page and widget card renderings reference the unified card system, and any previous per-type card templates have been removed.

### Implementation for User Story 3

- [ ] T050 [P] [US3] Search codebase for any remaining direct card markup using `grep -r '<article class="card"' layouts/`
- [ ] T051 [P] [US3] Search codebase for any remaining old card partials using `find layouts/partials -name "*-card.html"`
- [ ] T052 [US3] Update homepage in layouts/index.html to use unified card partial for latest posts/events if applicable
- [ ] T053 [US3] Search for any widgets or shortcodes that render cards and update to use unified system
- [ ] T054 [US3] Create example usage documentation in specs/003-unify-card-component/quickstart.md showing how to add new content types
- [ ] T055 [US3] Add code comments in layouts/_partials/card.html documenting the contract (required vs optional fields)
- [ ] T056 [US3] Add code comments in each mapper explaining field transformations
- [ ] T057 [US3] Verify no duplicate card definitions exist by running `grep -r "class=\"card" layouts/ | grep -v "card.html" | grep -v "mappers/"`
- [ ] T058 [US3] Create example of adding a new content type (e.g., sponsors) with mapper in quickstart.md
- [ ] T059 [US3] Manual QA: Confirm single source of truth - modify card.html and verify change affects all usages
- [ ] T060 [US3] Manual QA: Verify no visual drift between archetype card renderings (consistent spacing, colors, typography)

**Checkpoint**: All user stories should now be independently functional - unified card system complete and enforced

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T061 [P] Update quickstart.md with performance optimization guidance (partialCached usage)
- [ ] T062 [P] Add responsive grid examples to quickstart.md for each archetype
- [ ] T063 [P] Document compact variant usage in quickstart.md with before/after examples
- [ ] T064 [US1] Add accessibility best practices section to quickstart.md (alt text, semantic HTML, keyboard nav)
- [ ] T065 [P] Create example content demonstrating all card variants (default, compact) in content/
- [ ] T066 [P] Add troubleshooting section to quickstart.md (common issues and solutions)
- [ ] T067 Verify all card images have proper alt text or role="presentation"
- [ ] T068 Run final HTML validation pass on all generated pages
- [ ] T069 Run final accessibility audit on all archetype list pages
- [ ] T070 Run final Lighthouse audit on all archetype list pages and verify performance budgets met
- [ ] T071 Manual QA: Test site from clean clone following quickstart.md instructions
- [ ] T072 Manual QA: Verify responsive behavior on small (320px), medium (768px), large (1440px) viewports
- [ ] T073 Manual QA: Test keyboard navigation and screen reader compatibility
- [ ] T074 Document any Constitution violations or deviations (none expected per plan.md)
- [ ] T075 Update main project README.md with link to unified card system documentation

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1, but builds on same infrastructure
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Should ideally follow US1 to verify removal of old templates

### Within Each User Story

- All mapper updates can run in parallel (marked [P])
- List page updates can run in parallel (marked [P])
- Validation tasks can run in parallel after implementation (marked [P])
- Manual QA should run after automated validations

### Parallel Opportunities

- **Phase 1**: T003 and T004 can run in parallel
- **Phase 2**: T006-T010 (all mapper creation) can run in parallel
- **Phase 3 (US1)**: T011-T015 (list page updates) can run in parallel
- **Phase 3 (US1)**: T019-T031 (HTML/accessibility/Lighthouse audits) can run in parallel after implementation
- **Phase 4 (US2)**: T034-T038 (test content creation) can run in parallel
- **Phase 4 (US2)**: T039-T043 (mapper validation) can run in parallel
- **Phase 5 (US3)**: T050-T051 (codebase searches) can run in parallel
- **Phase 6**: T061-T066 (documentation updates) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all list page updates together (after Phase 2 complete):
Task T011: "Update layouts/events/list.html to use unified card partial"
Task T012: "Update layouts/posts/list.html to use unified card partial"
Task T013: "Update layouts/results/list.html to use unified card partial"
Task T014: "Update layouts/teams/list.html to use unified card partial"
Task T015: "Update layouts/members/list.html to use unified card partial"

# Launch all validation tasks together (after implementation):
Task T019: "HTML validation on public/events/index.html"
Task T020: "HTML validation on public/posts/index.html"
Task T021: "HTML validation on public/results/index.html"
Task T022: "HTML validation on public/teams/index.html"
Task T023: "HTML validation on public/members/index.html"
Task T024-T028: "Accessibility audits on all five list pages"
Task T029-T031: "Lighthouse audits on list pages"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Tasks T001-T004)
2. Complete Phase 2: Foundational (Tasks T005-T010) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (Tasks T011-T033)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - at this point you have a working unified card system

### Incremental Delivery

1. **Foundation**: Complete Setup + Foundational (T001-T010) → Foundation ready
2. **MVP**: Add User Story 1 (T011-T033) → Test independently → **Deploy/Demo** ✅
   - At this point: Single source of truth for cards, changes propagate everywhere
3. **Enhancement**: Add User Story 2 (T034-T049) → Test independently → Deploy/Demo
   - At this point: Graceful field handling and content mapping validated
4. **Enforcement**: Add User Story 3 (T050-T060) → Test independently → Deploy/Demo
   - At this point: No duplicate templates, complete migration, future-proofed
5. **Polish**: Add Phase 6 (T061-T075) → Final validation → Deploy
   - At this point: Full documentation, examples, performance optimized

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T010)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T011-T033) - Core unification
   - **Developer B**: User Story 2 (T034-T049) - Content mapping validation (can start in parallel)
   - **Developer C**: User Story 3 (T050-T060) - Cleanup and enforcement (best done after US1)
3. Stories complete and integrate independently
4. Team collaborates on Polish phase (T061-T075)

---

## Summary

**Total Tasks**: 75

**Task Distribution**:

- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 6 tasks (BLOCKING - must complete before user stories)
- Phase 3 (User Story 1 - P1): 23 tasks 🎯 MVP
- Phase 4 (User Story 2 - P2): 16 tasks
- Phase 5 (User Story 3 - P3): 11 tasks
- Phase 6 (Polish): 15 tasks

**Parallel Opportunities Identified**: 45 tasks marked [P]

**Independent Test Criteria**:

- **User Story 1**: Modify card title styling once → verify all 5 archetype pages reflect change
- **User Story 2**: Test missing fields → verify graceful degradation on each archetype
- **User Story 3**: Search codebase → confirm no duplicate card templates exist

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1)

- Tasks T001-T033 (33 tasks)
- Delivers: Working unified card system with change propagation across all archetypes
- Testable independently without requiring US2 or US3

---

## Notes

- **[P]** tasks = different files, no dependencies within same phase
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks include exact file paths for clarity
- Format validation: ✅ All tasks follow checklist format (checkbox, ID, labels, file paths)
