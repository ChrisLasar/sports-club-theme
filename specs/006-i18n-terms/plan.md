# Implementation Plan: Localization & Multilingual Content

**Branch**: `006-i18n-terms` | **Date**: 2025-12-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-i18n-terms/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. If a commands doc is missing, describe the execution workflow directly here.

## Summary

This feature implements Hugo's multilingual capabilities to support German, English, and French interface languages with customizable UI terms. The theme will use Hugo's native i18n system with translation files, allowing operators to override labels via configuration without editing templates. Content can be selectively translated using Hugo's translation by filename approach, with automatic fallback to the default language for untranslated pages.

## Technical Context

**Language/Version**: Hugo 0.152+ (Extended)  
**Primary Dependencies**: Hugo i18n system, daisyUI 5.x, Tailwind CSS 4.x, Alpine.js (optional)
**Storage**:

- i18n translation files in `/i18n/` directory (TOML/YAML format)
- Content using translation by filename (e.g., `post.md`, `post.de.md`, `post.fr.md`)
- Language configuration in `hugo.toml`
**Multilingual Mode**: Translation by filename (not separate content directories)
**URL Structure**: Language prefix in URL (e.g., `/de/...`, `/fr/...`, default language at root or `/en/...`)
**Testing**: HTML/Accessibility lint, Lighthouse; multilingual navigation validation
**Target Platform**: Static Web Hosting, CDN
**Project Type**: Static Website (Hugo SSG)
**Constraints**: fully static output; no login; LCP ≤ 2.5s (3G), CLS ≤ 0.1; JS ≤ 50KB gzip; mobile-first; privacy by default

**Key Technical Decisions**:

- **Translation by filename**: Pages use suffixes (e.g., `_index.de.md`) rather than separate directories
- **Default language**: English (en) with German (de) and French (fr) as additional languages
- **Fallback behavior**: Hugo automatically serves default language content when translation missing
- **Internal links**: Use `.RelPermalink` or `.Permalink` to maintain language context
- **Language switching**: Navigation must link to same-page translations using `.Translations` method
- **Term overrides**: Use Hugo params in language-specific config for custom labels  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Initial Assessment** (Pre-Phase 0):

- ✅ **Gate A**: No login/auth dependencies introduced - Hugo i18n is build-time only
- ✅ **Gate B**: Build is fully static - All translation resolution happens at build time
- ✅ **Gate C**: Accessibility (AA) for default components - Language switcher will be keyboard accessible
- ⚠️ **Gate D**: Performance budgets - Need to verify i18n files don't bloat bundle (monitor)
- ✅ **Gate E**: Human-readable content - Translation files are TOML/YAML; content files are Markdown
- ✅ **Gate F**: Mobile responsiveness - Language switcher must be responsive
- ✅ **Gate G**: Social metadata - Must ensure lang attributes and hreflang links present
- ✅ **Gate H**: Example content - Will provide translated example pages and documentation

**Complexity Justification**: None required - Hugo's built-in i18n system aligns with Constitution principles.

**Post-Phase 1 Re-assessment**:

All gates remain passing after design phase:

- ✅ **Gate A**: No login/auth - i18n is pure build-time configuration
- ✅ **Gate B**: Fully static - All translations resolved during build
- ✅ **Gate C**: Accessibility - Language switcher designed with ARIA labels, keyboard navigation
- ✅ **Gate D**: Performance - i18n files add ~5KB total, zero runtime cost
- ✅ **Gate E**: Human-readable - TOML i18n files and Markdown content
- ✅ **Gate F**: Mobile responsive - Language switcher has mobile breakpoints
- ✅ **Gate G**: Social metadata - Lang attributes and hreflang links specified
- ✅ **Gate H**: Examples provided - Quickstart with complete working examples

**Final Assessment**: Feature fully complies with Constitution. No violations or complexity overrides required.

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

**Status**: No violations - No complexity tracking required.

This feature uses only Hugo's built-in i18n system with no additional complexity.

## Phase 1 Completion Summary

### Artifacts Generated

#### Research (Phase 0)
- ✅ `research.md` - Comprehensive research covering all technical decisions
  - Translation by filename vs. separate directories
  - URL structure and language prefixes
  - i18n system implementation
  - Label override mechanism
  - Link handling and language switching
  - SEO metadata requirements
  - Best practices and common pitfalls

#### Design (Phase 1)
- ✅ `data-model.md` - Complete data structure specification
  - Language configuration schema
  - Translation file formats (en, de, fr)
  - Content translation patterns
  - Menu configuration
  - Template access patterns
  - Validation rules and constraints
  - Working examples

- ✅ `contracts/i18n-function.md` - Template function specification
  - Function signatures and usage patterns
  - Pluralization and parameterization
  - Fallback behavior
  - Integration with label overrides
  - Date/time formatting
  - Error handling
  - Performance considerations

- ✅ `contracts/language-switcher.md` - Component specification
  - Functional requirements
  - HTML structure and semantics
  - Accessibility requirements (ARIA, keyboard nav)
  - Styling guidelines
  - Integration points
  - Multiple variants (inline, dropdown, with flags)
  - Testing requirements

- ✅ `quickstart.md` - End-user documentation
  - Step-by-step setup (15-20 min)
  - Configuration examples
  - Content translation workflow
  - Label customization
  - Troubleshooting guide
  - Common tasks reference

### Key Technical Decisions

1. **Multilingual Mode**: Translation by filename (not separate content directories)
   - Enables partial translations more naturally
   - Simpler mental model for editors
   - Automatic fallback to default language

2. **URL Structure**: Language prefix in path (`/de/...`, `/fr/...`)
   - SEO-friendly
   - Shareable URLs
   - Configurable default language position

3. **UI Translation**: Hugo i18n system with TOML files
   - Build-time resolution (zero runtime cost)
   - Three translation files: `i18n/en.toml`, `i18n/de.toml`, `i18n/fr.toml`
   - Operator overrides via `params.labels` in config

4. **Link Handling**: Use Hugo methods (`.RelPermalink`, `.Permalink`)
   - Language-aware URLs automatically
   - No manual URL construction needed

5. **Language Switcher**: Semantic HTML partial with ARIA
   - No JavaScript required
   - Fully keyboard accessible
   - Shows available translations only

### Implementation Scope

#### In Scope (Phase 2 - Implementation)
- Hugo configuration for three languages
- i18n translation files with ~30 common keys each
- Language switcher partial component
- Updated templates to use `i18n` function
- Head partial with lang attributes and hreflang links
- Example translated content
- CMS configuration for multilingual content
- Documentation for operators and editors

#### Out of Scope
- Automated machine translation
- Language detection/preference storage
- Complex pluralization beyond Hugo's built-in support
- Language-specific themes or layouts
- Translation management tools/workflows
- Content translation services integration

### Next Steps (Phase 2)

Phase 2 implementation tasks will be generated by running:
```bash
specify tasks
```

This will create detailed implementation tasks for:
1. Hugo configuration updates
2. i18n file creation
3. Template modifications
4. Partial component development
5. CMS configuration
6. Example content creation
7. Documentation finalization
8. Testing procedures

### Validation Criteria

Before moving to Phase 2, verify:
- [x] All research questions answered with decisions
- [x] Data model covers all configuration and content patterns
- [x] Contracts specify template and component behavior
- [x] Quickstart provides working end-to-end example
- [x] Constitution gates all passing
- [x] No unresolved technical questions
