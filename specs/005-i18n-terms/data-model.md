# Data Model: Multilingual UI Terminology

**Date**: 2025-12-13  
**Status**: Complete

## Overview

This document defines the data structures and entities for the multilingual UI terminology feature. This feature is **configuration and file-based only** - no new content types are introduced. All data lives in i18n translation files and Hugo configuration.

## Entities

### 1. Language

Represents a supported locale/language for the site.

**Location**: `config/_default/hugo.toml` in `[languages]` section

**Schema**:

```toml
[languages.LANG_CODE]
  languageCode = "xx-XX"      # IETF BCP 47 tag (e.g., "en-US", "de-DE")
  languageDirection = "ltr"   # Text direction: "ltr" or "rtl"
  languageName = "Name"       # Human-readable name (e.g., "English", "Deutsch")
  title = "Site Title"        # Localized site title
  weight = 1                  # Sort order in language switcher
  [languages.LANG_CODE.params]
    subtitle = "Subtitle"     # Localized subtitle
    # Optional term overrides
    terms.KEY = "Override"
```

**Example**:

```toml
[languages.en]
  languageCode = "en-US"
  languageDirection = "ltr"
  languageName = "English"
  title = "Sports Club"
  weight = 1
  [languages.en.params]
    subtitle = "Community sports for all ages"
    terms.news = "Blog"      # Override: "News" → "Blog"
```

**Validation Rules**:

- `languageCode` MUST be valid IETF BCP 47 tag
- `languageDirection` MUST be "ltr" or "rtl"
- `weight` determines display order (lower = higher priority)
- `terms.*` keys MUST match existing i18n keys

**Relationships**:

- One Language has many TranslationTerms (via i18n file)
- One Language has optional TermOverrides (via params.terms)

---

### 2. TranslationTerm

Represents a default UI label/term for a specific language.

**Location**: `i18n/{LANG_CODE}.yaml`

**Schema**:

```yaml
key: "Translated value"
```

**Example** (`i18n/en.yaml`):

```yaml
home: "Home"
teams: "Teams"
events: "Events"
news: "News"
teams_heading: "Teams"
teams_subtitle: "Browse all teams at our club"
read_more: "Read More"
skip_to_content: "Skip to content"
main_navigation: "Main navigation"
no_items_yet: "No {{ .Type }} have been created yet. Check back soon!"
```

**Validation Rules**:

- Key MUST be snake_case (lowercase with underscores)
- Value MUST be non-empty string
- Value MAY contain Hugo template variables (e.g., `{{ .Type }}`)
- All three default languages (en, de, fr) SHOULD have same keys

**Relationships**:

- Belongs to one Language (via filename)
- Can be overridden by TermOverride

---

### 3. TermOverride (Optional)

Represents a user-customized UI label that replaces the default translation.

**Location**: `config/_default/hugo.toml` in `[languages.LANG_CODE.params.terms]` section

**Schema**:

```toml
[languages.LANG_CODE.params]
  terms.KEY = "Custom Value"
```

**Example**:

```toml
[languages.en.params]
  terms.news = "Blog"         # Override "News" → "Blog"
  terms.teams = "Groups"      # Override "Teams" → "Groups"
  terms.members = "Athletes"  # Override "Members" → "Athletes"
```

**Validation Rules**:

- KEY MUST match an existing key in `i18n/{LANG_CODE}.yaml`
- Custom value MUST be non-empty string
- Should NOT contain Hugo template variables (overrides are static)

**Relationships**:

- Belongs to one Language
- Overrides one TranslationTerm (by key)

---

## Term Categories (Semantic Groups)

For organizational purposes, translation keys are grouped into categories:

### Navigation Terms

Keys for main navigation links and menus.

```yaml
home: "Home"
teams: "Teams"
events: "Events"
results: "Results"
news: "News"
members: "Members"
```

### Section Heading Terms

Keys for page titles and section headings.

```yaml
teams_heading: "Teams"
teams_subtitle: "Browse all teams at our club"
news_heading: "News & Updates"
news_subtitle: "Stay updated with the latest club news"
events_heading: "Events & Fixtures"
results_heading: "Results"
members_heading: "Members"
```

### Action/CTA Terms

Keys for buttons and action links.

```yaml
read_more: "Read More"
view_details: "View Details"
view_all: "View All"
back_to: "Back to"
filter_by_category: "Filter by Category"
filter_by_team: "Filter by Team"
all_categories: "All Categories"
all_teams: "All Teams"
```

### Accessibility Terms

Keys for screen reader labels and skip links.

```yaml
skip_to_content: "Skip to content"
skip_to_navigation: "Skip to navigation"
main_navigation: "Main navigation"
open_menu: "Open menu"
close_menu: "Close menu"
```

### State/Status Terms

Keys for UI states and conditions.

```yaml
upcoming: "Upcoming"
past: "Past"
date: "Date"
time: "Time"
venue: "Venue"
no_items_yet: "No {{ .Type }} have been created yet. Check back soon!"
no_results: "No results found"
```

---

## Data Flow

### Resolution Flow (Template → Display)

```text
Template calls: {{ partial "i18n-term.html" (dict "key" "teams") }}
                        ↓
                i18n-term.html partial
                        ↓
         Check: site.Language.Params.terms.teams?
                        ↓
            ┌───────────┴───────────┐
            │ YES                   │ NO
            ↓                       ↓
    Return override         Call: i18n "teams"
        "Groups"                    ↓
                            Return translation
                               "Teams" (en)
                              "Mannschaften" (de)
                               "Équipes" (fr)
                                    ↓
                            Display in HTML
```

### Fallback Chain

```text
1. Config Override (site.Language.Params.terms.KEY)
   ↓ (if not found)
2. Current Language i18n (i18n/LANG_CODE.yaml)
   ↓ (if not found)
3. Default Language i18n (i18n/defaultContentLanguage.yaml)
   ↓ (if not found)
4. Key Itself (failsafe)
```

Example:
- User visits German site (`/de/`)
- Template asks for "teams" term
- Check: `[languages.de.params.terms]` has `teams.override`? → NO
- Check: `i18n/de.yaml` has `teams`? → YES → Return "Mannschaften"

Example with override:
- User visits English site
- Config has: `[languages.en.params.terms]` → `teams = "Groups"`
- Template asks for "teams" term
- Check: Override exists? → YES → Return "Groups" (not "Teams")

---

## File Structure

```text
i18n/
├── en.yaml          # English defaults (80+ terms)
├── de.yaml          # German defaults (80+ terms)
└── fr.yaml          # French defaults (80+ terms)

config/_default/
└── hugo.toml        # Language configs + optional overrides

layouts/partials/
└── i18n-term.html   # Resolution logic (helper partial)
```

---

## Key Counts (MVP)

Based on feature requirements and current template analysis:

| Category | Estimated Keys |
|----------|----------------|
| Navigation | 6 |
| Section Headings | 10 |
| Actions/CTAs | 10 |
| Accessibility | 6 |
| States/Status | 8 |
| Filters/Sorting | 8 |
| Empty States | 4 |
| **Total (MVP)** | **~50-60 keys** |

All keys must be present in all three language files (en.yaml, de.yaml, fr.yaml).

---

## State Transitions

This feature has **no state transitions** - translations are static and determined at build time.

The only "state" is the selected language, which is:
- Set in `config/_default/hugo.toml` as `defaultContentLanguage`
- Potentially overridden by URL path if `defaultContentLanguageInSubdir = true` and multi-language builds are created
- **Not user-selectable at runtime** (MVP scope)

---

## Validation Rules Summary

### At Build Time

Hugo's i18n system validates:

1. Translation keys referenced in templates exist in i18n files
2. Template syntax is valid
3. Missing translations trigger warnings if `--printI18nWarnings` flag is used

### Custom Validation (Recommended)

A validation script should check:

1. **Parity**: All three files (en.yaml, de.yaml, fr.yaml) have same keys
2. **Override validity**: All `terms.*` keys in config match existing i18n keys
3. **No empty values**: All translation values are non-empty
4. **No duplicate keys**: Each file has unique keys

Example validation script (future):

```bash
#!/bin/bash
# Compare keys across i18n files
comm -3 <(yq 'keys | .[]' i18n/en.yaml | sort) \
        <(yq 'keys | .[]' i18n/de.yaml | sort)
# Returns differences if any
```

---

## Schema Evolution

### Adding New Languages

1. Create `i18n/{LANG_CODE}.yaml` with all keys
2. Add `[languages.{LANG_CODE}]` section to `hugo.toml`
3. Rebuild site

### Adding New Terms

1. Add key-value to all three `i18n/*.yaml` files
2. Use key in templates via `{{ partial "i18n-term.html" (dict "key" "new_key") }}`
3. Rebuild site

### Deprecating Terms

1. Remove key from all `i18n/*.yaml` files
2. Remove usage from templates
3. Remove any config overrides for that key
4. Rebuild site

---

## Example: Complete Data Set

### Language (Config)

```toml
[languages.en]
  languageCode = "en-US"
  languageDirection = "ltr"
  languageName = "English"
  title = "Sports Club"
  weight = 1
  [languages.en.params]
    subtitle = "Community sports for all ages"
    terms.news = "Blog"

[languages.de]
  languageCode = "de-DE"
  languageDirection = "ltr"
  languageName = "Deutsch"
  title = "Sportverein"
  weight = 2
  [languages.de.params]
    subtitle = "Gemeinschaftssport für alle Altersgruppen"

[languages.fr]
  languageCode = "fr-FR"
  languageDirection = "ltr"
  languageName = "Français"
  title = "Club Sportif"
  weight = 3
  [languages.fr.params]
    subtitle = "Sport communautaire pour tous les âges"
```

### Translation Terms (i18n/en.yaml excerpt)

```yaml
# Navigation
home: "Home"
teams: "Teams"
news: "News"

# Headings
teams_heading: "Teams"
news_heading: "News & Updates"

# Actions
read_more: "Read More"

# Accessibility
main_navigation: "Main navigation"
```

### Override (Config)

```toml
[languages.en.params]
  terms.news = "Blog"  # Overrides "News" → "Blog"
```

### Resolution Example

Template: `{{ partial "i18n-term.html" (dict "key" "news") }}`

- **English site**: Returns "Blog" (from override)
- **German site**: Returns "Neuigkeiten" (from i18n/de.yaml)
- **French site**: Returns "Actualités" (from i18n/fr.yaml)

---

## Summary

This data model is **configuration-driven** and **file-based**:

- **No database** - All data in YAML/TOML files
- **No new content types** - Existing content remains unchanged
- **No user input** - Site maintainers edit config/i18n files
- **Build-time resolution** - Hugo compiles translations statically
- **Zero runtime complexity** - No JavaScript, no API calls

The model supports the feature requirements:
- ✅ Three languages (en, de, fr)
- ✅ Config-based overrides
- ✅ Safe fallbacks
- ✅ Backwards compatibility
- ✅ Extensibility (add languages by adding files)
