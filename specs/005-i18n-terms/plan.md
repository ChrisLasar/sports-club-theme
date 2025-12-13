# Implementation Plan: Multilingual UI Terminology

**Branch**: `005-i18n-terms` | **Date**: 2025-12-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-i18n-terms/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. If a commands doc is missing, describe the execution workflow directly here.

## Summary

Implement multilingual support for all hard-coded UI terminology (navigation, section headings, breadcrumbs, footer labels, page titles) across the Hugo sports club theme. Support English, German, and French initially with fallback mechanisms. Allow site maintainers to override individual terms per language via configuration without code changes. Use Hugo's native i18n system with `i18n/` directory for translations and config-based overrides.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Hugo 0.152+ (Extended)  
**Primary Dependencies**: daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS
**Storage**: SSG: files only (Markdown + YAML front matter); page bundles supported; i18n translations in YAML files  
**Testing**: HTML/Accessibility lint, Lighthouse; visual regression testing for UI labels
**Target Platform**: Static Web Hosting, CDN
**Project Type**: web (static site generator theme)  
**Constraints**: fully static output; no login; LCP ≤ 2.5s (3G), CLS ≤ 0.1; JS ≤ 50KB gzip; mobile-first; privacy by default; no runtime language switching in MVP  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Initial Assessment**: ✅ All gates pass

- **Gate A** (No login/auth): ✅ PASS - i18n is build-time only, no authentication required
- **Gate B** (Fully static): ✅ PASS - Hugo's i18n is build-time; no runtime calls
- **Gate C** (Accessibility AA): ✅ PASS - Translated labels maintain accessibility; aria-labels updated
- **Gate D** (Performance budgets): ✅ PASS - No JavaScript added; translations compiled at build time; 0 KB JS impact
- **Gate E** (Human-readable content): ✅ PASS - i18n files are YAML; easily readable and editable
- **Gate F** (Mobile responsiveness): ✅ PASS - No layout changes; existing responsive design maintained
- **Gate G** (Social metadata): ✅ PASS - Translated page titles reflect in metadata
- **Gate H** (Example content & docs): ✅ PASS - Will provide example translations and configuration guide

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

**N/A** - No constitution violations; all gates pass.

---

## Phase 0: Research (Complete ✅)

**Status**: Complete - 2025-12-13  
**Output**: [research.md](research.md)

### Key Decisions

1. **Approach**: Hybrid system using Hugo's native i18n + config parameter overrides
2. **Translation Storage**: YAML files in `i18n/` directory (en.yaml, de.yaml, fr.yaml)
3. **Override Mechanism**: Language-specific params in `config/_default/hugo.toml`
4. **Helper Partial**: `i18n-term.html` implements fallback chain
5. **Fallback Chain**: Config override → i18n file → Default language → Key itself

### Research Findings

- **Hugo i18n system** is fully build-time, no JavaScript required (0 KB impact)
- **Config-based overrides** allow users to customize terms without editing theme files
- **Safe fallbacks** ensure templates never break even with missing translations
- **Backwards compatible** with single-language sites (no breaking changes)
- **Performance**: Negligible build time increase (<100ms for 3 languages)

### Alternatives Rejected

- ❌ Data files only (no fallback mechanism)
- ❌ Front matter per page (unmaintainable at scale)
- ❌ JavaScript-based i18n (violates static requirement)
- ❌ Params only (error-prone, no fallbacks)

---

## Phase 1: Design & Contracts (Complete ✅)

**Status**: Complete - 2025-12-13  
**Outputs**: 
- [data-model.md](data-model.md)
- [contracts/i18n-term-partial.md](contracts/i18n-term-partial.md)
- [quickstart.md](quickstart.md)
- Agent context updated ([.github/copilot-instructions.md](../../.github/copilot-instructions.md))

### Data Model Summary

**Entities**:

1. **Language** - Locale configuration in `hugo.toml`
   - Properties: languageCode, languageName, title, weight, params
   - Three languages: English (en), German (de), French (fr)

2. **TranslationTerm** - Default UI label in `i18n/*.yaml`
   - Properties: key (snake_case), value (translated string)
   - ~50-60 terms for MVP coverage

3. **TermOverride** - User customization in config params
   - Properties: key (matches i18n key), custom value
   - Optional per language

**Fallback Flow**:
```
Config Override → Current Language i18n → Default Language i18n → Key Itself
```

### Contract Summary

**Template Partial**: `i18n-term.html`

**Interface**:
```go
Input:  dict { "key": string, "context": any, "count": int }
Output: string (translated/overridden term)
```

**Usage**:
```html
{{ partial "i18n-term.html" (dict "key" "teams") }}
```

**Behavior**:
- Checks config override first
- Falls back to i18n files
- Never breaks (returns key if all missing)
- Supports interpolation and pluralization

### Configuration Schema

```toml
[languages.en]
  languageCode = "en-US"
  languageName = "English"
  title = "Sports Club"
  [languages.en.params]
    terms.news = "Blog"  # Optional overrides
```

### Translation File Schema

```yaml
# i18n/en.yaml
home: "Home"
teams: "Teams"
news: "News"
teams_heading: "Teams"
read_more: "Read More"
skip_to_content: "Skip to content"
```

### UI Coverage Scope

- ✅ Navigation (6 items)
- ✅ Section headings (~10 items)
- ✅ Actions/CTAs (~10 items)
- ✅ Accessibility labels (~6 items)
- ✅ Status/state terms (~8 items)
- ✅ Filters/sorting (~8 items)
- ✅ Empty states (~4 items)

**Total**: ~50-60 translation keys × 3 languages = ~150-180 translations

---

## Constitution Re-Check (Post-Design)

**Status**: ✅ All gates still pass after Phase 1 design

- **Gate A** (No login/auth): ✅ PASS - Design is fully file-based
- **Gate B** (Fully static): ✅ PASS - No runtime dependencies introduced
- **Gate C** (Accessibility AA): ✅ PASS - Aria-labels and skip links translated
- **Gate D** (Performance budgets): ✅ PASS - 0 KB JS, ~50-100ms build time increase
- **Gate E** (Human-readable content): ✅ PASS - YAML files remain human-editable
- **Gate F** (Mobile responsiveness): ✅ PASS - No layout changes
- **Gate G** (Social metadata): ✅ PASS - Page titles use translated terms
- **Gate H** (Example content & docs): ✅ PASS - Quickstart guide complete

**No violations introduced during design phase.**

---

## Next Steps

This plan document is now complete through Phase 1. The next phase (Phase 2: Tasks) will be handled by a separate command:

```bash
/speckit.tasks
```

That command will generate:
- `specs/005-i18n-terms/tasks.md` - Detailed implementation tasks
- Task breakdown for actual coding work

**Current Status**: Ready for implementation ✅
