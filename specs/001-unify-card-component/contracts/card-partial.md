# Card Partial Contract

**Feature**: 001-unify-card-component  
**Date**: 2025-11-01  
**Purpose**: Define the interface contract for the unified card partial template

## Contract Overview

The card partial (`layouts/_partials/card.html`) is a reusable Hugo template component that renders a standardized card UI element. It accepts a map (dict) conforming to the Card data model and outputs semantic HTML using daisyUI card classes.

## Partial Signature

```go-html-template
{{ partial "card.html" <CardData> }}
```

**Parameters**:

- `<CardData>`: A map (dict) conforming to the Card data model (see data-model.md)

**Returns**: HTML string (rendered card markup)

**Side Effects**: None (pure rendering function)

## Input Contract

### Required Fields

The partial MUST receive a dict with at minimum:

```go
{
  "title": "<string>",
  "href": "<string>"
}
```

If these fields are missing, the partial SHOULD:

1. Log a warning: `{{ warnf "Card partial received incomplete data: missing title or href" }}`
2. Return an empty string (no output)

### Optional Fields

All other fields defined in the Card data model are optional:

```go
{
  "title": "<string>",           // Required
  "href": "<string>",            // Required
  "description": "<string>",     // Optional
  "image": {                     // Optional
    "resource": <Hugo Resource>, // Hugo resource object
    "alt": "<string>",           // Alt text
    "sizes": "<string>",         // Responsive sizes attribute
    "loading": "<string>"        // "lazy" or "eager"
  },
  "primaryMeta": "<string>",     // Optional
  "secondaryMeta": "<string>",   // Optional
  "badge": "<string>",           // Optional
  "tags": ["<string>", ...],     // Optional
  "variant": "<string>"          // Optional; defaults to "default"
}
```

## Output Contract

### HTML Structure

The partial MUST output valid HTML5 conforming to this structure:

```html
<article class="card [variant-class] [utility-classes]">
  [Optional: figure with image if provided]
  <div class="card-body">
    <h2 class="card-title">[title linked to href]</h2>
    [Optional: description paragraph]
    [Optional: primary metadata]
    [Optional: secondary metadata]
    [Optional: badge]
    [Optional: tags list]
    <div class="card-actions">
      <a href="[href]" class="btn btn-primary">View</a>
    </div>
  </div>
</article>
```

### CSS Classes

**Base Classes** (always present):

- `card`: daisyUI card component
- `bg-base-100`: daisyUI semantic background color
- `text-base-content`: daisyUI semantic text color

**Variant Classes** (conditional):

- `variant="default"` → no modifier (default card spacing)
- `variant="compact"` → `card-sm` (reduced spacing)

**Utility Classes** (as needed):

- Responsive modifiers (future): `sm:card-horizontal`
- Shadow/border (per design): `card-border` or `shadow-lg`

### Accessibility Requirements

The partial MUST ensure:

1. **Semantic HTML**: Use `<article>` as the root element for each card
2. **Heading Hierarchy**: Use `<h2>` or `<h3>` for card title (configurable via parameter in future)
3. **Link Accessibility**:
   - Card title MUST be a link: `<h2 class="card-title"><a href="{{ .href }}">{{ .title }}</a></h2>`
   - OR entire card is wrapped in a link (alternative pattern)
4. **Image Alt Text**:
   - The `responsive-image.html` partial handles alt text appropriately
   - If `image.alt` is provided, it's used
   - If `image.alt` is empty, the image is treated as decorative with `alt=""`
5. **Keyboard Navigation**: All interactive elements (links, buttons) are keyboard-accessible (native HTML behavior)

### Performance Constraints

The partial MUST:

- Render in < 5ms per card on typical build machine (Hugo benchmark)
- Produce no more than 2KB HTML per card (minified)
- Not invoke external resources or API calls (fully static)

## Usage Examples

### Example 1: Basic Card (Minimal Data)

**Input**:

```go-html-template
{{ partial "card.html" (dict
  "title" "Event Title"
  "href" "/events/example/"
) }}
```

**Output** (formatted for readability):

```html
<article class="card bg-base-100 text-base-content">
  <div class="card-body">
    <h2 class="card-title">
      <a href="/events/example/">Event Title</a>
    </h2>
    <div class="card-actions">
      <a href="/events/example/" class="btn btn-primary">View</a>
    </div>
  </div>
</article>
```

### Example 2: Full Card (All Optional Fields)

**Input**:

```go-html-template
{{ partial "card.html" (dict
  "title" "Season Kickoff Success"
  "href" "/posts/season-kickoff/"
  "description" "The U13 boys team started their season with an impressive victory..."
  "image" (dict
    "src" "/images/posts/kickoff.jpg"
    "alt" "Team photo after kickoff match"
    "width" 800
    "height" 600
  )
  "primaryMeta" "October 27, 2025"
  "secondaryMeta" "Match Report"
  "badge" "Featured"
  "tags" (slice "U13" "Match Report" "Victory")
  "variant" "default"
) }}
```

**Output** (formatted for readability):

```html
<article class="card bg-base-100 text-base-content">
  <figure>
    <img src="/images/posts/kickoff.jpg" alt="Team photo after kickoff match" width="800" height="600" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">
      <a href="/posts/season-kickoff/">Season Kickoff Success</a>
    </h2>
    <p>The U13 boys team started their season with an impressive victory...</p>
    <div class="text-sm text-base-content/70">
      <span>October 27, 2025</span>
    </div>
    <div class="text-xs text-base-content/60">
      <span>Match Report</span>
    </div>
    <span class="badge badge-primary">Featured</span>
    <div class="flex gap-2">
      <span class="badge badge-outline">U13</span>
      <span class="badge badge-outline">Match Report</span>
      <span class="badge badge-outline">Victory</span>
    </div>
    <div class="card-actions">
      <a href="/posts/season-kickoff/" class="btn btn-primary">View</a>
    </div>
  </div>
</article>
```

### Example 3: Compact Variant

**Input**:

```go-html-template
{{ partial "card.html" (dict
  "title" "U13 Boys Win 3-1"
  "href" "/results/u13-boys-win-3-1/"
  "primaryMeta" "3 - 1"
  "variant" "compact"
) }}
```

**Output** (formatted for readability):

```html
<article class="card card-sm bg-base-100 text-base-content">
  <div class="card-body">
    <h2 class="card-title">
      <a href="/results/u13-boys-win-3-1/">U13 Boys Win 3-1</a>
    </h2>
    <div class="text-sm text-base-content/70">
      <span>3 - 1</span>
    </div>
    <div class="card-actions">
      <a href="/results/u13-boys-win-3-1/" class="btn btn-sm btn-primary">View</a>
    </div>
  </div>
</article>
```

## Validation Behavior

### Invalid Input Handling

**Scenario**: Missing required fields (`title` or `href`)

**Behavior**:

```go-html-template
{{ if and .title .href }}
  [render card]
{{ else }}
  {{ warnf "Card partial: missing required fields (title=%v, href=%v)" .title .href }}
  {{/* Return empty string */}}
{{ end }}
```

**Result**: No card is rendered; build continues without error (warning logged)

### Graceful Degradation

**Scenario**: Optional field is missing (e.g., `image`)

**Behavior**:

```go-html-template
{{ with .image }}
  <figure><img src="{{ .src }}" alt="{{ .alt }}" /></figure>
{{ end }}
```

**Result**: The `<figure>` is omitted; card renders without image; layout remains valid

## Caching Strategy

The card partial supports Hugo's `partialCached` for performance optimization on static lists.

**When to use `partialCached`**:

- Static content lists (all events, all teams, all members)
- Content that does not change per request or user
- Lists with > 10 items

**When to use `partial`** (uncached):

- Dynamic lists (latest 5 posts, upcoming events)
- Content that varies per page context
- Lists with < 10 items (caching overhead not justified)

**Example** (cached):

```go-html-template
{{ range .Pages }}
  {{ $cardData := partial "mappers/event-to-card.html" . }}
  {{ partialCached "card.html" $cardData .RelPermalink }}
{{ end }}
```

**Cache Key**: Use `.RelPermalink` as the cache key to ensure unique cache entries per page

## Breaking Changes Policy

Any changes to this contract that break existing usage MUST:

1. Be documented in the feature changelog
2. Provide a migration guide
3. Increment the major version of the template/feature

**Non-breaking changes** (allowed):

- Adding new optional fields to the Card data model
- Adding new variant values (e.g., `variant="horizontal"`)
- Improving HTML structure without changing class names or semantics

**Breaking changes** (require migration):

- Renaming existing fields
- Changing required fields
- Removing variant values
- Changing CSS class names
