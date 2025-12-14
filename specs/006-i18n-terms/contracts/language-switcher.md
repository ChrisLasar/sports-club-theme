# Language Switcher Component Contract

**Feature**: 006-i18n-terms  
**Version**: 1.0.0  
**Type**: Hugo Partial Specification

## Overview

This document specifies the language switcher partial component that allows users to navigate between translated versions of the current page.

## Component Location

**File**: `layouts/partials/language-switcher.html`

## Functional Requirements

### FR-1: Display Available Languages

The component MUST display all available translations of the current page plus the current language.

### FR-2: Indicate Current Language

The component MUST visually indicate which language is currently active using appropriate ARIA attributes.

### FR-3: Link to Translations

The component MUST provide clickable links to translated versions of the current page with correct language codes.

### FR-4: Graceful Degradation

The component MUST handle pages with no translations gracefully (show only current language or hide entirely).

### FR-5: Accessibility

The component MUST be fully accessible via keyboard navigation and screen readers.

### FR-6: No JavaScript Required

The component MUST function without JavaScript (pure HTML/CSS).

## Component Interface

### Input Context

The partial receives Hugo's page context (`.`) with the following relevant fields:

```go
type Page struct {
  Language struct {
    Lang          string  // Current language code (e.g., "en")
    LanguageCode  string  // Full locale code (e.g., "en-US")
    LanguageName  string  // Display name (e.g., "English")
  }
  IsTranslated     bool    // true if page has translations
  Translations     []Page  // Other language versions (excluding current)
  AllTranslations  []Page  // All versions (including current)
  RelPermalink     string  // Language-aware relative URL
}
```

### Output HTML Structure

The component MUST output semantic HTML with appropriate ARIA labels:

```html
<nav aria-label="Language switcher" class="language-switcher">
  <ul class="language-list">
    <li class="language-item">
      <span class="language-current" aria-current="true">English</span>
    </li>
    <li class="language-item">
      <a href="/de/page/" hreflang="de-DE" lang="de" class="language-link">
        Deutsch
      </a>
    </li>
    <li class="language-item">
      <a href="/fr/page/" hreflang="fr-FR" lang="fr" class="language-link">
        Français
      </a>
    </li>
  </ul>
</nav>
```

## Implementation Specification

### Base Implementation

```go-html-template
{{/*
  Language Switcher Partial
  Displays links to all available translations of the current page
  
  Usage: {{ partial "language-switcher.html" . }}
  Context: Requires page context
*/}}

{{ if .IsTranslated }}
  <nav aria-label="{{ i18n "language_switcher" }}" class="language-switcher">
    <ul class="language-list">
      {{ range .AllTranslations }}
        <li class="language-item">
          {{ if eq .Language.Lang $.Language.Lang }}
            <span class="language-current" aria-current="true">
              {{ .Language.LanguageName }}
            </span>
          {{ else }}
            <a href="{{ .RelPermalink }}" 
               hreflang="{{ .Language.LanguageCode }}"
               lang="{{ .Language.Lang }}"
               class="language-link">
              {{ .Language.LanguageName }}
            </a>
          {{ end }}
        </li>
      {{ end }}
    </ul>
  </nav>
{{ end }}
```

### Alternative: Always Show Switcher

For sites where the switcher should always be visible (even on untranslated pages):

```go-html-template
<nav aria-label="{{ i18n "language_switcher" }}" class="language-switcher">
  <ul class="language-list">
    {{ range site.Languages }}
      <li class="language-item">
        {{ if eq .Lang $.Language.Lang }}
          <span class="language-current" aria-current="true">
            {{ .LanguageName }}
          </span>
        {{ else }}
          {{ with $.GetPage.Translations }}
            {{ $translation := where . "Language.Lang" .Lang | first }}
            {{ with $translation }}
              <a href="{{ .RelPermalink }}"
                 hreflang="{{ .Language.LanguageCode }}"
                 lang="{{ .Language.Lang }}"
                 class="language-link">
                {{ .Language.LanguageName }}
              </a>
            {{ else }}
              <span class="language-unavailable" aria-disabled="true">
                {{ .LanguageName }}
              </span>
            {{ end }}
          {{ else }}
            <a href="{{ "/" | relLangURL }}"
               hreflang="{{ .LanguageCode }}"
               lang="{{ .Lang }}"
               class="language-link">
              {{ .LanguageName }}
            </a>
          {{ end }}
        {{ end }}
      </li>
    {{ end }}
  </ul>
</nav>
```

## Styling Requirements

### Required CSS Classes

The component uses the following classes that MUST be styled:

- `.language-switcher` - Container nav element
- `.language-list` - List container
- `.language-item` - Individual language item
- `.language-current` - Current language indicator (not clickable)
- `.language-link` - Link to translation
- `.language-unavailable` - Disabled/unavailable language (optional)

### Minimum Styling

```css
.language-switcher {
  /* Position in header/footer */
}

.language-list {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.language-item {
  /* Individual item styling */
}

.language-current {
  font-weight: bold;
  pointer-events: none;
}

.language-link {
  text-decoration: none;
  color: inherit;
}

.language-link:hover,
.language-link:focus {
  text-decoration: underline;
}

.language-unavailable {
  opacity: 0.5;
  pointer-events: none;
}
```

### Responsive Behavior

The component SHOULD adapt to mobile screens:

```css
@media (max-width: 768px) {
  .language-list {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

## Accessibility Requirements

### ARIA Attributes

- `aria-label` on `<nav>` - Describes purpose
- `aria-current="true"` on current language - Indicates active item
- `aria-disabled="true"` on unavailable languages - Indicates non-functional state
- `hreflang` on links - Specifies target language
- `lang` on links - Specifies link text language

### Keyboard Navigation

- Links MUST be focusable via Tab key
- Current language SHOULD be in tab order but not clickable
- Focus indicators MUST be visible
- No keyboard traps

### Screen Reader Support

Screen reader announcement for the component:

```
"Language switcher, navigation, 3 items
Current language: English
Link: Deutsch
Link: Français"
```

## Integration Points

### Header Integration

```go-html-template
{{/* layouts/partials/header.html */}}
<header>
  <div class="header-content">
    <a href="{{ "/" | relLangURL }}" class="logo">
      {{ site.Title }}
    </a>
    
    <nav class="main-nav">
      {{/* Main menu */}}
    </nav>
    
    {{ partial "language-switcher.html" . }}
  </div>
</header>
```

### Footer Integration

```go-html-template
{{/* layouts/partials/footer.html */}}
<footer>
  <div class="footer-content">
    {{/* Footer content */}}
    
    {{ partial "language-switcher.html" . }}
    
    <p>&copy; {{ now.Year }} {{ site.Title }}</p>
  </div>
</footer>
```

## Variants

### Compact Dropdown Style

For space-constrained layouts, a dropdown style (CSS-only):

```go-html-template
<nav aria-label="{{ i18n "language_switcher" }}" class="language-switcher dropdown">
  <button class="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
    {{ .Language.LanguageName }} ▾
  </button>
  <ul class="dropdown-menu">
    {{ range .Translations }}
      <li>
        <a href="{{ .RelPermalink }}"
           hreflang="{{ .Language.LanguageCode }}"
           lang="{{ .Language.Lang }}">
          {{ .Language.LanguageName }}
        </a>
      </li>
    {{ end }}
  </ul>
</nav>
```

CSS for dropdown:

```css
.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  display: block;
}
```

### Flag Icons (Optional)

If using flag icons for visual enhancement:

```go-html-template
{{ range .AllTranslations }}
  <li class="language-item">
    {{ if eq .Language.Lang $.Language.Lang }}
      <span class="language-current" aria-current="true">
        <span class="flag flag-{{ .Language.Lang }}" aria-hidden="true"></span>
        {{ .Language.LanguageName }}
      </span>
    {{ else }}
      <a href="{{ .RelPermalink }}"
         hreflang="{{ .Language.LanguageCode }}"
         lang="{{ .Language.Lang }}"
         class="language-link">
        <span class="flag flag-{{ .Language.Lang }}" aria-hidden="true"></span>
        {{ .Language.LanguageName }}
      </a>
    {{ end }}
  </li>
{{ end }}
```

**Important**: Flags MUST have `aria-hidden="true"` and text MUST always be present for accessibility.

## Testing Requirements

### Test Cases

1. **Single Language Page**
   - Given: Page has no translations
   - When: Partial is included
   - Then: Component is hidden OR shows only current language

2. **Translated Page**
   - Given: Page has translations in de and fr
   - When: Viewing English version
   - Then: Shows "English" (current), "Deutsch" (link), "Français" (link)

3. **Current Language Indicator**
   - Given: Viewing German version
   - When: Partial renders
   - Then: "Deutsch" has `aria-current="true"`, others are links

4. **Link Targets**
   - Given: On page `/en/about/`
   - When: Clicking German link
   - Then: Navigates to `/de/about/`

5. **Missing Translation**
   - Given: Page translated to en and de only
   - When: Viewing French version
   - Then: Shows appropriate state (disabled or links to home)

### Accessibility Tests

- Tab through switcher with keyboard
- Verify screen reader announcements
- Check focus indicators visible
- Validate ARIA attributes present
- Test with screen reader (NVDA, JAWS, VoiceOver)

### Visual Tests

- Render in all three languages
- Test responsive breakpoints
- Verify current language styling
- Check hover/focus states

## Error Handling

### No Translations Available

If `.IsTranslated` is false:
- Component should not render (conditionally hidden)
- OR show only current language (no links)

### Invalid Language Configuration

If a language is configured but no translation exists:
- Link to homepage of that language
- OR show disabled state
- Never show broken links

### Template Errors

The component should never cause build failure:
- Use `with` checks for safe navigation
- Provide fallbacks for missing data
- Log warnings but don't break build

## Performance Considerations

- ✅ Component is static HTML (no JavaScript)
- ✅ Minimal DOM size (3-5 list items typically)
- ✅ CSS-only interactions (hover, focus)
- ✅ No additional HTTP requests
- ⚠️ Consider lazy-loading flag icons if used

## Documentation Requirements

### For Operators

1. How to position the language switcher (header vs. footer)
2. How to customize styling
3. How to enable/disable flag icons
4. How to handle sites with many languages

### For Theme Developers

1. How to integrate into custom layouts
2. Available CSS classes and hooks
3. How to create custom variants
4. Testing procedures

## Examples

### Complete Working Example

**Partial** (`layouts/partials/language-switcher.html`):

```go-html-template
{{ if .IsTranslated }}
  <nav aria-label="{{ i18n "language_switcher" }}" class="language-switcher">
    <span class="sr-only">{{ i18n "current_language" }}:</span>
    <ul class="language-list">
      {{ range .AllTranslations }}
        <li class="language-item">
          {{ if eq .Language.Lang $.Language.Lang }}
            <span class="language-current" aria-current="true">
              {{ .Language.LanguageName }}
            </span>
          {{ else }}
            <a href="{{ .RelPermalink }}"
               hreflang="{{ .Language.LanguageCode }}"
               lang="{{ .Language.Lang }}"
               class="language-link"
               title="{{ i18n "switch_to" }} {{ .Language.LanguageName }}">
              {{ .Language.LanguageName }}
            </a>
          {{ end }}
        </li>
      {{ end }}
    </ul>
  </nav>
{{ end }}
```

**Styling** (`assets/css/components/language-switcher.css`):

```css
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.language-list {
  display: flex;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.language-item {
  margin: 0;
}

.language-current {
  font-weight: 600;
  color: var(--primary-color, #0066cc);
  padding: 0.25rem 0.5rem;
  border-bottom: 2px solid currentColor;
}

.language-link {
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.language-link:hover,
.language-link:focus {
  border-bottom-color: currentColor;
  outline: none;
}

.language-link:focus-visible {
  outline: 2px solid var(--focus-color, #0066cc);
  outline-offset: 2px;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .language-list {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

**Usage in Layout**:

```go-html-template
<!DOCTYPE html>
<html lang="{{ .Language.LanguageCode }}">
<head>
  {{ partial "head.html" . }}
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="{{ "/" | relLangURL }}" class="logo">
        {{ site.Title }}
      </a>
      {{ partial "main-nav.html" . }}
      {{ partial "language-switcher.html" . }}
    </div>
  </header>
  
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  
  <footer class="site-footer">
    <div class="container">
      {{ partial "footer-content.html" . }}
      {{ partial "language-switcher.html" . }}
    </div>
  </footer>
</body>
</html>
```

## Version History

- **1.0.0** (2025-12-14): Initial specification for 006-i18n-terms feature
