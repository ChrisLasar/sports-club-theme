# Tasks: Content Reference Picker

**Feature Branch**: `004-content-reference-picker`  
**Input**: Design documents from `/specs/004-content-reference-picker/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not required by specification - manual CMS testing + Hugo build validation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and ensure Sveltia CMS is properly configured

- [x] T001 Verify Hugo 0.152+ (Extended) is installed and configured in `config/_default/hugo.toml`
- [x] T002 Verify Sveltia CMS is accessible at `/admin/` and loads the current config from `static/admin/config.yml`
- [x] T003 [P] Create venues content collection directory structure at `content/venues/` (migration from data file to content collection)
- [x] T004 [P] Verify existing content structure matches data model: `content/members/`, `content/teams/`, `content/events/`, `content/results/`, `content/posts/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migrate venues to content collection and create validation infrastructure - MUST complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Migrate venues from `data/venues.yaml` to content collection in `content/venues/{slug}/index.md` (create one file per venue with front matter: title, date, address, map_link, facilities)
- [x] T006 Create Hugo partial for reference validation at `layouts/partials/validate-reference.html` (validates content references exist using `.Site.GetPage`)
- [x] T007 [P] Update team templates in `layouts/teams/single.html` to resolve venue references via `.Site.GetPage` instead of `.Site.Data.venues`
- [x] T008 [P] Update event templates in `layouts/events/single.html` to resolve venue references via `.Site.GetPage`
- [x] T009 Create venues collection entry in CMS config at `static/admin/config.yml` with fields: title, date, address, map_link, facilities, image, description

**Checkpoint**: Foundation ready - venues migrated to content, validation infrastructure in place, user story implementation can begin

---

## Phase 3: User Story 1 - Team Coach Selection (Priority: P1) 🎯 MVP

**Goal**: Allow users to select team coaches from a dropdown of available members instead of typing paths manually

**Independent Test**: Create a new team in CMS, click coaches field, see dropdown of members (showing name and role), select a member, save team, verify correct path is stored in front matter and coach displays correctly on published team page

### Implementation for User Story 1

- [x] T010 [P] [US1] Update members collection in `static/admin/config.yml` to ensure proper fields for relation widget (title, role, teams)
- [x] T011 [US1] Add Relation widget configuration for coaches field in teams collection in `static/admin/config.yml` (collection: members, search_fields: ["title", "role"], value_field: "{{slug}}", display_fields: ["{{title}} ({{role}})"], multiple: true, hint: "Select members who coach this team. If no members appear, create members first.")
- [x] T012 [US1] Update team archetype at `archetypes/teams/index.md` to use `coaches: []` array format instead of `coach: ""`
- [x] T013 [US1] Update team single template at `layouts/teams/single.html` to resolve and display coach references using `.Site.GetPage` with error handling for missing references
- [x] T014 [US1] Add validation calls in team list template at `layouts/teams/list.html` to validate all coach references exist
- [x] T015 [US1] Create example team content at `content/teams/example-team/index.md` with multiple coach references demonstrating the feature
- [x] T016 [US1] Update quickstart.md section "Adding Coaches to a Team" with screenshots and step-by-step workflow using the new relation widget

**Checkpoint**: User Story 1 complete - team coach selection works via dropdown, validates correctly, displays properly

---

## Phase 4: User Story 2 - Event-to-Team Reference (Priority: P1)

**Goal**: Allow users to select teams for events from a searchable dropdown instead of typing team slugs

**Independent Test**: Create a new event in CMS, add teams via dropdown selection, save event, verify event appears on selected teams' pages and team references are correctly stored

### Implementation for User Story 2

- [x] T017 [P] [US2] Update teams collection in `static/admin/config.yml` to ensure fields are properly configured for relation widget display (title, sport, group)
- [x] T018 [US2] Add Relation widget configuration for teams field in events collection in `static/admin/config.yml` (collection: teams, search_fields: ["title", "sport", "group"], value_field: "{{slug}}", display_fields: ["{{title}} ({{sport}})"], multiple: true, min: 1, required: true, hint: "Select at least one team for this event.")
- [x] T019 [US2] Add Relation widget configuration for venue field in events collection in `static/admin/config.yml` (collection: venues, search_fields: ["title", "address"], value_field: "{{slug}}", display_fields: ["{{title}}"], required: false, hint: "Where is this event taking place? If no venues appear, create venues first.")
- [x] T020 [US2] Update event archetype at `archetypes/events.md` to include `teams: []` and `venue: ""` with proper format
- [x] T021 [US2] Update event single template at `layouts/events/single.html` to resolve and display team and venue references using `.Site.GetPage`
- [x] T022 [US2] Add validation calls in event list template at `layouts/events/list.html` to validate all team and venue references exist
- [x] T023 [US2] Create example event content at `content/events/example-event/index.md` with multiple team references and venue reference
- [x] T024 [US2] Update quickstart.md section "Linking Events to Teams" with workflow documentation

**Checkpoint**: User Story 2 complete - event team selection works, searchable dropdown functions, references validate

---

## Phase 5: User Story 3 - Result-to-Event Reference (Priority: P2)

**Goal**: Allow users to link match results to events by selecting from a dropdown of recent/upcoming events

**Independent Test**: Create a result entry, select an existing event from dropdown sorted by date, save result, verify result is linked to event on published site

### Implementation for User Story 3

- [x] T025 [P] [US3] Update events collection in `static/admin/config.yml` to ensure date field is properly formatted for relation widget display
- [x] T026 [US3] Add Relation widget configuration for event field in results collection in `static/admin/config.yml` (collection: events, search_fields: ["title", "date"], value_field: "{{slug}}", display_fields: ["{{title}} - {{date}}"], required: false, hint: "Link this result to an event (optional).")
- [x] T027 [US3] Add Relation widget configuration for teams field in results collection in `static/admin/config.yml` (collection: teams, search_fields: ["title", "sport"], value_field: "{{slug}}", display_fields: ["{{title}} ({{sport}})"], multiple: true, required: false)
- [x] T028 [US3] Update result archetype at `archetypes/results.md` to include `event: ""` and `teams: []` fields
- [x] T029 [US3] Update result single template at `layouts/results/single.html` to resolve and display event reference and team references using `.Site.GetPage`
- [x] T030 [US3] Update event single template at `layouts/events/single.html` to display linked results (find results that reference this event)
- [x] T031 [US3] Add validation calls in result list template at `layouts/results/list.html` to validate event and team references
- [x] T032 [US3] Create example result content at `content/results/example-result/index.md` with event reference demonstrating the feature
- [x] T033 [US3] Update quickstart.md section "Result-to-Event Reference" with workflow documentation

**Checkpoint**: User Story 3 complete - results can be linked to events via dropdown, bidirectional display works

---

## Phase 6: User Story 4 - Post Author Selection (Priority: P2)

**Goal**: Allow users to select post authors from members instead of typing names as free text

**Independent Test**: Create a post, select an author from member dropdown, save, verify author's profile is linked on published post

### Implementation for User Story 4

- [x] T034 [P] [US4] Add Relation widget configuration for author field in posts collection in `static/admin/config.yml` (collection: members, search_fields: ["title", "role"], value_field: "{{slug}}", display_fields: ["{{title}} ({{role}})"], required: true, hint: "Select the post author from members.")
- [x] T035 [US4] Add Relation widget configuration for teams field (related teams) in posts collection in `static/admin/config.yml` (collection: teams, search_fields: ["title", "sport"], value_field: "{{slug}}", display_fields: ["{{title}} ({{sport}})"], multiple: true, required: false, hint: "Tag teams related to this post.")
- [x] T036 [US4] Update post archetype at `archetypes/posts.md` to include `author: ""` and `teams: []` fields
- [x] T037 [US4] Update post single template at `layouts/posts/single.html` to resolve and display author reference with link to member profile using `.Site.GetPage`
- [x] T038 [US4] Update post single template at `layouts/posts/single.html` to display related teams with links
- [x] T039 [US4] Add validation calls in post list template at `layouts/posts/list.html` to validate author and team references
- [x] T040 [US4] Create example post content at `content/posts/example-post/index.md` with author reference and team references
- [x] T041 [US4] Update quickstart.md section "Setting Post Authors" with workflow documentation

**Checkpoint**: User Story 4 complete - post authors selectable from members, team tagging works, references validate

---

## Phase 7: User Story 5 - Venue Selection for Teams and Events (Priority: P3)

**Goal**: Allow users to select venues from content collection for teams and events

**Independent Test**: Edit a team's training venue or event's venue, select from venues dropdown, verify venue details display correctly on published page

### Implementation for User Story 5

- [x] T042 [P] [US5] Add Relation widget configuration for primary_venue field in teams collection in `static/admin/config.yml` (collection: venues, search_fields: ["title", "address"], value_field: "{{slug}}", display_fields: ["{{title}}"], required: false, hint: "Select the team's home venue. If no venues appear, create venues first.")
- [x] T043 [US5] Add Relation widget configuration for venue field in training_schedule list widget in teams collection in `static/admin/config.yml` (collection: venues, search_fields: ["title"], value_field: "{{slug}}", display_fields: ["{{title}}"], hint: "Select training venue")
- [x] T044 [US5] Verify event venue relation widget configuration from US2 is working correctly in `static/admin/config.yml`
- [x] T045 [US5] Update team archetype at `archetypes/teams/index.md` to include `primary_venue: ""` and proper training_schedule format with venue field
- [x] T046 [US5] Verify team and event templates resolve venue references correctly using `.Site.GetPage` (completed in Phase 2 foundational tasks)
- [x] T047 [US5] Create example venue content at `content/venues/example-venue/index.md` demonstrating venue schema
- [x] T048 [US5] Update example team content to reference venue in primary_venue and training_schedule
- [x] T049 [US5] Update quickstart.md section "Selecting Venues" with workflow documentation

**Checkpoint**: User Story 5 complete - all venue selections work via dropdowns, venues display correctly

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, validation, and documentation

- [x] T050 [P] Verify all CMS config changes in `static/admin/config.yml` follow consistent pattern (relation widgets for content, proper hints, search fields, display fields)
- [x] T051 [P] Add member-to-team relation widget in members collection in `static/admin/config.yml` for reverse relationship (optional - allows setting member's teams from member page)
- [ ] T052 Test complete content creation workflow following recommended order: venues → members → teams → events → results → posts
- [x] T053 [P] Update IMPLEMENTATION_STATUS.md to mark feature 004 as complete
- [x] T054 [P] Update .github/copilot-instructions.md to include content reference picker patterns and relation widget usage
- [x] T055 Review all archetypes in `archetypes/` directory to ensure they align with CMS config relation widgets
- [ ] T056 [P] Add helpful error messages in templates when references are missing (graceful degradation option in addition to strict validation)
- [x] T057 Verify Hugo build succeeds with all example content and reference validation works correctly
- [ ] T058 [P] Create CMS user guide screenshot placeholders in quickstart.md (annotate where screenshots should go)
- [ ] T059 Test CMS with empty collections to verify helpful hint text appears ("No members available - create a member first")
- [ ] T060 Final validation: Create one piece of content from each collection using only the CMS (no manual file editing) to verify end-to-end workflow

**Checkpoint**: Feature complete, documented, tested end-to-end via CMS

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - Can proceed in parallel if team capacity allows
  - Or sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P2) → US4 (P2) → US5 (P3)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Team Coach Selection)**: Can start after Phase 2 - No dependencies on other stories
- **US2 (Event-to-Team Reference)**: Can start after Phase 2 - No dependencies on other stories (independent testable)
- **US3 (Result-to-Event Reference)**: Can start after Phase 2 - May display events from US2 but independently testable
- **US4 (Post Author Selection)**: Can start after Phase 2 - No dependencies on other stories (independent testable)
- **US5 (Venue Selection)**: Can start after Phase 2 - Venues migrated in Phase 2, independently testable

### Within Each User Story

1. Update CMS config with relation widget configurations
2. Update archetypes to match new field formats
3. Update templates to resolve references via `.Site.GetPage`
4. Add validation in list templates
5. Create example content demonstrating the feature
6. Update quickstart documentation

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks marked [P] can run in parallel (T003, T004)

**Phase 2 (Foundational)**: Tasks T007 and T008 can run in parallel after T005 and T006 complete

**Phase 3 (US1)**: Task T010 can run in parallel with T012, followed by other sequential tasks

**Phase 4 (US2)**: Tasks T017 and T020 can run in parallel, followed by T018 and T019 in parallel

**Phase 5 (US3)**: Tasks T025 and T028 can run in parallel

**Phase 6 (US4)**: Tasks T034, T035, T036 can run in parallel

**Phase 7 (US5)**: Tasks T042, T043, T044, T045 can run in parallel

**Phase 8 (Polish)**: Tasks T050, T051, T053, T054, T055, T056, T058 can all run in parallel

**Cross-Story Parallelization**: After Phase 2 completes, different team members can work on different user stories simultaneously:

- Developer A: US1 (Phase 3)
- Developer B: US2 (Phase 4)
- Developer C: US3 (Phase 5)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Sequential dependencies:
Task T005: "Migrate venues from data file to content collection"
Task T006: "Create reference validation partial"

# Then these can run in parallel:
Task T007: "Update team templates for venue references"
Task T008: "Update event templates for venue references"
```

---

## Parallel Example: User Story 1

```bash
# These tasks can run in parallel initially:
Task T010: "Update members collection in CMS config"
Task T012: "Update team archetype"

# Then proceed sequentially:
Task T011: "Add coaches relation widget to teams collection"
Task T013: "Update team single template"
Task T014: "Add validation in team list template"
Task T015: "Create example team content"
Task T016: "Update quickstart documentation"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only - Both P1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Team Coach Selection)
4. Complete Phase 4: User Story 2 (Event-to-Team Reference)
5. **STOP and VALIDATE**: Test US1 and US2 independently via CMS
6. Deploy/demo if ready - core relationships now work via dropdowns

**Why This is MVP**: US1 and US2 are both P1 priority and cover the most common use cases (teams need coaches, events need teams). These two stories eliminate manual path entry for the majority of content creation workflows.

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Venues migrated, validation ready
2. **MVP** (Phases 3-4) → Team coaches + event teams via dropdowns → Deploy/Demo
3. **Results Enhancement** (Phase 5) → Results link to events → Deploy/Demo
4. **Author Attribution** (Phase 6) → Posts link to member authors → Deploy/Demo
5. **Complete Venues** (Phase 7) → All venue selections via dropdowns → Deploy/Demo
6. **Polish** (Phase 8) → Refinements and final validation → Production ready

### Parallel Team Strategy

With multiple developers (after Phase 2 completes):

1. **Developer A**: US1 (Team Coach Selection - Phase 3)
2. **Developer B**: US2 (Event-to-Team Reference - Phase 4)
3. **Developer C**: US3 (Result-to-Event Reference - Phase 5)

All three can work simultaneously since they modify different collections and templates.

---

## Validation Checklist

### CMS Configuration Validation

- [ ] All relation widgets have proper `collection`, `search_fields`, `value_field`, `display_fields`
- [ ] All relation widgets include helpful `hint` text for empty collections
- [ ] Multiple selection fields have `multiple: true` configured
- [ ] Required fields have `required: true` or `min: 1` for arrays
- [ ] Display fields use template format: `["{{title}} ({{context}})"]` for clarity

### Content Validation

- [ ] All example content includes valid references (no broken links)
- [ ] Archetypes match CMS config field names and formats
- [ ] Team coaches use array format: `coaches: ["members/jane-doe"]`
- [ ] Event teams require at least one team (`min: 1`)
- [ ] Post authors are required fields

### Template Validation

- [ ] All templates use `.Site.GetPage` for content references (not `.Site.Data`)
- [ ] All templates include `{{ with }}` error handling for missing references
- [ ] Validation partial is called in list templates
- [ ] Templates display helpful error messages when references are broken
- [ ] Bidirectional relationships work (e.g., events display on team pages)

### Build Validation

- [ ] Hugo build succeeds with all example content
- [ ] Hugo build fails gracefully with clear error messages for broken references
- [ ] Reference validation partial correctly identifies missing content
- [ ] All venue references resolve via `.Site.GetPage` (not data file lookups)

### End-to-End CMS Workflow

- [ ] Can create venue via CMS
- [ ] Can create member via CMS
- [ ] Can create team via CMS and select coaches from dropdown
- [ ] Can create event via CMS and select teams + venue from dropdowns
- [ ] Can create result via CMS and optionally select event from dropdown
- [ ] Can create post via CMS and select author from dropdown
- [ ] Empty collections show helpful hint text
- [ ] Search/filter works in all relation dropdowns
- [ ] Multiple selections work correctly
- [ ] Saved content has correct front matter format with content paths

---

## Notes

- All tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description`
- [P] indicates tasks that can run in parallel (different files, no dependencies)
- [Story] labels map tasks to user stories for traceability
- Each user story is independently completable and testable via CMS
- Tests are not required - manual CMS testing and Hugo build validation are sufficient
- Commit after each task or logical group of parallel tasks
- Stop at any checkpoint to validate story independently via CMS
- **Critical**: Phase 2 (Foundational) must complete before any user story work begins

---

## Success Metrics

After implementation, the following should be true:

- ✅ 0% of coach fields require manual path entry (100% dropdown selection)
- ✅ 0% of build failures due to invalid content references (CMS validation + Hugo validation)
- ✅ 100% of relation dropdowns appear within 2 seconds (Sveltia CMS GraphQL performance)
- ✅ All reference fields searchable and filterable
- ✅ All archetypes updated to use relation widget field formats
- ✅ Documentation complete with workflow guides for each user story
- ✅ Content creation workflow validated end-to-end via CMS (venues → members → teams → events → results → posts)
