# Implementation Plan: Live Preview Deployment System

**Branch**: `002-preview-deployment` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-preview-deployment/spec.md`

## Summary

This feature implements an automated preview deployment system using GitHub Actions and GitHub Pages. The system automatically deploys the main branch to the root of GitHub Pages and deploys each feature branch to a unique subdirectory under `/preview/{branch-name}/`. All deployments are managed through a single `gh-pages` branch with path-based routing. The system includes build caching for performance, concurrency control to cancel outdated deployments, and differentiated error handling (preserving last working build for main, showing error pages for feature branches).

## Technical Context

**Language/Version**: Hugo 0.152+ (Extended edition for Tailwind processing)

**Primary Dependencies**:

- daisyUI 5.x (UI components)
- Tailwind CSS 4.x (styling)
- Alpine.js 3.x (optional progressive enhancement)
- Sveltia CMS (Git-based CMS; Decap CMS documentation as reference)
- Node.js 22.x (for Tailwind processing)
- GitHub Actions (CI/CD automation)

**Storage**: Files only (Markdown + YAML/TOML front matter); page bundles supported for colocated media

**Testing**: HTML/Accessibility lint, Lighthouse; workflow validation

**Target Platform**: GitHub Pages (static hosting)

**Project Type**: Static site generator with CI/CD automation

**Constraints**:

- Fully static output; no login/auth
- Performance: LCP ≤ 2.5s (3G), CLS ≤ 0.1, JS ≤ 50KB gzip
- Mobile-first responsive design
- Privacy by default (no tracking)
- Single gh-pages deployment branch for all previews  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Gate A**: No login/auth dependencies introduced. GitHub Actions uses repository permissions; no user authentication required for viewing previews.
- ✅ **Gate B**: Build is fully static; each preview is a complete static Hugo site with no runtime calls.
- ✅ **Gate C**: Accessibility (AA) for default components. No changes to theme components; deployment infrastructure only.
- ✅ **Gate D**: Performance budgets met on example pages. Deployment process doesn't affect site performance; Hugo build optimization with caching improves build times.
- ✅ **Gate E**: Human-readable content; schemas documented. No changes to content structure; all content remains in Markdown + front matter.
- ✅ **Gate F**: Mobile responsiveness validated. No changes to responsive design; theme remains mobile-first.
- ✅ **Gate G**: Social metadata present (OG, Twitter, canonical). No impact on existing social metadata implementation.
- ✅ **Gate H**: Example content exists and docs updated in parallel. Will create workflow files and update documentation explaining the preview system.

**Status**: All gates pass. This feature is purely infrastructure (CI/CD) and doesn't modify theme, content structure, or user-facing components.

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

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations. All constitution gates pass without exceptions.

---

## Phase 0: Research & Design Decisions

The following research has been conducted to resolve technical unknowns and establish best practices for the deployment system.

### Research Documentation

✅ **COMPLETE** - See [research.md](./research.md)

**Key Decisions**:

1. **Workflow Architecture**: Three separate workflows (deploy-main, deploy-preview, cleanup-preview) with different triggers and concurrency controls
2. **URL Structure**: Path-based routing with main at root, previews under `/preview/{branch-name}/`
3. **Build Caching**: Hugo resource cache + npm dependencies using GitHub Actions cache with branch-specific keys
4. **Concurrency Control**: Main branch no cancellation (queues), feature branches cancel-in-progress
5. **Error Handling**: Main preserves last working build, features deploy error pages
6. **Preview Index**: Auto-generated HTML + JSON at `/preview/` listing all active previews
7. **Branch Cleanup**: Automatic removal on branch deletion with index regeneration
8. **BaseURL Configuration**: Dynamic per deployment via environment variables
9. **Git Workflow**: Single gh-pages branch with subdirectories, `--orphan` initialization
10. **Deployment Strategy**: Direct push to gh-pages branch (no pull requests)

**Full Research**: See [research.md](./research.md) for detailed analysis, alternatives considered, and decision rationale.

---

## Phase 1: Data Model, Contracts & Quickstart

✅ **COMPLETE** - See outputs below

### Data Model

**File**: [data-model.md](./data-model.md)

**Entities Defined**:

1. **Preview Metadata** (`.preview-meta.json`)
   - Fields: branch, commit, commit_message, commit_author, timestamp, build_status, build_duration_seconds, hugo_version, error_message
   - Lifecycle: Created on deployment, read by preview index, deleted on cleanup

2. **Workflow State** (GitHub Actions)
   - Implicit structure from GitHub Actions context
   - Key fields: head_branch, head_sha, status, conclusion

3. **Deployment Directory Structure** (`gh-pages` branch)
   - Root: Main branch content
   - `/preview/`: All feature branch previews
   - `/preview/{branch-name}/`: Individual preview directories

4. **Preview Index Data** (`.preview-list.json`)
   - Aggregated view of all active previews
   - Fields: generated_at, total_previews, previews array

5. **Error Page Data** (HTML with embedded metadata)
   - Displayed when feature branch build fails
   - Links to workflow logs and commit details

6. **GitHub Actions Cache Data**
   - Cache keys: `hugo-{ref_name}-{run_id}`
   - Paths: Hugo resource cache directory
   - Lifecycle: 7-day auto-eviction

**Relationships**: Documented entity relationships and data flow diagrams included in data-model.md.

### Contracts

**Directory**: [contracts/](./contracts/)

**Workflow Files**:

1. **deploy-main.yml**
   - Trigger: Push to `main` branch
   - Concurrency: No cancellation (queues deployments)
   - Behavior: Deploy to root, preserve `/preview/` directory, regenerate preview index
   - Cache: `hugo-main-{run_id}` with fallbacks

2. **deploy-preview.yml**
   - Trigger: Push to any branch except `main`
   - Concurrency: Cancel in-progress for same branch
   - Behavior: Deploy to `/preview/{sanitized-branch}/`, handle build failures with error pages
   - Cache: `hugo-{branch}-{run_id}` with fallbacks
   - Special: Includes drafts and future-dated content

3. **cleanup-preview.yml**
   - Trigger: Branch deletion
   - Behavior: Remove preview directory, regenerate preview index
   - Safety: Only runs for branch deletions (not tags)

**Common Features**:

- All workflows use same Hugo/Node versions
- All generate/update preview metadata
- All use peaceiris/actions-hugo@v3 for Hugo setup
- All configure git with github-actions[bot] identity
- All include step summaries for logging

### Quickstart

**File**: [quickstart.md](./quickstart.md)

**Sections**:

1. **Overview**: System behavior summary
2. **Prerequisites**: Required tools and setup
3. **Setup (One-time)**: gh-pages branch, workflow files, BASE_URL config, GitHub Pages setup, permissions
4. **Usage**: Deploy main, create preview, view all previews, remove preview
5. **Workflow Behavior**: Detailed explanation of each workflow
6. **Build Performance**: Cache strategy and expected build times
7. **Troubleshooting**: Common issues and solutions
8. **URLs Quick Reference**: All URL patterns
9. **Advanced Configuration**: Customization options
10. **Monitoring**: Deployment status and API access
11. **Best Practices**: Branch naming, commit messages, cleanup
12. **Next Steps**: Links to other documentation

---

## Phase 2: Task Breakdown

⚠️ **NOT CREATED** - Use `/speckit.tasks` command separately

This section is intentionally omitted. Task breakdown is a separate workflow step that should be executed via the `/speckit.tasks` command after planning is complete.

The tasks command will:

- Break down implementation into actionable tasks
- Estimate complexity for each task
- Define dependencies and ordering
- Create tasks.md file in feature directory

**Do not create tasks.md manually** - use the dedicated `/speckit.tasks` command.

---

## Summary

**Planning Status**: ✅ Phase 0 and Phase 1 complete

**Documentation Created**:

- [research.md](./research.md) - 10 technical decisions documented
- [data-model.md](./data-model.md) - 6 entities with relationships defined
- [contracts/](./contracts/) - 3 GitHub Actions workflow files
- [quickstart.md](./quickstart.md) - Complete user guide with 12 sections

**Next Steps**:

1. Run `/speckit.tasks` to create task breakdown
2. Begin implementation following tasks.md
3. Update `.github/copilot-instructions.md` using update-agent-context.sh script after deployment

**Constitution Compliance**: All 8 gates pass - this is an infrastructure-only feature with no theme/content changes.
