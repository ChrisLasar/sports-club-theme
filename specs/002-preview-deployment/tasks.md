# Tasks: Live Preview Deployment System

**Input**: Design documents from `/specs/002-preview-deployment/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification - focusing on implementation and manual verification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize GitHub Pages and workflow infrastructure

- [ ] T001 Create gh-pages branch as orphan branch with initial README.md
- [ ] T002 Configure GitHub Pages in repository settings to use gh-pages branch (root directory)
- [ ] T003 Configure repository permissions for GitHub Actions (read/write contents, pages deployment)
- [ ] T004 Create .github/workflows/ directory if it doesn't exist
- [ ] T005 Pin Hugo version and Node.js version in workflow environment variables (Hugo 0.152.0, Node 22.x)

**Checkpoint**: GitHub Pages and Actions infrastructure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core workflow files that MUST be complete before ANY user story deployment can work

**⚠️ CRITICAL**: No preview deployments can work until these workflows are in place

- [ ] T006 Create base workflow structure with common setup steps (checkout, Node.js, Hugo installation)
- [ ] T007 Configure GitHub Actions cache for Hugo resource cache with branch-specific keys
- [ ] T008 [P] Configure npm dependency caching in workflow setup steps
- [ ] T009 Add git configuration for github-actions[bot] user in workflow steps
- [ ] T010 Create bash script for branch name sanitization (convert special chars to hyphens)
- [ ] T011 Create bash script for preview metadata JSON generation (.preview-meta.json)
- [ ] T012 Create bash script for preview index generation (HTML + JSON at /preview/)

**Checkpoint**: Foundation ready - user story workflows can now be implemented

---

## Phase 3: User Story 1 - View Main Branch Preview (Priority: P1) 🎯 MVP

**Goal**: Deploy main branch to GitHub Pages root so developers and stakeholders can view the current production state

**Independent Test**: Push a commit to main branch, verify https://username.github.io/repo-name/ updates within 5 minutes with the latest changes

### Implementation for User Story 1

- [ ] T013 [US1] Create .github/workflows/deploy-main.yml workflow file
- [ ] T014 [US1] Configure workflow trigger for push to main branch in deploy-main.yml
- [ ] T015 [US1] Add concurrency control to deploy-main.yml (group: deploy-main, cancel-in-progress: false)
- [ ] T016 [US1] Add checkout step with full git history (fetch-depth: 0) in deploy-main.yml
- [ ] T017 [US1] Add Node.js setup and npm install steps in deploy-main.yml
- [ ] T018 [US1] Add Hugo setup step using peaceiris/actions-hugo@v3 in deploy-main.yml
- [ ] T019 [US1] Add Hugo cache restore step with key pattern "hugo-main-" in deploy-main.yml
- [ ] T020 [US1] Add Hugo build step with baseURL set to GitHub Pages URL and environment=production in deploy-main.yml
- [ ] T021 [US1] Add step to generate deployment metadata JSON in public/.meta/ directory
- [ ] T022 [US1] Add step to checkout gh-pages branch to separate directory
- [ ] T023 [US1] Add step to clear root of gh-pages (preserving preview/ directory) in deploy-main.yml
- [ ] T024 [US1] Add step to copy built site from public/ to gh-pages root in deploy-main.yml
- [ ] T025 [US1] Add step to ensure .nojekyll file exists in gh-pages root
- [ ] T026 [US1] Add step to commit and push changes to gh-pages branch in deploy-main.yml
- [ ] T027 [US1] Add step to regenerate preview index after main deployment in deploy-main.yml
- [ ] T028 [US1] Add workflow summary step showing deployment URL and commit hash
- [ ] T029 [US1] Add Hugo cache save step after successful build in deploy-main.yml
- [ ] T030 [US1] Test main branch deployment by pushing a commit and verifying live preview

**Checkpoint**: Main branch deploys to root of GitHub Pages on every push

---

## Phase 4: User Story 2 - View Feature Branch Preview (Priority: P1) 🎯 MVP

**Goal**: Deploy feature branches to unique preview URLs so developers can evaluate and share work-in-progress

**Independent Test**: Create a feature branch, push changes, verify https://username.github.io/repo-name/preview/branch-name/ is created and updates on subsequent pushes

### Implementation for User Story 2

- [ ] T031 [US2] Create .github/workflows/deploy-preview.yml workflow file
- [ ] T032 [US2] Configure workflow trigger for push to all branches except main in deploy-preview.yml
- [ ] T033 [US2] Add concurrency control to deploy-preview.yml (group: deploy-preview-${{branch}}, cancel-in-progress: true)
- [ ] T034 [US2] Add branch name sanitization step in deploy-preview.yml using bash script
- [ ] T035 [US2] Add checkout, Node.js, and Hugo setup steps in deploy-preview.yml
- [ ] T036 [US2] Add Hugo cache restore with branch-specific keys in deploy-preview.yml
- [ ] T037 [US2] Add Hugo build step with baseURL=/preview/{sanitized-branch}/ and environment=preview in deploy-preview.yml
- [ ] T038 [US2] Add continue-on-error to Hugo build step in deploy-preview.yml
- [ ] T039 [US2] Add conditional step to generate success metadata when build succeeds in deploy-preview.yml
- [ ] T040 [US2] Add conditional step to generate error metadata and error.html page when build fails in deploy-preview.yml
- [ ] T041 [US2] Create error page template with build failure details, workflow log links, and commit info
- [ ] T042 [US2] Add step to checkout gh-pages branch in deploy-preview.yml
- [ ] T043 [US2] Add step to create/clear preview/{sanitized-branch}/ directory in deploy-preview.yml
- [ ] T044 [US2] Add step to copy built site or error page to preview directory in deploy-preview.yml
- [ ] T045 [US2] Add step to commit and push preview to gh-pages branch in deploy-preview.yml
- [ ] T046 [US2] Add step to regenerate preview index after feature deployment in deploy-preview.yml
- [ ] T047 [US2] Add workflow summary showing preview URL or error page URL
- [ ] T048 [US2] Add Hugo cache save step for successful builds in deploy-preview.yml
- [ ] T049 [US2] Add --buildDrafts and --buildFuture flags to Hugo build command in deploy-preview.yml
- [ ] T050 [US2] Test feature branch deployment by creating a branch and verifying preview URL
- [ ] T051 [US2] Test build failure handling by pushing invalid Hugo content and verifying error page

**Checkpoint**: Feature branches deploy to /preview/{branch-name}/ with error handling

---

## Phase 5: User Story 3 - Quick Access to Preview URLs (Priority: P2)

**Goal**: Provide an auto-generated index page listing all active preview URLs for easy navigation

**Independent Test**: Visit /preview/ URL and verify it shows a list of all active previews with working links

### Implementation for User Story 3

- [ ] T052 [US3] Create preview index HTML template in bash script with daisyUI styling
- [ ] T053 [US3] Add preview list JSON generation script that reads all .preview-meta.json files
- [ ] T054 [US3] Implement JSON aggregation logic to create .preview-list.json with all preview metadata
- [ ] T055 [US3] Add JavaScript to preview index HTML to fetch and display .preview-list.json
- [ ] T056 [US3] Style preview cards with success/error states using daisyUI components
- [ ] T057 [US3] Add preview metadata display (branch name, commit message, author, timestamp)
- [ ] T058 [US3] Add action buttons for each preview (View Preview / View Error, View Commit)
- [ ] T059 [US3] Add sort logic to show newest previews first in the index
- [ ] T060 [US3] Handle empty state when no previews exist
- [ ] T061 [US3] Replace repository placeholder with actual ${{github.repository}} in index generation
- [ ] T062 [US3] Integrate preview index generation into deploy-main.yml workflow
- [ ] T063 [US3] Integrate preview index generation into deploy-preview.yml workflow
- [ ] T064 [US3] Test preview index by deploying multiple branches and verifying index shows all

**Checkpoint**: Preview index at /preview/ lists all active feature branch previews

---

## Phase 6: User Story 4 - Fast Deployment Times (Priority: P2)

**Goal**: Optimize deployment speed through caching to enable rapid iteration

**Independent Test**: Push small content change, measure deployment time from push to live preview, verify <3 minutes

### Implementation for User Story 4

- [ ] T065 [US4] Configure Hugo cache path to use ${{runner.temp}}/hugo_cache in all workflows
- [ ] T066 [US4] Set HUGO_CACHEDIR environment variable in Hugo build steps
- [ ] T067 [US4] Implement cache key strategy with run_id primary and branch fallback
- [ ] T068 [US4] Add npm cache configuration using actions/setup-node cache parameter
- [ ] T069 [US4] Optimize Hugo build flags (--minify, --gc for garbage collection)
- [ ] T070 [US4] Add build duration tracking in preview metadata JSON
- [ ] T071 [US4] Test cache effectiveness by deploying twice and comparing build times
- [ ] T072 [US4] Verify cache hit rates in GitHub Actions logs
- [ ] T073 [US4] Document expected build times in quickstart.md (first: 3-5min, cached: 1-2min)

**Checkpoint**: Deployments complete in <2 minutes for cached builds, <5 minutes for fresh builds

---

## Phase 7: User Story 5 - Preview Cleanup (Priority: P3)

**Goal**: Automatically remove preview deployments when branches are deleted to save resources

**Independent Test**: Delete a feature branch, verify its preview directory is removed from gh-pages and no longer appears in preview index

### Implementation for User Story 5

- [ ] T074 [US5] Create .github/workflows/cleanup-preview.yml workflow file
- [ ] T075 [US5] Configure workflow trigger for delete event in cleanup-preview.yml
- [ ] T076 [US5] Add conditional to only run on branch deletions (not tag deletions)
- [ ] T077 [US5] Add branch name sanitization step in cleanup-preview.yml
- [ ] T078 [US5] Add step to checkout gh-pages branch in cleanup-preview.yml
- [ ] T079 [US5] Add step to check if preview/{sanitized-branch}/ directory exists
- [ ] T080 [US5] Add step to remove preview directory from gh-pages branch
- [ ] T081 [US5] Add step to commit and push removal to gh-pages
- [ ] T082 [US5] Add step to regenerate preview index after cleanup
- [ ] T083 [US5] Add workflow summary showing cleanup details
- [ ] T084 [US5] Test cleanup by creating and deleting a feature branch
- [ ] T085 [US5] Verify deleted branch no longer appears in preview index

**Checkpoint**: Branch deletions trigger automatic preview cleanup

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final improvements

- [ ] T086 [P] Update quickstart.md with setup instructions (gh-pages branch, workflows, permissions)
- [ ] T087 [P] Add usage examples to quickstart.md (deploy main, create preview, view index)
- [ ] T088 [P] Document troubleshooting steps in quickstart.md (build failures, cache issues)
- [ ] T089 [P] Add URL reference table to quickstart.md (all URL patterns)
- [ ] T090 [P] Document workflow behavior and concurrency control in quickstart.md
- [ ] T091 Update .github/copilot-instructions.md with preview deployment context (already done by update-agent-context.sh)
- [ ] T092 Create workflow badge examples for README.md
- [ ] T093 Add example of checking preview metadata via API in quickstart.md
- [ ] T094 Document BASE_URL configuration requirement in quickstart.md
- [ ] T095 Add section on branch naming best practices to quickstart.md
- [ ] T096 Verify all workflow files use consistent Hugo/Node versions
- [ ] T097 Test complete workflow from clean repository clone
- [ ] T098 Validate preview index displays correctly on mobile devices
- [ ] T099 Review all error messages for clarity and helpfulness
- [ ] T100 Add comments to workflow files explaining key decisions

**Checkpoint**: All documentation complete and deployment system fully operational

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - Can start after Phase 2
- **User Story 2 (Phase 4)**: Depends on Foundational phase - Can start after Phase 2 (parallel with US1)
- **User Story 3 (Phase 5)**: Depends on US2 completion (needs preview metadata structure)
- **User Story 4 (Phase 6)**: Depends on US1 and US2 (optimizes existing workflows)
- **User Story 5 (Phase 7)**: Depends on US2 completion (needs preview directory structure)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Only needs Foundational phase ✅
- **User Story 2 (P1)**: Independent - Only needs Foundational phase ✅
- **User Story 3 (P2)**: Depends on US2 (reads preview metadata from deployments)
- **User Story 4 (P2)**: Depends on US1 and US2 (optimizes their workflows)
- **User Story 5 (P3)**: Depends on US2 (cleans up preview directories)

### Within Each User Story

- User Story 1: Sequential implementation (workflow setup → build → deploy → test)
- User Story 2: Sequential implementation (workflow setup → build with error handling → deploy → test both success and failure)
- User Story 3: Sequential implementation (HTML template → JSON aggregation → JavaScript rendering → integration)
- User Story 4: Can parallelize cache configuration tasks across workflows
- User Story 5: Sequential implementation (workflow setup → cleanup logic → test)

### Parallel Opportunities

**Setup Phase**: Tasks T001-T005 are mostly sequential (each builds on previous)

**Foundational Phase**: 
- T007 (Hugo cache) and T008 (npm cache) can run in parallel [P]
- Scripts T010, T011, T012 can be developed in parallel [P]

**User Story 1 & 2**: Can be developed in parallel by different team members after Phase 2 completes
- T013-T030 (US1 main branch workflow)
- T031-T051 (US2 feature branch workflow)

**User Story 3**: Sequential after US2

**User Story 4**: Cache optimizations can be applied to both workflows in parallel
- T065-T069 workflow modifications can happen simultaneously

**User Story 5**: Sequential after US2

**Polish Phase**: Most documentation tasks (T086-T100) can run in parallel [P]

---

## Parallel Example: Foundational Phase

If you have 2 developers, you can parallelize Phase 2:

**Developer A**:
```bash
# Hugo and npm caching
git checkout -b foundational/caching
# T007: Configure Hugo cache
# T008: Configure npm cache
```

**Developer B**:
```bash
# Helper scripts
git checkout -b foundational/scripts
# T010: Branch sanitization script
# T011: Metadata generation script
# T012: Preview index generation script
```

Then merge both branches to complete Phase 2.

---

## Parallel Example: User Story 1 & 2

Once Foundational phase is complete, work on both MVP user stories simultaneously:

**Developer A (Main Branch Deployment)**:
```bash
git checkout -b us1-main-branch-deploy
# Complete all T013-T030 tasks
# Test by pushing to main
```

**Developer B (Feature Branch Deployment)**:
```bash
git checkout -b us2-feature-branch-deploy
# Complete all T031-T051 tasks
# Test by creating feature branch
```

Both can work independently and deliver simultaneously.

---

## MVP Definition

**Minimum Viable Product**: User Stories 1 and 2 (both P1)

This delivers:
- ✅ Main branch deploys to root GitHub Pages URL
- ✅ Feature branches deploy to /preview/{branch-name}/ URLs
- ✅ Error handling for failed builds
- ✅ Automatic updates on new commits
- ✅ Concurrency control and cancellation

With just US1 and US2, developers can:
- View latest main branch state online
- Create feature branch previews for evaluation
- Share preview URLs with stakeholders
- Iterate rapidly with automatic updates

**Post-MVP Enhancements**:
- US3 (P2): Preview index for easy navigation (nice to have)
- US4 (P2): Build caching for faster deployments (performance optimization)
- US5 (P3): Automatic cleanup (maintenance feature)

---

## Implementation Strategy

1. **Week 1**: Complete Setup and Foundational phases (T001-T012)
   - Establish infrastructure
   - Create helper scripts
   - No preview deployments yet, but foundation is ready

2. **Week 2**: Implement MVP (US1 + US2) (T013-T051)
   - Can parallelize with 2 developers
   - Both workflows complete and tested
   - System is functional for core use cases

3. **Week 3**: Add preview index (US3) (T052-T064)
   - Improves user experience
   - Easier to navigate between previews

4. **Week 4**: Optimize performance (US4) and add cleanup (US5) (T065-T085)
   - Build times improve with caching
   - Automatic cleanup prevents bloat

5. **Week 5**: Polish and documentation (T086-T100)
   - Complete documentation
   - Final validation and testing

**Total Estimated Effort**: 100 tasks across 5 weeks (20 tasks/week average)

**Critical Path**: Setup → Foundational → US1/US2 → US3 → US4/US5 → Polish

**Risk Mitigation**: 
- US1 and US2 are independent and can proceed in parallel
- If time is limited, ship MVP (US1+US2) first
- US3-US5 can be added incrementally in later releases

---

## Task Summary

**Total Tasks**: 100

**By Phase**:
- Setup: 5 tasks
- Foundational: 7 tasks
- User Story 1 (P1): 18 tasks
- User Story 2 (P1): 21 tasks
- User Story 3 (P2): 13 tasks
- User Story 4 (P2): 9 tasks
- User Story 5 (P3): 12 tasks
- Polish: 15 tasks

**By Priority**:
- P1 (MVP): 39 tasks (US1 + US2)
- P2: 22 tasks (US3 + US4)
- P3: 12 tasks (US5)
- Infrastructure: 27 tasks (Setup + Foundational + Polish)

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel with proper team coordination

**Independent Test Criteria**:
- US1: Push to main, verify root URL updates
- US2: Push to feature branch, verify /preview/{branch}/ URL works
- US3: Visit /preview/, verify index lists all previews
- US4: Measure build times, verify <3 minutes cached
- US5: Delete branch, verify preview removed

**Format Validation**: ✅ All tasks follow required checklist format with [ID] [P?] [Story?] Description and file paths
