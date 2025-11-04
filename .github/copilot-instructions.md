# dojo-hp-hugo-spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-25

## Active Technologies
- Hugo 0.152+ (Extended edition for Tailwind processing) + daisyUI 5.x, Tailwind CSS 4.x, Alpine.js 3.x (optional progressive enhancement), Sveltia CMS (Git-based CMS; Decap CMS documentation as reference) (001-sports-club-ssg)
- Files only (Markdown + YAML/TOML front matter); page bundles supported for colocated media (001-sports-club-ssg)
- Hugo 0.152+ (Extended edition) (001-unify-card-component)
- Hugo 0.152+ (Extended) (004-content-reference-picker)
- Files only (Markdown + YAML front matter); page bundles supported (004-content-reference-picker)

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
- 004-content-reference-picker: Added Hugo 0.152+ (Extended)
- 001-unify-card-component: Added Hugo 0.152+ (Extended edition)
- 002-preview-deployment: Added Hugo 0.152+ (Extended edition for Tailwind processing)

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
  value_field: "{{slug}}"
  display_fields: ["{{title}} ({{context_field}})"]
  multiple: true  # or false for single selection
  required: false  # or true if mandatory
  hint: "Helpful message for users. If no items appear, create items first."
```

### Front Matter Reference Format

References use collection-prefixed paths:

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
  display_fields: ["{{title}} ({{role}})"]
  multiple: true

# Event teams
teams:
  widget: "relation"
  collection: "teams"
  search_fields: ["title", "sport", "group"]
  display_fields: ["{{title}} ({{sport}})"]
  multiple: true
  min: 1
  required: true

# Post author
author:
  widget: "relation"
  collection: "members"
  search_fields: ["title", "role"]
  display_fields: ["{{title}} ({{role}})"]
  required: true

# Event/team venue
venue:
  widget: "relation"
  collection: "venues"
  search_fields: ["title", "address"]
  display_fields: ["{{title}}"]
  required: false
```

### Best Practices

1. **Always include helpful hints** explaining when dropdowns will be empty
2. **Use display_fields with context** (e.g., "Title (Role)") for clarity
3. **Set search_fields** to include all relevant searchable content
4. **Use value_field: "{{slug}}"** for all relation widgets
5. **Set min/required** appropriately for data integrity
6. **Validate all references** in list templates to catch broken links at build time
7. **Include collection prefix** in front matter (e.g., "members/name", not just "name")

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
