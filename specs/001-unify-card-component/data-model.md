# Data Model: Unified Card System

**Feature**: 001-unify-card-component  
**Date**: 2025-11-01  
**Purpose**: Define the canonical data structure for card rendering across all archetypes

## Card Data Model

The unified card system uses a single, standardized data structure that all archetype mappers must produce. This model represents the contract between content (pages) and presentation (card partial).

### Card Entity

**Description**: A display-ready representation of content optimized for card-based layouts (grids, lists, carousels).

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `title` | string | Yes | Primary heading displayed in the card | Max 100 chars; truncate with ellipsis if longer |
| `href` | string | Yes | Link target when card is clicked | Must be valid URL or relative path |
| `description` | string | No | Secondary text (excerpt, summary, or metadata) | Max 200 chars; truncate gracefully if longer |
| `image` | map | No | Featured image for the card | See Image sub-entity below |
| `primaryMeta` | string | No | First metadata line (e.g., date, score) | Max 50 chars; displayed prominently |
| `secondaryMeta` | string | No | Second metadata line (e.g., venue, opponent) | Max 50 chars; displayed below primary |
| `badge` | string | No | Label or category badge | Max 20 chars; displayed as accent element |
| `tags` | array of strings | No | List of tags/keywords | Max 5 tags; each max 15 chars |
| `variant` | string | No | Visual variant selector | Enum: "default", "compact"; defaults to "default" |

**Relationships**:

- **Derived from**: Page (Hugo content item) via archetype-specific mapper
- **Rendered by**: `card.html` partial template

### Image Sub-Entity

**Description**: Embedded image metadata for card visual content.

**Attributes**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `src` | string | Yes | Image source URL (absolute or relative) | Must be valid path; supports Hugo resources or static assets |
| `alt` | string | No | Alternative text for accessibility | Required unless image is purely decorative; max 125 chars |
| `width` | int | No | Image width in pixels | Positive integer; used for aspect ratio hints |
| `height` | int | No | Image height in pixels | Positive integer; used for aspect ratio hints |

**Validation**:

- If `alt` is empty, image is treated as decorative (`role="presentation"`)
- If `width` and `height` are provided, card can reserve space to prevent layout shift (CLS optimization)

## Archetype Mappings

Each content type (archetype) defines a mapper partial (`layouts/_partials/mappers/{type}-to-card.html`) that transforms its page context into the Card data model.

### Event Mapping

**Source**: Event page (content/events/*)

**Mandatory Fields** (from spec FR-011):

- `title` ← `.Title`
- `href` ← `.RelPermalink`
- `primaryMeta` ← `.Params.date` (formatted as human-readable date)

**Optional Fields**:

- `secondaryMeta` ← `.Params.venue`
- `image.src` ← `.Params.image`
- `image.alt` ← `.Title` (fallback)
- `tags` ← `.Params.tags`

**Example Output**:

```go
{
  "title": "U13 Boys vs Rival Team",
  "href": "/events/u13-boys-vs-rival-2025-11-15/",
  "primaryMeta": "November 15, 2025",
  "secondaryMeta": "Main Stadium",
  "image": {
    "src": "/images/events/u13-match.jpg",
    "alt": "U13 Boys vs Rival Team"
  },
  "variant": "default"
}
```

### Post Mapping

**Source**: Post page (content/posts/*)

**Mandatory Fields**:

- `title` ← `.Title`
- `href` ← `.RelPermalink`
- `primaryMeta` ← `.PublishDate` (formatted as human-readable date) OR `.Summary` (at least one required)

**Optional Fields**:

- `description` ← `.Summary` (if not used in primaryMeta)
- `image.src` ← `.Params.image`
- `image.alt` ← `.Title` (fallback)
- `tags` ← `.Params.tags`

**Example Output**:

```go
{
  "title": "Season Kickoff Success",
  "href": "/posts/season-kickoff-u13-boys/",
  "primaryMeta": "October 27, 2025",
  "description": "The U13 boys team started their season with an impressive 3-1 victory...",
  "image": {
    "src": "/images/posts/kickoff.jpg",
    "alt": "Season Kickoff Success"
  },
  "tags": ["U13", "Match Report"],
  "variant": "default"
}
```

### Result Mapping

**Source**: Result page (content/results/*)

**Mandatory Fields**:

- `title` ← `.Title` or `.Params.opponent` (opponent as title if title is generic)
- `href` ← `.RelPermalink`
- `primaryMeta` ← `.Params.score` (formatted as "Home X - Y Away")

**Optional Fields**:

- `secondaryMeta` ← `.Params.competition` or `.Params.round`
- `image.src` ← `.Params.image`
- `image.alt` ← `.Title`

**Example Output**:

```go
{
  "title": "U13 Boys Win 3-1",
  "href": "/results/u13-boys-win-3-1/",
  "primaryMeta": "3 - 1",
  "secondaryMeta": "League Round 5",
  "variant": "default"
}
```

### Team Mapping

**Source**: Team page (content/teams/*)

**Mandatory Fields**:

- `title` ← `.Title` (team name)
- `href` ← `.RelPermalink`

**Optional Fields**:

- `primaryMeta` ← `.Params.ageGroup` or `.Params.category`
- `secondaryMeta` ← `.Params.coach`
- `image.src` ← `.Params.image`
- `image.alt` ← `.Title`

**Example Output**:

```go
{
  "title": "U13 Boys",
  "href": "/teams/u13-boys/",
  "primaryMeta": "Under 13",
  "secondaryMeta": "Coach: John Smith",
  "image": {
    "src": "/images/teams/u13-boys.jpg",
    "alt": "U13 Boys"
  },
  "variant": "default"
}
```

### Member Mapping

**Source**: Member page (content/members/*)

**Mandatory Fields**:

- `title` ← `.Params.name` or `.Title` (member name)
- `href` ← `.RelPermalink`
- `image.src` ← `.Params.image` (mandatory per FR-011)
- `image.alt` ← `.Title`

**Optional Fields**:

- `primaryMeta` ← `.Params.role`
- `secondaryMeta` ← `.Params.team` or `.Params.department`

**Example Output**:

```go
{
  "title": "Sarah Jones",
  "href": "/members/sarah-jones/",
  "primaryMeta": "Team Captain",
  "secondaryMeta": "U15 Girls",
  "image": {
    "src": "/images/members/sarah-jones.jpg",
    "alt": "Sarah Jones"
  },
  "variant": "default"
}
```

## Validation Rules

### Runtime Validation (in Mapper Partials)

Each mapper partial SHOULD validate mandatory fields before returning the card data:

```go-html-template
{{/* Example: Event mapper validation */}}
{{ if not .Title }}
  {{ errorf "Event card missing required field: title. Page: %s" .RelPermalink }}
{{ end }}
{{ if not .Params.date }}
  {{ errorf "Event card missing required field: date. Page: %s" .RelPermalink }}
{{ end }}
```

### Fallback Strategy (in Card Partial)

The card partial MUST handle missing optional fields gracefully:

```go-html-template
{{ with .image }}
  <figure><img src="{{ .src }}" alt="{{ .alt }}" /></figure>
{{ end }}

{{ with .description }}
  <p>{{ . }}</p>
{{ end }}
```

### Enforcement (per FR-012)

If a content item lacks any mandatory field for its archetype, it MUST NOT render as a card. The list page remains valid; other items render normally.

## State Transitions

The card model is read-only (immutable). Cards do not have lifecycle states. They are derived on-demand during build/render.

**Workflow**:

1. **Build time**: Hugo processes content files
2. **Render time**: List template iterates pages
3. **Mapping**: Archetype mapper transforms page → card data
4. **Validation**: Mapper checks mandatory fields; skips if invalid
5. **Rendering**: Card partial receives valid card data → HTML output

## Performance Considerations

- **Card data size**: Keep card data structures small (< 1KB per card) to minimize Hugo template memory overhead
- **Image optimization**: Images SHOULD be processed through Hugo's image pipeline (resize, WebP) before being assigned to `image.src`
- **Caching**: Use `partialCached` for static card lists to reduce build time (see research.md Decision 5)

## Extension Points

Future enhancements MAY add:

- **Actions**: Array of action buttons (e.g., `[{text: "Register", href: "/register"}]`)
- **Stats**: Key-value pairs for numeric highlights (e.g., `{goals: 3, assists: 2}`)
- **Color theme**: Override card background/accent per item

These are deferred until v2 requirements justify them.
