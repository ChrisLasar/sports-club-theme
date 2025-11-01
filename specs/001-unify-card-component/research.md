# Research: Unified Card System

**Feature**: 001-unify-card-component  
**Date**: 2025-11-01  
**Purpose**: Technical research for implementing a unified card component system using Hugo partials and daisyUI card components

## Key Decisions

### Decision 1: Use Hugo Partials for Card Abstraction

**Chosen**: Single reusable partial (`layouts/_partials/card.html`) that accepts a standardized data structure

**Rationale**:
- Hugo's `partial` function allows passing arbitrary context (maps/dicts) to templates
- Enables centralized card rendering logic that can be invoked from any template
- Supports both direct usage and `partialCached` for performance optimization on static lists
- Template lookup order allows for type-specific overrides if needed (e.g., `card.events.html`)

**Alternatives Considered**:
- **Inline template definitions**: Would require repetition; doesn't enforce DRY principle
- **Shortcodes**: Not appropriate for list/template rendering; shortcodes are for content authors
- **Hugo blocks**: Too heavyweight; blocks are for layout inheritance, not component abstraction

**Implementation Pattern** (from Hugo docs):
```go-html-template
{{/* layouts/_partials/card.html */}}
{{ $card := . }}
<div class="card">
  <h3>{{ $card.title }}</h3>
  <p>{{ $card.description }}</p>
</div>

{{/* Usage in list template */}}
{{ range .Pages }}
  {{ partial "card.html" (dict 
    "title" .Title
    "description" .Summary
    "href" .RelPermalink
    "image" .Params.image
  ) }}
{{ end }}
```

### Decision 2: daisyUI Card Component as Foundation

**Chosen**: Use daisyUI's `card` component class with Default and Compact variants via Tailwind CSS utility modifiers

**Rationale**:
- daisyUI provides semantic, accessible card structure out of the box
- Variants achieved through size/spacing modifiers: `card-sm` for Compact, base `card` for Default
- Fully static CSS output (no JS); meets Constitution Gate B
- Integrates with Tailwind CSS 4.x already in project dependencies
- Graceful degradation: cards remain functional as basic HTML if CSS fails to load

**daisyUI Card Structure** (from instructions):
- Component: `card`
- Parts: `card-title`, `card-body`, `card-actions`
- Modifiers: `card-border`, `card-side` (horizontal layout, if needed later)
- Sizes: `card-xs`, `card-sm`, `card-md`, `card-lg`, `card-xl`

**Minimal Tailwind Adjustment**:
- Use utility classes for responsive behavior: `sm:card-horizontal` (if horizontal variant added)
- Custom spacing/radius via daisyUI theme variables (configured in `@plugin "daisyui"` config)
- No custom CSS files; rely on Tailwind + daisyUI utilities only

**Alternatives Considered**:
- **Custom CSS card classes**: Violates DRY; duplicates daisyUI's work; harder to maintain
- **Inline styles**: Not maintainable; no theming support
- **JavaScript-based cards**: Violates Constitution Gate V (no JS dependence for core UX)

**Implementation Pattern**:
```html
<div class="card {{ if eq .variant "compact" }}card-sm{{ end }}">
  {{ with .image }}
    <figure><img src="{{ .src }}" alt="{{ .alt }}" /></figure>
  {{ end }}
  <div class="card-body">
    <h2 class="card-title">{{ .title }}</h2>
    <p>{{ .description }}</p>
    {{ with .primaryMeta }}
      <div>{{ . }}</div>
    {{ end }}
    <div class="card-actions">
      <a href="{{ .href }}" class="btn btn-primary">View</a>
    </div>
  </div>
</div>
```

### Decision 3: Field Mapping Strategy

**Chosen**: Archetype-specific mapping functions/partials that transform page context into canonical card data structure

**Rationale**:
- Each content type (event, post, result, team, member) has unique front matter schema
- Mapping logic colocated with archetype definitions maintains clarity
- Enables easy override per usage (e.g., a specific list page can customize the mapping)
- Follows Hugo's convention of content-type-aware rendering

**Implementation Pattern**:
```go-html-template
{{/* layouts/_partials/mappers/event-to-card.html */}}
{{ $page := . }}
{{ return (dict
  "title" $page.Title
  "description" $page.Params.venue
  "href" $page.RelPermalink
  "image" (dict "src" $page.Params.image "alt" $page.Title)
  "primaryMeta" $page.Params.date
  "variant" "default"
) }}

{{/* Usage in events/list.html */}}
{{ range .Pages }}
  {{ $cardData := partial "mappers/event-to-card.html" . }}
  {{ partial "card.html" $cardData }}
{{ end }}
```

**Alternatives Considered**:
- **Single universal mapper with conditionals**: Too complex; violates single responsibility
- **No mapping layer**: Direct access to `.Params` in card partial; couples card to content schema
- **Data files for mappings**: Overkill; Hugo templates can express mappings declaratively

### Decision 4: Migration Path (Remove Old Templates Immediately)

**Chosen**: Atomic cutover—implement unified card partial, update all call sites in same commit, remove old per-type templates

**Rationale**:
- Per clarification session: user chose Option A (remove immediately)
- Small codebase scan shows only 5 archetype card usages (events, posts, results, teams, members)
- Coordinated change reduces risk of lingering references
- Git branch isolation allows testing before merge

**Migration Checklist**:
1. Scan codebase for existing card rendering (grep for `.html` in layouts/events, /posts, /results, /teams, /members)
2. Identify direct card markup (not using partials) and convert to partial calls
3. Delete old per-type card partials (if any exist)
4. Validate all list pages render correctly with unified partial
5. Run accessibility and performance checks (Constitution Gates C, D)

**Search Pattern** (to identify direct card creation):
```bash
grep -r "class=\"card" layouts/
```

### Decision 5: Accessibility and Performance

**Chosen**: 
- Use semantic HTML (`<article>` for card wrapper, `<h2>`/`<h3>` for card titles)
- Ensure all images have `alt` attributes (mandatory or decorative role)
- Links are keyboard-navigable (native `<a>` tags)
- Performance: use `partialCached` for static lists (events, teams, members); use `partial` for dynamic content (latest posts)

**Rationale**:
- Constitution Gate C: WCAG 2.1 AA compliance
- Constitution Gate D: Performance budgets (LCP ≤ 2.5s, CLS ≤ 0.1, JS ≤ 50KB)
- daisyUI cards are CSS-only; no JS overhead
- `partialCached` reduces build time for large lists (Hugo optimization)

**Implementation Guideline**:
```go-html-template
{{/* Static list: cache per page */}}
{{ range .Pages }}
  {{ partialCached "card.html" (partial "mappers/event-to-card.html" .) .RelPermalink }}
{{ end }}

{{/* Dynamic list: fresh render */}}
{{ range site.RegularPages.ByDate.Reverse | first 5 }}
  {{ partial "card.html" (partial "mappers/post-to-card.html" .) }}
{{ end }}
```

## Best Practices

### Hugo Partial Patterns

1. **Context Passing**: Always pass a dict/map to partials for clarity:
   ```go-html-template
   {{ partial "card.html" (dict "title" .Title "href" .RelPermalink) }}
   ```

2. **Template Existence Check**: Use `templates.Exists` for optional mapper overrides:
   ```go-html-template
   {{ $mapperPath := printf "mappers/%s-to-card.html" .Type }}
   {{ if templates.Exists (printf "_partials/%s" $mapperPath) }}
     {{ $cardData := partial $mapperPath . }}
   {{ else }}
     {{ $cardData := partial "mappers/default-to-card.html" . }}
   {{ end }}
   {{ partial "card.html" $cardData }}
   ```

3. **Inline Partials** (for small, one-off logic): Define inline if not reused:
   ```go-html-template
   {{ define "_partials/inline/card-badge.html" }}
     <span class="badge">{{ . }}</span>
   {{ end }}
   {{ partial "inline/card-badge.html" .Params.badge }}
   ```

### daisyUI Card Best Practices

1. **Variant Selection**: Use size modifiers for compactness:
   - Default: `card` (base spacing)
   - Compact: `card-sm` (reduced padding/typography)

2. **Responsive Layouts**: Use Tailwind responsive prefixes:
   ```html
   <div class="card sm:card-horizontal">
   ```

3. **Graceful Image Fallbacks**: Conditional `<figure>` rendering:
   ```go-html-template
   {{ with .image }}
     <figure><img src="{{ .src }}" alt="{{ .alt }}" /></figure>
   {{ end }}
   ```

4. **Color Roles**: Use daisyUI semantic colors (base-100, base-200, primary-content) for theming:
   ```html
   <div class="card bg-base-100 text-base-content">
   ```

## Technical Stack Confirmation

- **Hugo**: v0.152+ (already in project)
- **daisyUI**: v5.x (already in project dependencies; see DAISYUI_SETUP.md)
- **Tailwind CSS**: v4.x (already in project; daisyUI requires Tailwind v4)
- **Alpine.js**: v3.x (optional; not needed for cards; Constitution allows progressive enhancement)
- **Build**: Hugo asset pipeline with Tailwind CSS processing

## Next Steps (for Phase 1)

1. Define canonical card data model (data-model.md)
2. Create partial contract/interface spec (contracts/card-partial.md)
3. Document quickstart for adding new card usages (quickstart.md)
4. Update agent context with Hugo/daisyUI/Tailwind patterns
