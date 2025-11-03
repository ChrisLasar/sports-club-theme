# Research: Content Reference Picker

**Feature**: 004-content-reference-picker  
**Date**: 2025-11-02  
**Phase**: 0 - Research & Outline

## Overview

This document consolidates research findings on implementing content reference pickers in Sveltia CMS (compatible with Decap CMS) for a Hugo static site. The goal is to replace manual path entry with dropdown-based selection of related content items.

---

## 1. Relation Widget Research

### 1.1 Core Functionality (from Decap CMS Documentation)

The **Relation widget** provides the exact functionality needed for content reference picking:

**Key Features**:
- Search input with dropdown list of entries from referenced collection
- Auto-updates list based on user typing
- Stores value from referenced collection item
- Supports nested fields, list fields, and file collections

**Required Options**:
- `collection`: Name of referenced collection (string)
- `value_field`: Field from referenced collection to store (e.g., `{{slug}}` for entry slugs)
- `search_fields`: List of fields to search when user types

**Optional Options**:
- `file`: Reference specific file in file collection
- `display_fields`: Fields to show in dropdown (defaults to `value_field`)
- `multiple`: Boolean for multiple selections (default: false)
- `min`/`max`: Limits for multiple selections
- `options_length`: Number of options to show (default: 20)
- `filters`: Filter available options by field values (added in v3.1.5)

### 1.2 String Template Support

Both `value_field` and `display_fields` support **template strings** using `{{field}}` syntax:

Examples:
```yaml
value_field: "{{slug}}"
display_fields: ["{{name.first}} {{name.last}} - {{role}}"]
```

This allows formatting display text while storing structured values.

### 1.3 Nested Field Access

Access nested fields using dot notation:
```yaml
value_field: "name.first"
search_fields: ["name.first", "twitterHandle"]
```

For list fields, use wildcard `*`:
```yaml
value_field: "cities.*.id"
search_fields: ["cities.*.name"]
```

### 1.4 Filtering Options

The `filters` option (v3.1.5+) restricts available options:
```yaml
filters: 
  - field: draft
    values: [false]
  - field: category
    values: ['sports', 'news']
```

Only items matching ALL filters appear in the dropdown.

### Decision: **Use Relation Widget**
- **Rationale**: Native CMS widget providing exactly the needed functionality
- **Alternatives Considered**: Custom widget development (rejected - unnecessary complexity)

---

## 2. Sveltia CMS Enhancements

### 2.1 Sveltia-Specific Improvements (from README)

Sveltia CMS enhances the Relation widget with several improvements over Decap CMS:

**Performance**:
- No additional API requests for field options (solves Decap issue #4635, #5920, #6410)
- GraphQL API usage eliminates rate limit violations
- Instant loading even with hundreds of entries

**UI/UX**:
- Options displayed reliably (fixes Decap #259)
- Template strings with wildcards work correctly: `{{cities.*.name}}`
- `slug` can be used for `value_field` to show all options
- `display_fields` shown in preview instead of `value_field`
- Auto-switches to radio buttons/checkboxes when ≤5 options (configurable via `dropdown_threshold`)

**Default Behavior**:
- `search_fields` defaults to `display_fields`, then `value_field`, then collection's `identifier_field` (usually `title`)
- `value_field` defaults to `{{slug}}`
- New items in referenced collection immediately available

**Validation**:
- Referenced DateTime fields display in specified format
- Proper handling of i18n-enabled Relation fields

### 2.2 Venue References

**Original Limitation**: Relation widget works with **collections** (content files), not data files.

Venues were originally in `data/venues.yaml`, which would require:
- **Option A**: Convert venues to a file collection ✅ **SELECTED**
- **Option B**: Use Select widget with manual options list (rejected - hardcoded)
- **Option C**: Use custom integration (rejected - too complex)

### Decision: **Migrate Venues to Content Collection**
- **All references** (members, teams, events, **venues**): Use Relation widget
- **Location**: `content/venues/{slug}/index.md` or `content/venues/{slug}.md`
- **Rationale**: 
  - Consistent pattern across all content types
  - No hardcoded options to maintain
  - Venues can be edited through CMS
  - Supports venue metadata (images, descriptions)
  - Enables venue detail pages if needed
- **Migration**: Convert `data/venues.yaml` entries to individual Markdown files

---

## 3. Hugo Integration Patterns

### 3.1 Reference Resolution at Build Time

Hugo resolves content references using:

```go-html-template
{{ with .Site.GetPage .Params.coach }}
  <p>Coach: {{ .Title }}</p>
{{ end }}
```

For member references stored as paths:
```yaml
coaches:
  - members/jane-doe
  - members/john-smith
```

Template resolution:
```go-html-template
{{ range .Params.coaches }}
  {{ with $.Site.GetPage . }}
    <div class="coach">
      <h3>{{ .Title }}</h3>
      <p>{{ .Params.role }}</p>
    </div>
  {{ end }}
{{ end }}
```

### 3.2 Venue Data Resolution

For data file references:
```yaml
venue: home-field  # References key in data/venues.yaml
```

Template resolution:
```go-html-template
{{ with index .Site.Data.venues .Params.venue }}
  <div class="venue">
    <h4>{{ .name }}</h4>
    <address>{{ .address }}</address>
  </div>
{{ end }}
```

### 3.3 Validation Strategy

Hugo build will fail if:
1. Referenced content page doesn't exist (.Site.GetPage returns nil)
2. Referenced data key doesn't exist (index returns nil)

**Best Practice**: Use `with` to handle missing references gracefully:
```go-html-template
{{ with .Site.GetPage .Params.coach }}
  {{ . }}
{{ else }}
  <p class="error">Coach not found: {{ $.Params.coach }}</p>
{{ end }}
```

### Decision: **Validate at Build Time**
- **Rationale**: Hugo's built-in validation is sufficient for content references
- Add custom shortcode/partial to validate and display helpful error messages
- No runtime validation needed (site is fully static)

---

## 4. CMS Configuration Best Practices

### 4.1 Value Field Patterns

**For content references**, use slug-based paths:
```yaml
value_field: "{{slug}}"  # Stores: members/jane-doe
```

**For display**, show human-readable info:
```yaml
display_fields: ["{{title}}", "{{role}}"]  # Shows: Jane Doe (Coach)
```

**For search**, include multiple fields:
```yaml
search_fields: [title, role, summary]  # Search by name, role, or bio
```

### 4.2 Multiple Selection Pattern

For arrays of references (e.g., multiple teams in an event):
```yaml
- label: "Teams"
  name: "teams"
  widget: "relation"
  collection: "teams"
  search_fields: ["title", "sport"]
  value_field: "{{slug}}"
  display_fields: ["{{title}} ({{sport}})"]
  multiple: true
  min: 1  # Require at least one team
```

### 4.3 Singleton File References

For referencing specific files in a file collection:
```yaml
- label: "Related Page"
  name: "related"
  widget: "relation"
  collection: "pages"
  file: "about"  # References specific file
  value_field: "{{slug}}"
```

### Decision: **Standardize Display Format**
- Members: `{{title}} ({{role}})`
- Teams: `{{title}} ({{sport}})`
- Events: `{{title}} - {{date}}`
- Venues (Select widget): Name from data file
- **Rationale**: Consistent, scannable, provides context for selection

---

## 5. Migration & Backward Compatibility

### 5.1 Existing Content

Current archetypes use text fields for references:
```yaml
coach: ""  # User types: members/jane-doe
```

**Migration Strategy**:
1. Update CMS config to use Relation widget
2. Existing content files remain unchanged (paths already in correct format)
3. New entries use dropdown selection
4. No content file changes needed

### 5.2 Archetype Updates

Update archetype files to use placeholder values:
```yaml
# Before (archetypes/teams.md):
coach: ""

# After:
coaches: []  # Array for multiple coaches
```

**Note**: Archetypes only provide initial structure; CMS config controls widget type.

### Decision: **Zero-Breaking Migration**
- CMS config change only (no content file updates needed)
- Existing manual paths continue to work
- Users immediately benefit from dropdown on next edit
- **Rationale**: Minimize disruption; leverage existing data format

---

## 6. Empty Collection Handling

### 6.1 User Experience for Empty Collections

**Scenario**: Creating a team when no members exist yet.

**Sveltia CMS Behavior**: Shows empty dropdown with no error (based on testing reports).

**Desired Behavior**: Show helpful message: "No members available. Create a member first."

### 6.2 Implementation Options

**Option A**: CMS hint field
```yaml
- label: "Coaches"
  widget: "relation"
  hint: "Select team coaches. If no members appear, create members first."
```

**Option B**: Conditional display (not supported in Decap/Sveltia)
**Option C**: Documentation/training for users

### Decision: **Use Hint Field + Documentation**
- Add `hint` to all Relation fields explaining dependency
- Document recommended content creation order in quickstart
- **Rationale**: Built-in CMS feature; doesn't require custom code

---

## 7. Search & Performance

### 7.1 Search Implementation

Sveltia CMS provides instant search without API calls (collections cached locally).

**Configuration**:
```yaml
search_fields: [title, role, sport, summary]
```

**User Experience**:
- Type "jane" → filters to Jane Doe, Jane Smith
- Type "coach" → filters to all coaches
- Type "u13" → filters to U13 teams

### 7.2 Large Collection Handling

**Sveltia Enhancements**:
- Infinite scroll for large result sets
- Lazy loading (only renders visible items)
- No `options_length` limit needed

**Testing Threshold**: Test with 50+ items in each collection to ensure performance.

### Decision: **Trust Sveltia Performance**
- No custom pagination needed
- Include all relevant fields in `search_fields`
- **Rationale**: Sveltia specifically addresses large collection performance issues in Decap CMS

---

## 8. Validation & Error Handling

### 8.1 CMS-Level Validation

**Built-in**:
```yaml
required: true  # Prevents saving without selection
min: 1  # For multiple selections
max: 5  # Limit number of selections
```

**Not Supported**:
- Cross-field validation (e.g., "coach must be a member with role='coach'")
- Referential integrity (e.g., "can't delete member if referenced by team")

### 8.2 Build-Time Validation

Hugo template with error reporting:
```go-html-template
{{ $missing := slice }}
{{ range .Params.coaches }}
  {{ if not ($.Site.GetPage .) }}
    {{ $missing = $missing | append . }}
  {{ end }}
{{ end }}
{{ if $missing }}
  {{ errorf "Team %s references missing coaches: %s" .File.Path (delimit $missing ", ") }}
{{ end }}
```

### Decision: **Two-Layer Validation**
1. **CMS**: Required field validation (prevents empty selections)
2. **Build**: Reference existence validation (catches deleted content)
- **Rationale**: Fail fast at build time with clear error messages

---

## 9. Venue Selection (Data File References)

### 9.1 Problem Statement

Venues are defined in `data/venues.yaml`:
```yaml
home-field:
  name: "Home Stadium"
  address: "123 Main St"
training-ground:
  name: "Training Facility"
  address: "456 Oak Ave"
```

Relation widget doesn't support data files (only content collections).

### 9.2 Solution Options

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **A: Convert to Collection** | Works with Relation widget | Venues become content pages (semantic mismatch) | ❌ Rejected |
| **B: Select Widget** | Native support for key-value | Manual config updates when venues added | ✅ **Selected** |
| **C: Custom Widget** | Full control | Development/maintenance overhead | ❌ Rejected |

### 9.3 Select Widget Configuration

```yaml
- label: "Venue"
  name: "venue"
  widget: "select"
  options:
    - label: "Home Stadium"
      value: "home-field"
    - label: "Training Facility"
      value: "training-ground"
  required: false
```

**Limitation**: Must manually sync with `data/venues.yaml`.

### 9.4 Alternative: Dynamic Select (Future Enhancement)

Sveltia CMS may support dynamic Select options in future (not currently available).

### Decision: **Select Widget with Manual Sync**
- Use Select widget for venue selection
- Document process for adding new venues (update both data file and CMS config)
- Consider future enhancement: script to generate venue options from data file
- **Rationale**: Simplest solution that works today; venues change infrequently

---

## 10. Member Author Selection (Post Authors)

### 10.1 Requirements

- Select member as post author
- Store reference to member for profile linking
- Fall back gracefully if member deleted

### 10.2 Configuration

```yaml
- label: "Author"
  name: "author"
  widget: "relation"
  collection: "members"
  search_fields: ["title", "role"]
  value_field: "{{slug}}"
  display_fields: ["{{title}} ({{role}})"]
  required: true
```

### 10.3 Template Resolution

```go-html-template
{{ $author := .Site.GetPage .Params.author }}
{{ if $author }}
  <a href="{{ $author.Permalink }}" class="author-link">
    {{ $author.Title }}
  </a>
{{ else }}
  <span class="author-text">{{ .Params.author }}</span>
{{ end }}
```

This handles both:
- **Valid reference**: Links to member profile
- **Deleted member**: Shows author slug as text (graceful degradation)

### Decision: **Relation Widget with Fallback**
- Store member reference in author field
- Template attempts to resolve; falls back to text display
- **Rationale**: Best UX when reference exists; acceptable fallback when broken

---

## 11. Testing Strategy

### 11.1 CMS Configuration Testing

**Manual Tests**:
1. Create team → verify coach dropdown appears
2. Select coach → save → verify correct path in front matter
3. Create event → select multiple teams → verify array saved
4. Empty collection → verify helpful message or empty dropdown
5. Search functionality → type to filter options
6. Multiple selection limits (min/max)

### 11.2 Hugo Build Testing

**Automated Tests** (if build script supports):
1. Build with valid references → expect success
2. Build with broken reference → expect error with clear message
3. Build with missing optional reference → expect success (graceful degradation)

**Manual Verification**:
1. Check team page displays coach info from referenced member
2. Check event page displays team names from referenced teams
3. Check venue details display from data file

### 11.3 Edge Case Testing

1. Delete referenced member → rebuild → verify error or fallback
2. Rename content slug → verify references break (expected) → document migration process
3. Create 100+ members → verify dropdown performance
4. Special characters in titles → verify template rendering

### Decision: **Manual + Build Validation**
- Manual testing in CMS for UX validation
- Rely on Hugo build errors for reference validation
- Document test scenarios in quickstart
- **Rationale**: Appropriate for static site; no runtime testing needed

---

## 12. Documentation Requirements

### 12.1 User-Facing Documentation

**Quickstart Addition**:
- "Creating Relationships Between Content"
- Show dropdown selection screenshot
- Explain when to use each reference type
- Recommended content creation order

**Content Editor Guide**:
- How to add coaches to teams
- How to link events to teams
- How to set post authors
- What to do if referenced content is deleted

### 12.2 Developer Documentation

**CMS Configuration Reference**:
- Relation widget examples for each content type
- How to add new reference fields
- How to update venue options

**Template Developer Guide**:
- Content reference resolution patterns
- Error handling with `with` blocks
- Data file lookups

### Decision: **Parallel Documentation**
- Create docs alongside implementation
- Include in quickstart.md (Phase 1)
- Update main README with reference section
- **Rationale**: Constitution requirement (Principle X)

---

## Summary of Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Primary Widget** | Relation widget | Native CMS functionality; perfect fit |
| **Venue Selection** | Select widget (manual sync) | Data files not supported by Relation widget |
| **Display Format** | Standardized templates per type | Consistency and scannability |
| **Migration** | CMS config only (zero content changes) | Minimize disruption |
| **Empty Collections** | Hint field + docs | Simple, built-in solution |
| **Validation** | CMS required + build-time checks | Two-layer safety net |
| **Search Fields** | Multiple fields per type | Better discoverability |
| **Value Storage** | `{{slug}}` for content refs | Matches Hugo GetPage expectations |
| **Testing** | Manual CMS + build validation | Appropriate for static site |
| **Documentation** | Quickstart + examples | Constitution compliance |

---

## Open Questions for Phase 1

1. Should we add a script to auto-generate venue Select options from data/venues.yaml?
2. Do we need a "create new" option in relation dropdowns (e.g., create member inline)?
3. Should we add a content migration script to validate all existing references?
4. Is there a pattern for "soft delete" (deprecate member but keep old references valid)?
5. Should we support bi-directional references (e.g., member knows which teams reference them)?

---

## Next Steps (Phase 1: Design & Contracts)

1. Create data-model.md with entity schemas
2. Define CMS configuration contracts in /contracts/
3. Create quickstart.md with user guide
4. Update agent context with new technologies/patterns
