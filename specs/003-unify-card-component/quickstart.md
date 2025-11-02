# Quickstart: Using the Unified Card System

**Feature**: 003-unify-card-component  
**Audience**: Template developers, content maintainers  
**Time to Complete**: 5-10 minutes

## Overview

The unified card system provides a single reusable card component for displaying content across the site. Instead of maintaining separate card templates for events, posts, results, teams, and members, you use one `card.html` partial with standardized data.

## Prerequisites

- Hugo 0.152+ installed
- Basic familiarity with Hugo templates and partials
- daisyUI 5.x and Tailwind CSS 4.x configured (already set up in this project)

## Quick Example

### Step 1: Display Cards on a List Page

Edit your list template (e.g., `layouts/events/list.html`):

```go-html-template
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
    {{ range .Pages }}
      {{ $cardData := partial "mappers/event-to-card.html" . }}
      {{ partial "card.html" $cardData }}
    {{ end }}
  </div>
{{ end }}
```

**What this does**:

1. **Line 4**: Creates a responsive grid with `items-stretch` to ensure equal card heights in each row
2. **Line 5**: Iterate over all pages in the current section
3. **Line 6**: Transform each page into card data using the event mapper
4. **Line 7**: Render the card using the unified card partial

**Important**: The `items-stretch` class on the grid container is required to ensure all cards in a row have equal height with action buttons aligned at the bottom, regardless of content length variations.

### Step 2: Understand the Mapper

The mapper (`layouts/_partials/mappers/event-to-card.html`) transforms a Hugo page into the card data format:

```go-html-template
{{ $page := . }}
{{ $imageResource := "" }}
{{ with $page.Params.socialImage }}
  {{ $imageResource = $page.Resources.Get . }}
  {{ if not $imageResource }}
    {{ $imageResource = resources.Get . }}
  {{ end }}
{{ end }}

{{ return (dict
  "title" $page.Title
  "href" $page.RelPermalink
  "primaryMeta" ($page.Params.date | time.Format ":date_long")
  "secondaryMeta" $page.Params.venue
  "image" (if $imageResource (dict 
    "resource" $imageResource
    "alt" $page.Title
  ) dict)
  "variant" "default"
) }}
```

**Mapper inputs**: Hugo page object (`.`)  
**Mapper outputs**: Dict with card fields (title, href, image resource, etc.)

**Image handling**: The mapper retrieves Hugo resources from page bundles or global resources, not static paths

### Step 3: Customize Card Display (Optional)

Use the `variant` field to change card appearance:

```go-html-template
{{ $cardData := partial "mappers/event-to-card.html" . }}
{{ $cardData = merge $cardData (dict "variant" "compact") }}
{{ partial "card.html" $cardData }}
```

**Variants**:

- `"default"` → Standard card with full spacing
- `"compact"` → Smaller card with reduced spacing (uses daisyUI `card-sm`)

### Step 4: Image Optimization (Automatic)

Card images are automatically optimized for performance:

**Responsive Image Sizes**:
- **320px** - Mobile devices (portrait)
- **480px** - Mobile devices (landscape) & small tablets
- **640px** - Tablets & 2-column grids
- **768px** - Large tablets & fallback

**Smart `sizes` Attribute**:
```
(min-width: 1024px) 320px,    ← Desktop 3-column grid
(min-width: 768px) 350px,      ← Tablet 2-column grid
(min-width: 640px) 450px,      ← Large mobile
100vw                          ← Small mobile (full width)
```

**Benefits**:
- ✅ **60-70% smaller file sizes** on desktop (320px vs 1200px)
- ✅ **WebP format** for modern browsers with JPEG/PNG fallback
- ✅ **Lazy loading** by default (loading="lazy")
- ✅ **Precise control** using px values instead of viewport-based calculations

**Custom sizes** (if needed):
```go-html-template
{{ $cardData := partial "mappers/event-to-card.html" . }}
{{ $cardData = merge $cardData (dict "image" (dict 
  "resource" $imageResource
  "alt" "Custom alt text"
  "sizes" "(min-width: 1024px) 400px, 100vw"  ← Custom sizes
)) }}
{{ partial "card.html" $cardData }}
```

## Common Use Cases

### Use Case 1: Latest Posts on Homepage

**File**: `layouts/index.html`

```go-html-template
<section>
  <h2>Latest News</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
    {{ range first 4 (where site.RegularPages "Type" "posts") }}
      {{ $cardData := partial "mappers/post-to-card.html" . }}
      {{ partial "card.html" $cardData }}
    {{ end }}
  </div>
</section>
```

### Use Case 2: Team Roster (Compact Cards)

**File**: `layouts/teams/single.html`

```go-html-template
<h2>Team Members</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-2 items-stretch">
  {{ range .Params.members }}
    {{ with site.GetPage (printf "/members/%s" .) }}
      {{ $cardData := partial "mappers/member-to-card.html" . }}
      {{ $cardData = merge $cardData (dict "variant" "compact") }}
      {{ partial "card.html" $cardData }}
    {{ end }}
  {{ end }}
</div>
```

### Use Case 3: Mixed Content Widget

**File**: `layouts/_partials/widgets/featured-content.html`

```go-html-template
<div class="featured-content">
  {{ $featured := where site.RegularPages "Params.featured" true | first 3 }}
  {{ range $featured }}
    {{ $mapperPath := printf "mappers/%s-to-card.html" .Type }}
    {{ $cardData := partial $mapperPath . }}
    {{ partial "card.html" $cardData }}
  {{ end }}
</div>
```

**Explanation**: Dynamically selects the correct mapper based on content type (`.Type`)

## Performance Optimization

For large lists (> 20 items), use `partialCached` to speed up builds:

```go-html-template
{{ range .Pages }}
  {{ $cardData := partial "mappers/event-to-card.html" . }}
  {{ partialCached "card.html" $cardData .RelPermalink }}
{{ end }}
```

**When to cache**:

- ✅ Static lists (all events, all teams)
- ✅ Content that doesn't change per page
- ❌ Dynamic lists (latest 5 posts)
- ❌ Context-dependent rendering

## Adding a New Content Type

To add cards for a new content type (e.g., `sponsors`):

### 1. Create a Mapper

**File**: `layouts/_partials/mappers/sponsor-to-card.html`

```go-html-template
{{ $page := . }}
{{ $imageResource := "" }}
{{ with $page.Params.logo }}
  {{ $imageResource = $page.Resources.Get . }}
  {{ if not $imageResource }}
    {{ $imageResource = resources.Get . }}
  {{ end }}
{{ end }}

{{ return (dict
  "title" $page.Title
  "href" $page.RelPermalink
  "description" $page.Summary
  "image" (if $imageResource (dict 
    "resource" $imageResource
    "alt" $page.Title
  ) dict)
  "badge" $page.Params.tier
  "variant" "default"
) }}
```

### 2. Use in List Template

**File**: `layouts/sponsors/list.html`

```go-html-template
{{ range .Pages }}
  {{ $cardData := partial "mappers/sponsor-to-card.html" . }}
  {{ partial "card.html" $cardData }}
{{ end }}
```

### 3. Define Mandatory Fields

Document which fields are required for sponsors in your content guidelines:

- Mandatory: `title`, `href`, `logo`
- Optional: `tier`, `summary`

## Troubleshooting

### Problem: Cards Have Different Heights in Grid

**Symptom**: Action buttons are not aligned horizontally across cards in the same row.

**Cause**: Missing `items-stretch` class on the grid container.

**Fix**: Ensure your grid container includes `items-stretch`:

```go-html-template
<!-- ❌ Wrong - cards will have different heights -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {{ range .Pages }}
    {{ partial "card.html" $cardData }}
  {{ end }}
</div>

<!-- ✅ Correct - cards will stretch to equal height -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
  {{ range .Pages }}
    {{ partial "card.html" $cardData }}
  {{ end }}
</div>
```

**How it works**:

1. The card partial includes `flex flex-col h-full` on the root `<article>` element
2. The card-body has `flex flex-col flex-grow` to expand vertically
3. The card-actions has `mt-auto` to push buttons to the bottom
4. The grid container's `items-stretch` makes all grid items take the full height of the tallest item in their row

This ensures action buttons are horizontally aligned across all cards in the same row, regardless of content length variations.

### Problem: Cards Not Displaying

**Check**:

1. Is the mapper returning a dict with `title` and `href`?
2. Are you passing the mapper output to `card.html`?
3. Does the page have the required front matter fields?

**Debug**:

```go-html-template
{{ $cardData := partial "mappers/event-to-card.html" . }}
{{ printf "Card data: %v" $cardData }}
{{ partial "card.html" $cardData }}
```

### Problem: Images Not Showing

**Check**:

1. Is the image a valid Hugo resource from a page bundle or global resources?
2. Does the `socialImage` (or equivalent) parameter point to a valid resource path?
3. Is the image file present in the page bundle or `assets/` directory?

**Debug**: Check if the resource is being found:

```go-html-template
{{ $imageResource := .Resources.Get .Params.socialImage }}
{{ if $imageResource }}
  Image found: {{ $imageResource.RelPermalink }}
{{ else }}
  Image NOT found: {{ .Params.socialImage }}
{{ end }}
```

**Fix**: Ensure images are Hugo resources, not static files. The card system uses the `responsive-image.html` partial which requires Hugo resources to generate multiple sizes and WebP format.

### Problem: Card Layout Breaks

**Check**:

1. Is `variant` set to a valid value (`"default"` or `"compact"`)?
2. Are daisyUI and Tailwind CSS properly configured?
3. Is the CSS being generated and linked?

**Fix**: Verify `assets/css/main.css` includes:

```css
@import "tailwindcss";
@plugin "daisyui";
```

## Reference

- **Card Data Model**: See `specs/003-unify-card-component/data-model.md`
- **Card Partial Contract**: See `specs/003-unify-card-component/contracts/card-partial.md`
- **daisyUI Card Docs**: See `.github/instructions/daisyui.instructions.md`
- **Hugo Partials Docs**: https://gohugo.io/templates/partials/

## Next Steps

- **Customize**: Adjust mapper logic to expose more fields from your content
- **Extend**: Add new variants (e.g., `"horizontal"` for media-left layout)
- **Optimize**: Profile build times and add `partialCached` where beneficial
