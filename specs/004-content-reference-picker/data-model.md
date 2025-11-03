# Data Model: Content Reference Picker

**Feature**: 004-content-reference-picker  
**Date**: 2025-11-02  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures for content references in the sports club Hugo site. References connect related content (teams → members, events → teams, results → events, posts → authors) using content paths stored in YAML front matter and resolved at build time by Hugo.

---

## Entity Schemas

### 1. Member

**File Location**: `content/members/{slug}/index.md`

**Front Matter Schema**:

```yaml
---
title: string            # Member's full name (e.g., "Jane Doe")
date: datetime           # Creation date
role: string             # Primary role (e.g., "Head Coach", "Player", "Staff")
teams: array<string>     # References to teams (e.g., ["teams/u13-boys", "teams/u15-girls"])
bio: string             # Optional biography/description
portrait: string        # Optional path to portrait image
social:                 # Optional social media links
  email: string
  phone: string
  website: string
---
```

**CMS Widget Configuration** (not stored in front matter):

- `title`: String widget (required)
- `role`: String widget or Select widget with predefined roles
- `teams`: **Relation widget** → `teams` collection (multiple: true)
- `bio`: Text/Markdown widget
- `portrait`: Image widget

**Referenced By**:

- Teams (as coaches)
- Posts (as authors)

**State Transitions**: None (members don't have workflow states)

**Validation**:

- `title` is required
- `role` is required
- `teams` array can be empty (not all members are associated with teams)
- If `portrait` is provided, file must exist in `static/images/` or as page bundle resource

---

### 2. Team

**File Location**: `content/teams/{slug}/index.md`

**Front Matter Schema**:

```yaml
---
title: string            # Team name (e.g., "U13 Boys")
date: datetime           # Creation date
sport: string            # Sport type (e.g., "Football", "Basketball", "Volleyball")
group: string            # Age/skill group (e.g., "U13", "U15", "Adults", "Veterans")
coaches: array<string>   # **RELATION REFERENCES** to members (e.g., ["members/jane-doe"])
primary_venue: string    # **SELECT REFERENCE** to venue from data/venues.yaml (e.g., "home-field")
training_schedule:       # Training sessions
  - day: string          # Day of week
    time: string         # Time (e.g., "18:00-19:30")
    venue: string        # **SELECT REFERENCE** to venue
featured_image: string   # Optional team photo
---
```

**CMS Widget Configuration**:

- `title`: String widget (required)
- `sport`: Select widget with options (Football, Basketball, Volleyball, etc.)
- `group`: String or Select widget
- `coaches`: **Relation widget** → `members` collection (multiple: true, search by name/role, display: "{{title}} ({{role}})")
- `primary_venue`: **Select widget** with options from data/venues.yaml
- `training_schedule`: List widget with nested fields
  - `day`: Select widget (Monday-Sunday)
  - `time`: String widget
  - `venue`: **Select widget** (same options as primary_venue)

**Referenced By**:

- Events
- Results
- Posts (team news)
- Members (reverse relationship)

**Validation**:

- `title`, `sport`, `group` are required
- `coaches` can be empty (team exists before coaches assigned)
- `primary_venue` is optional
- Training schedule venues must exist in data/venues.yaml

---

### 3. Event

**File Location**: `content/events/{slug}/index.md`

**Front Matter Schema**:

```yaml
---
title: string            # Event title (e.g., "U13 Boys vs Rival Team")
date: datetime           # Event date/time
event_type: string       # Type: "match", "tournament", "training_camp", "social"
teams: array<string>     # **RELATION REFERENCES** to teams (e.g., ["teams/u13-boys"])
venue: string            # **SELECT REFERENCE** to venue from data/venues.yaml
opponent: string         # Optional opponent name (for matches)
description: string      # Event details
featured_image: string   # Optional event image
---
```

**CMS Widget Configuration**:

- `title`: String widget (required)
- `date`: DateTime widget (required)
- `event_type`: Select widget (match, tournament, training_camp, social)
- `teams`: **Relation widget** → `teams` collection (multiple: true, search by title/sport, display: "{{title}} ({{sport}})")
- `venue`: **Select widget** from data/venues.yaml
- `opponent`: String widget (optional)
- `description`: Markdown widget

**Referenced By**:

- Results (results link back to the event)

**Validation**:

- `title`, `date`, `event_type` are required
- `teams` must have at least 1 team selected
- `venue` is optional
- For `event_type: match`, `opponent` should be filled (soft validation)

---

### 4. Result

**File Location**: `content/results/{slug}/index.md`

**Front Matter Schema**:

```yaml
---
title: string            # Result title (e.g., "U13 Boys Win 3-1")
date: datetime           # Match date
event: string            # **RELATION REFERENCE** to event (e.g., "events/u13-boys-vs-rival")
score: object            # Score details
  home: int              # Home team score
  away: int              # Away team score
teams: array<string>     # **RELATION REFERENCES** (can be derived from event, or explicit)
placement: string        # Optional placement for tournaments (e.g., "1st Place", "2nd Place")
highlights: string       # Match highlights (Markdown)
featured_image: string   # Optional result image
---
```

**CMS Widget Configuration**:

- `title`: String widget (required)
- `date`: DateTime widget (required)
- `event`: **Relation widget** → `events` collection (single selection, search by title/date, display: "{{title}} - {{date}}", sort by date descending)
- `score`: Object widget with nested Number widgets
- `teams`: **Relation widget** → `teams` collection (multiple: true) OR derived from event
- `placement`: String widget (optional)
- `highlights`: Markdown widget

**Referenced By**: None (results are leaf nodes)

**Validation**:

- `title`, `date` are required
- `event` is optional (results can exist without event reference)
- `score` is optional (for non-match results like tournaments)
- If `event` is provided, it must exist in events collection

---

### 5. Post (News)

**File Location**: `content/posts/{slug}/index.md`

**Front Matter Schema**:

```yaml
---
title: string            # Post title
date: datetime           # Publication date
author: string           # **RELATION REFERENCE** to member (e.g., "members/jane-doe")
summary: string          # Short summary/excerpt
body: markdown           # Post content
teams: array<string>     # **RELATION REFERENCES** to related teams (optional)
categories: array<string> # Categories (e.g., ["team-news", "match-reports"])
tags: array<string>      # Tags (e.g., ["u13-boys", "victory", "tournament"])
featured_image: string   # Optional featured image
---
```

**CMS Widget Configuration**:

- `title`: String widget (required)
- `date`: DateTime widget (required)
- `author`: **Relation widget** → `members` collection (single, search by title/role, display: "{{title}} ({{role}})")
- `summary`: Text widget (required)
- `body`: Markdown widget (required)
- `teams`: **Relation widget** → `teams` collection (multiple: true)
- `categories`: Select widget with predefined options (multiple)
- `tags`: List widget (simple text array)

**Referenced By**: None

**Validation**:

- `title`, `date`, `summary`, `body` are required
- `author` is required
- `teams`, `categories`, `tags` are optional

---

### 6. Venue (Content Collection)

**File Location**: `content/venues/{slug}/index.md` (page bundle) or `content/venues/{slug}.md`

**Schema**:

```yaml
---
title: "Main Training Field"
date: 2025-01-01T00:00:00Z
address: "123 Club Lane, Hometown, ST 12345"
map_link: "https://maps.google.com/?q=123+Club+Lane,+Hometown,+ST+12345"
facilities: "Changing rooms, floodlights, spectator seating"
image: "venue-photo.jpg"  # Optional
---

Optional description and additional details can be added in the content body using Markdown.
```

**CMS Widget Configuration**:

- Managed as a content collection in CMS
- Editable by content editors
- Used in Relation widgets by other collections

**Referenced By**:

- Teams (primary_venue, training_schedule venues)
- Events (venue)

**Validation**:

- `title` is required
- `address` is required
- `map_link` is optional but recommended
- `facilities` is optional
- Referenced venues in team/event front matter must exist as published content

**Hugo Template Resolution**:

```go
{{ with .Site.GetPage (.Params.primary_venue) }}
  <div class="venue">{{ .Title }} - {{ .Params.address }}</div>
{{ end }}
```

---

## Relationships

### Content References (Relation Widget)

| Source | Field | Target | Cardinality | Widget Type | Value Format |
|--------|-------|--------|-------------|-------------|--------------|
| Team | `coaches` | Member | Many-to-Many | Relation | `["members/jane-doe"]` |
| Team | `primary_venue` | Venue | Many-to-One | Relation | `"venues/main-field"` |
| Team | `training_schedule[].venue` | Venue | Many-to-One | Relation | `"venues/training-ground"` |
| Event | `teams` | Team | Many-to-Many | Relation | `["teams/u13-boys"]` |
| Event | `venue` | Venue | Many-to-One | Relation | `"venues/home-stadium"` |
| Result | `event` | Event | Many-to-One | Relation | `"events/u13-boys-vs-rival"` |
| Result | `teams` | Team | Many-to-Many | Relation | `["teams/u13-boys"]` |
| Post | `author` | Member | Many-to-One | Relation | `"members/jane-doe"` |
| Post | `teams` | Team | Many-to-Many | Relation | `["teams/u13-boys"]` |
| Member | `teams` | Team | Many-to-Many | Relation | `["teams/u13-boys"]` |

**Note**: All references now use the Relation widget pattern. Venues have been migrated from data file to content collection.

---

## Reference Resolution

### Content References (Hugo Template)

**Single Reference** (e.g., post author, venue):

```go-html-template
{{ with .Site.GetPage .Params.author }}
  <a href="{{ .Permalink }}">{{ .Title }}</a>
{{ else }}
  <span>Unknown Author</span>
{{ end }}
```

**Multiple References** (e.g., team coaches):

```go-html-template
{{ range .Params.coaches }}
  {{ with $.Site.GetPage . }}
    <div class="coach">
      <h3>{{ .Title }}</h3>
      <p>{{ .Params.role }}</p>
    </div>
  {{ else }}
    <p class="error">Coach not found: {{ . }}</p>
  {{ end }}
{{ end }}
```

**Note**: Venue references also use `.Site.GetPage` since venues are now a content collection, not a data file.

---

## Validation Rules

### CMS-Level Validation (Sveltia/Decap)

**Required Fields**:

- All entities: `title`, `date`
- Team: `sport`, `group`
- Event: `event_type`, `teams` (min: 1)
- Post: `author`, `summary`, `body`
- Venue: `title`, `address`

**Data Type Validation**:

- Dates must be valid ISO 8601 format
- Relation fields must reference existing collection items
- Number fields (scores) must be integers ≥ 0

### Build-Time Validation (Hugo)

**Content Reference Validation**:

Create partial `layouts/partials/validate-reference.html`:

```go-html-template
{{/* Usage: {{ partial "validate-reference.html" (dict "path" .Params.author "context" .) }} */}}
{{ $path := .path }}
{{ $context := .context }}
{{ if not (site.GetPage $path) }}
  {{ errorf "File %s references missing content: %s" $context.File.Path $path }}
{{ end }}
```

**Data File Validation**:

```go-html-template
{{ $venue := .Params.venue }}
{{ if and $venue (not (index .Site.Data.venues $venue)) }}
  {{ errorf "File %s references unknown venue: %s" .File.Path $venue }}
{{ end }}
```

**Usage in Templates**:

Add validation calls to collection list templates (e.g., `layouts/teams/list.html`):

```go-html-template
{{ range .Pages }}
  {{ range .Params.coaches }}
    {{ partial "validate-reference.html" (dict "path" . "context" $.context) }}
  {{ end }}
{{ end }}
```

---

## State Transitions

Content items do not have explicit workflow states in this implementation. State is implicit:

- **Draft**: File exists in repository but not published (controlled by `draft: true` in front matter)
- **Published**: File exists with `draft: false` (or no draft field) and is deployed

**Future Enhancement**: Editorial workflow (Sveltia CMS 2.0 feature) would add explicit states like "in_review", "pending_publish", etc.

---

## Migration Notes

### Existing Content

Current front matter format already uses paths for references:

```yaml
# Current (manual entry)
coaches:
  - members/jane-doe
  - members/john-smith
```

This format is **identical** to what Relation widget stores. No content file changes needed.

### Archetypes Update

Update archetype files to use array format for multiple references:

**Before** (`archetypes/teams.md`):

```yaml
coach: ""
```

**After**:

```yaml
coaches: []
```

This aligns with CMS configuration and prevents confusion.

---

## Open Design Questions

1. **Bi-directional References**: Should members know which teams reference them as coaches?
   - Current: One-way (teams → members)
   - Option: Use Hugo's `.Pages.RelatedBy` or custom partial to find reverse references
   - Decision: Defer to future enhancement (not in MVP)

2. **Orphaned References**: What happens when a member is deleted but still referenced by a team?
   - Current: Build fails with `errorf` (strict validation)
   - Option: Graceful degradation (show slug instead of member details)
   - Decision: Strict validation by default; provide config flag to allow soft failures

3. **Inline Content Creation**: Should users be able to create a member while editing a team?
   - Current: No (Sveltia CMS limitation)
   - Future: Sveltia CMS plans to support this (issue #493)
   - Decision: Document workaround (create member first, then add to team)

4. **Reference Caching**: Should Hugo cache resolved references for performance?
   - Current: Hugo caches `.Site.GetPage` calls automatically
   - No action needed

---

## Summary

- **5 Content Entities** with front matter schemas defined
- **1 Data File** (venues) referenced by content
- **7 Content Reference Fields** using Relation widget
- **3 Data Reference Fields** using Select widget
- **Validation**: Two-layer (CMS required fields + Hugo build-time reference checks)
- **Migration**: Zero content changes needed (format already compatible)
- **Next Steps**: Create CMS configuration contracts in `/contracts/`
