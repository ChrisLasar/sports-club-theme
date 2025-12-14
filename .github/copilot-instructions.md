# dojo-hp-hugo-spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-25

## Active Technologies
- Hugo 0.152+ (Extended edition for Tailwind processing) + daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS (Git-based CMS; Decap CMS documentation as reference) (001-sports-club-ssg)
- Files only (Markdown + YAML/TOML front matter); page bundles supported for colocated media (001-sports-club-ssg)
- Hugo 0.152+ (Extended edition) (001-unify-card-component)
- Hugo 0.152+ (Extended) (004-content-reference-picker)
- Files only (Markdown + YAML front matter); page bundles supported (004-content-reference-picker)
- Hugo 0.152+ (Extended) + daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS (005-i18n-terms)
- SSG: files only (Markdown + YAML front matter); page bundles supported; i18n translations in YAML files (005-i18n-terms)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for Hugo 0.122+ (Extended edition for Tailwind processing)

## Code Style

Hugo 0.152+ (Extended edition for Tailwind processing): Follow standard conventions

## Recent Changes
- 005-i18n-terms: Added Hugo 0.152+ (Extended) + daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS
- 004-content-reference-picker: Added Hugo 0.152+ (Extended)
- 001-unify-card-component: Added Hugo 0.152+ (Extended edition)

## Content Reference Picker Patterns

**Feature**: 004-content-reference-picker  
**Status**: Complete (2025-11-04)

### CMS Configuration Pattern

Use Relation widgets for all content references in `static/admin/config.yml`:

```yaml
- label: "Field Name"
  name: "field_name"
  widget: "relation"
  collection: "target_collection"
  search_fields: ["title", "context_field"]
  value_field: "target_collection/{{slug}}"
  display_fields: ["{{title}} ({{context_field}})"]
  multiple: true  # or false for single selection
  required: false  # or true if mandatory
  hint: "Helpful message for users. If no items appear, create items first."
```

### Front Matter Reference Format

References use collection-prefixed paths (absolute paths):

```yaml
author: "members/john-smith"  # Single reference
teams:  # Multiple references
  - "teams/u13-boys"
  - "teams/u15-girls"
venue: "venues/main-field"
event: "events/tournament-2025-11-15"
```

### Template Reference Resolution

Always use `.Site.GetPage` for content references:

```html
{{/* Single reference */}}
{{ with .Params.author }}
  {{ $author := site.GetPage . }}
  {{ with $author }}
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{ end }}
{{ end }}

{{/* Multiple references */}}
{{ range .Params.teams }}
  {{ $team := site.GetPage . }}
  {{ with $team }}
    <div>{{ .Title }}</div>
  {{ end }}
{{ end }}
```

### Reference Validation

Use the validation partial in list templates:

```html
{{/* Validate references before rendering */}}
{{ range $items }}
  {{ with .Params.author }}
    {{ partial "validate-reference.html" (dict "ref" . "context" $) }}
  {{ end }}
{{ end }}
```

### Relation Widget Examples

```yaml
# Team coaches (members)
coaches:
  widget: "relation"
  collection: "members"
  search_fields: ["title", "role"]
  value_field: "members/{{slug}}"
  display_fields: ["{{title}} ({{role}})"]
  multiple: true

# Event teams
teams:
  widget: "relation"
  collection: "teams"
  search_fields: ["title", "sport", "group"]
  value_field: "teams/{{slug}}"
  display_fields: ["{{title}} ({{sport}})"]
  multiple: true
  min: 1
  required: true

# Post author
author:
  widget: "relation"
  collection: "members"
  search_fields: ["title", "role"]
  value_field: "members/{{slug}}"
  display_fields: ["{{title}} ({{role}})"]
  required: true

# Event/team venue
venue:
  widget: "relation"
  collection: "venues"
  search_fields: ["title", "address"]
  value_field: "venues/{{slug}}"
  display_fields: ["{{title}}"]
  required: false
```

### Best Practices

1. **Always include helpful hints** explaining when dropdowns will be empty
2. **Use display_fields with context** (e.g., "Title (Role)") for clarity
3. **Set search_fields** to include all relevant searchable content
4. **Use value_field: "collection/{{slug}}"** for all relation widgets to create absolute paths
5. **Set min/required** appropriately for data integrity
6. **Validate all references** in list templates to catch broken links at build time
7. **Include collection prefix** in value_field (e.g., "members/{{slug}}") and front matter will store absolute paths

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

## Multilingual UI Terminology Patterns

**Feature**: 005-i18n-terms  
**Status**: Complete (2025-12-13)

### i18n-term Partial Usage

Use the `i18n-term.html` partial for all UI labels in templates:

```html
{{/* Basic usage */}}
{{ partial "i18n-term.html" (dict "key" "teams") }}

{{/* With context for interpolation */}}
{{ partial "i18n-term.html" (dict "key" "no_items_yet" "context" (dict "Type" "teams")) }}

{{/* With count for pluralization */}}
{{ partial "i18n-term.html" (dict "key" "items_count" "count" 5) }}
```

### Translation File Structure

All translation keys in `i18n/*.yaml` files use `snake_case`:

```yaml
# Navigation
home: "Home"
teams: "Teams"
events: "Events"

# Section headings
teams_heading: "Teams"
teams_subtitle: "Browse all teams at our club"

# Actions
read_more: "Read More"
view_all: "View All"

# Accessibility
skip_to_content: "Skip to content"
main_navigation: "Main navigation"
```

### Config-Based Overrides

Users can override any term per language in `config/_default/hugo.toml`:

```toml
[languages.en.params]
  terms.news = "Blog"        # Override "News" → "Blog"
  terms.teams = "Squads"     # Override "Teams" → "Squads"

[languages.de.params]
  terms.teams = "Gruppen"    # German-specific override
```

### Fallback Chain

The i18n-term partial implements a four-level fallback:

1. **Config Override**: `site.Language.Params.terms.{KEY}`
2. **Current Language i18n**: `i18n/{lang}.yaml`
3. **Default Language i18n**: `i18n/{defaultContentLanguage}.yaml`
4. **Key Itself**: Raw key string (failsafe)

### Multilingual Content Access

When accessing content in list templates, always use the default language site to ensure content appears in all language versions:

```html
{{- /* Access content from default language site (index 0) */ -}}
{{ $defaultSite := index site.Sites 0 }}
{{ $items := where $defaultSite.RegularPages "Type" "section_name" }}
```

**Why**: In Hugo's multilingual mode, `site.RegularPages` only returns pages for the current language. Since content only exists in the default language, accessing it via `index site.Sites 0` ensures all language versions can display the content.

### Best Practices

1. **Always use i18n-term partial** for UI labels, never hard-code text
2. **Keep keys consistent** across all three language files (en, de, fr)
3. **Use snake_case** for all translation keys
4. **Test with --printI18nWarnings** to catch missing translations
5. **Document available term keys** in quickstart.md for users
6. **Maintain lang attribute** in HTML using `site.Language.Lang`
7. **Update aria-labels** to use translated terms for accessibility
8. **Access content from default site** in list templates using `index site.Sites 0`
