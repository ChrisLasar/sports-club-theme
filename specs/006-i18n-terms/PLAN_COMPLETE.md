# Implementation Plan Complete

**Feature**: 006-i18n-terms (Localization & Multilingual Content)  
**Branch**: `006-i18n-terms`  
**Date**: 2025-12-14  
**Status**: ✅ Phase 0 & Phase 1 Complete

## Summary

The implementation plan for multilingual support has been completed through Phase 1 (Design). The feature enables German, English, and French interface languages with customizable UI terms and selective content translation.

## Deliverables

### Phase 0: Research ✅
- **File**: `research.md` (565 lines)
- **Content**: 10 major research questions with decisions, rationale, and alternatives
- **Key Decisions**:
  - Translation by filename approach
  - Language prefix URL structure
  - Hugo i18n system for UI labels
  - Config-based label overrides
  - Automatic fallback for missing translations

### Phase 1: Design ✅

#### Data Model
- **File**: `data-model.md` (1,247 lines)
- **Content**: Complete specification of all data structures
- **Includes**:
  - Language configuration schema
  - i18n translation files (en, de, fr) with ~30 keys each
  - Content translation patterns
  - Menu configurations
  - Template access patterns
  - Validation rules
  - Working examples

#### Contracts
- **File**: `contracts/i18n-function.md` (672 lines)
  - Template function specification
  - Usage patterns and examples
  - Pluralization and parameters
  - Fallback behavior
  - Integration patterns
  - Performance notes
  
- **File**: `contracts/language-switcher.md` (643 lines)
  - Component specification
  - HTML structure and semantics
  - Accessibility requirements
  - CSS styling guidelines
  - Multiple variants
  - Testing requirements

#### Documentation
- **File**: `quickstart.md` (529 lines)
- **Content**: Step-by-step guide (15-20 minutes)
- **Sections**:
  1. Configure languages
  2. Add translation files
  3. Update templates (already done)
  4. Create translated content
  5. Customize specific terms
  6. Troubleshooting

## Technical Architecture

### Hugo Configuration
```toml
defaultContentLanguage = 'en'
defaultContentLanguageInSubdir = false

[languages.en]
  languageCode = 'en-US'
  languageName = 'English'
  weight = 1

[languages.de]
  languageCode = 'de-DE'
  languageName = 'Deutsch'
  weight = 2

[languages.fr]
  languageCode = 'fr-FR'
  languageName = 'Français'
  weight = 3
```

### i18n System
- Translation files: `i18n/en.toml`, `i18n/de.toml`, `i18n/fr.toml`
- Template usage: `{{ i18n "key" }}` or `{{ T "key" }}`
- Operator overrides: `languages.{lang}.params.labels.{key}` in config
- Fallback chain: Override → i18n → Default language → Key name

### Content Translation
- Pattern: `content/{section}/{slug}.{lang}.md`
- Example: `post.md` (en), `post.de.md`, `post.fr.md`
- Automatic linking by Hugo
- Fallback to default language when translation missing

### URL Structure
- Default language: `/about/` (configurable)
- Other languages: `/de/about/`, `/fr/about/`
- Generated via `.RelPermalink` and `.Permalink` methods

## Constitution Compliance

All quality gates passing:

- ✅ **Gate A**: No login/auth
- ✅ **Gate B**: Fully static build
- ✅ **Gate C**: Accessibility (AA)
- ✅ **Gate D**: Performance budgets met
- ✅ **Gate E**: Human-readable files
- ✅ **Gate F**: Mobile responsive
- ✅ **Gate G**: Social metadata
- ✅ **Gate H**: Examples and docs provided

## File Structure

```
specs/006-i18n-terms/
├── spec.md                          # Feature specification (user stories, requirements)
├── plan.md                          # Implementation plan (this phase)
├── research.md                      # Phase 0: Technical research and decisions
├── data-model.md                    # Phase 1: Data structures and schemas
├── quickstart.md                    # Phase 1: End-user documentation
├── contracts/
│   ├── i18n-function.md            # Phase 1: Template function contract
│   └── language-switcher.md        # Phase 1: Component contract
└── PLAN_COMPLETE.md                # This file
```

## Next Steps

### Phase 2: Implementation

Run the following command to generate implementation tasks:

```bash
specify tasks
```

This will create `tasks.md` with detailed implementation steps for:

1. **Configuration** (Priority: High)
   - Update `hugo.toml` with language configuration
   - Add language-specific params for overrides

2. **Translation Files** (Priority: High)
   - Create `i18n/en.toml`, `i18n/de.toml`, `i18n/fr.toml`
   - Populate with ~30 common UI keys

3. **Template Updates** (Priority: High)
   - Replace hardcoded strings with `{{ i18n "key" }}`
   - Update navigation, footer, buttons, labels
   - Add lang attributes and hreflang links

4. **Language Switcher** (Priority: Medium)
   - Create `layouts/partials/language-switcher.html`
   - Style component with CSS
   - Integrate into header/footer

5. **Example Content** (Priority: Medium)
   - Translate 2-3 example posts
   - Translate section index pages
   - Translate team page

6. **CMS Configuration** (Priority: Low)
   - Update Sveltia CMS config for multilingual editing
   - Add language selector in editor
   - Configure per-language collections

7. **Testing** (Priority: High)
   - Validate all three languages render
   - Test fallback for missing translations
   - Check language switcher functionality
   - Verify internal links maintain language
   - Test accessibility (keyboard, screen reader)

8. **Documentation** (Priority: Medium)
   - Finalize operator documentation
   - Create content editor guidelines
   - Add troubleshooting section

## Estimated Implementation Time

- Configuration: 30 minutes
- Translation Files: 1 hour
- Template Updates: 2-3 hours
- Language Switcher: 1 hour
- Example Content: 1-2 hours
- CMS Configuration: 1 hour
- Testing: 2 hours
- Documentation: 1 hour

**Total**: 9-11 hours

## Key Files to Modify

### Configuration
- `config/_default/hugo.toml` - Language configuration
- `config/_default/menus.en.toml` - English menu (new)
- `config/_default/menus.de.toml` - German menu (new)
- `config/_default/menus.fr.toml` - French menu (new)

### Translation Files (New)
- `i18n/en.toml`
- `i18n/de.toml`
- `i18n/fr.toml`

### Templates (Existing - Modify)
- `layouts/partials/header.html` - Navigation labels
- `layouts/partials/footer.html` - Footer labels
- `layouts/partials/head.html` - Lang attributes, hreflang
- `layouts/_default/baseof.html` - HTML lang attribute
- `layouts/_default/list.html` - Section headings
- `layouts/posts/list.html` - "Latest News" etc.
- `layouts/events/list.html` - "Upcoming Events" etc.
- `layouts/results/list.html` - "Recent Results" etc.

### New Partials
- `layouts/partials/language-switcher.html`

### Example Content (New Translations)
- `content/posts/season-kickoff-u13-boys.de.md`
- `content/posts/season-kickoff-u13-boys.fr.md`
- `content/teams/u13-boys/index.de.md`
- `content/teams/u13-boys/index.fr.md`
- `content/posts/_index.de.md`
- `content/posts/_index.fr.md`

### CMS Configuration
- `static/admin/config.yml` - Add i18n config

## Success Criteria

Implementation will be considered successful when:

1. ✅ Site builds without errors in all three languages
2. ✅ Navigation and UI labels appear in correct language
3. ✅ Translated content pages display correctly
4. ✅ Untranslated pages show default language with optional notice
5. ✅ Language switcher appears and functions correctly
6. ✅ Internal links maintain language context
7. ✅ Custom label overrides work as configured
8. ✅ SEO metadata (lang, hreflang) present
9. ✅ Accessibility tests pass (keyboard, screen reader)
10. ✅ Documentation enables operators to add more languages/translations

## Contact & Support

- **Specification**: `specs/006-i18n-terms/spec.md`
- **Research**: `specs/006-i18n-terms/research.md`
- **Data Model**: `specs/006-i18n-terms/data-model.md`
- **Contracts**: `specs/006-i18n-terms/contracts/`
- **Quickstart**: `specs/006-i18n-terms/quickstart.md`
- **Hugo Docs**: [gohugo.io/content-management/multilingual](https://gohugo.io/content-management/multilingual/)

---

**Plan Status**: ✅ Complete and ready for implementation  
**Branch**: `006-i18n-terms`  
**Last Updated**: 2025-12-14
