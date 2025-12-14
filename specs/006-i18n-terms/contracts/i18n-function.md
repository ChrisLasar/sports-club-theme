# i18n Template Function Contract

**Feature**: 006-i18n-terms  
**Version**: 1.0.0  
**Type**: Hugo Template Function Specification

## Overview

This document specifies the contract for using Hugo's i18n translation functions in theme templates. These are build-time functions that resolve translation strings based on the current page's language context.

## Function Signatures

### Primary Translation Function

```go
// Returns translated string for the given key
func i18n(key string, context ...interface{}) string

// Alias for i18n
func T(key string, context ...interface{}) string
```

## Usage Patterns

### 1. Simple Translation

**Input**:
```go-html-template
{{ i18n "home" }}
{{ T "teams" }}
```

**Behavior**:
- Looks up key in current language's i18n file (`i18n/{lang}.toml`)
- Returns the `other` value for the key
- Falls back to default language if key missing in current language
- Returns key name if not found in any language file

**Output Examples**:
```
Language: en → "Home"
Language: de → "Startseite"
Language: fr → "Accueil"
```

### 2. Translation with Count (Pluralization)

**Input**:
```go-html-template
{{ T "day" 1 }}
{{ T "day" 5 }}
```

**i18n File Definition**:
```toml
# en.toml
[day]
one = "day"
other = "days"

# de.toml
[day]
one = "Tag"
other = "Tage"
```

**Behavior**:
- Uses count to select appropriate plural form
- Supports forms: zero, one, two, few, many, other
- Follows Unicode CLDR plural rules per language

**Output Examples**:
```
English:
  T "day" 1 → "day"
  T "day" 5 → "days"

German:
  T "day" 1 → "Tag"
  T "day" 5 → "Tage"
```

### 3. Translation with Parameters

**Input**:
```go-html-template
{{ T "welcome_message" (dict "name" "John" "count" 1) }}
```

**i18n File Definition**:
```toml
# en.toml
[welcome_message]
one = "Welcome, {{ .name }}! You have {{ .count }} notification."
other = "Welcome, {{ .name }}! You have {{ .count }} notifications."

# de.toml
[welcome_message]
one = "Willkommen, {{ .name }}! Sie haben {{ .count }} Benachrichtigung."
other = "Willkommen, {{ .name }}! Sie haben {{ .count }} Benachrichtigungen."
```

**Behavior**:
- Substitutes parameters into translation template
- Supports both count-based pluralization and named parameters
- Parameters must be passed as dict or map

**Output Examples**:
```
English: "Welcome, John! You have 1 notification."
German: "Willkommen, John! Sie haben 1 Benachrichtigung."
```

## Fallback Behavior

### Fallback Chain

```
Current Language i18n File
    ↓ (if key missing)
Default Language i18n File
    ↓ (if key missing)
Key Name as String
```

**Example**:
```go-html-template
{{ i18n "nonexistent_key" }}
```

Output: `"nonexistent_key"`

### Missing Translation Detection

**Pattern**:
```go-html-template
{{ if i18n "key" | eq "key" }}
  <!-- Translation missing, show fallback -->
{{ else }}
  {{ i18n "key" }}
{{ end }}
```

## Integration with Label Overrides

### Recommended Pattern

```go-html-template
{{/* Check for operator override first, then i18n */}}
{{ $label := .Site.Language.Params.labels.teams | default (i18n "teams") }}
<a href="{{ "teams" | relLangURL }}">{{ $label }}</a>
```

**Precedence**:
1. `.Site.Language.Params.labels.{key}` (operator config override)
2. `i18n "{key}"` (translation file)
3. `"{key}"` (literal key name)

### Implementation Helper

Create a partial for consistent label resolution:

**File**: `layouts/partials/label.html`

```go-html-template
{{/*
  Usage: {{ partial "label.html" "teams" }}
  Returns: Operator override > i18n > key name
*/}}
{{ $key := . }}
{{ $override := index $.Site.Language.Params.labels $key }}
{{ $translation := i18n $key }}
{{ return (or $override $translation $key) }}
```

**Template Usage**:
```go-html-template
<a href="{{ "teams" | relLangURL }}">
  {{ partial "label.html" "teams" }}
</a>
```

## Menu Integration

### Pattern for Menu Items

```go-html-template
{{ range .Site.Menus.main }}
  <a href="{{ .URL }}">
    {{ or (T .Identifier) .Name }}
  </a>
{{ end }}
```

**Behavior**:
- Tries to translate menu item identifier
- Falls back to menu item's configured name
- Allows dynamic translation of shared menu structure

## Date/Time Formatting

### Pattern for Localized Dates

```go-html-template
{{ .Date.Format (i18n "date_format") }}
{{ .Date.Format (i18n "time_format") }}
{{ .Date.Format (i18n "datetime_format") }}
```

**i18n Definitions**:
```toml
# en.toml
[date_format]
other = "January 2, 2006"

[time_format]
other = "3:04 PM"

[datetime_format]
other = "January 2, 2006 at 3:04 PM"

# de.toml
[date_format]
other = "02.01.2006"

[time_format]
other = "15:04"

[datetime_format]
other = "02.01.2006 um 15:04"
```

## Error Handling

### Build-Time Warnings

Hugo will emit warnings during build for:
- Missing translation keys (with `--printI18nWarnings`)
- Malformed i18n files
- Invalid pluralization forms

**Command**:
```bash
hugo --printI18nWarnings
```

**Output Example**:
```
i18n|MISSING_TRANSLATION de "welcome_message"
```

### Runtime Behavior

i18n functions never error at runtime:
- Missing keys return key name
- Invalid parameters ignored
- Malformed templates render partially

## Performance Considerations

- ✅ All translation resolution happens at build time
- ✅ Zero runtime overhead (static strings in HTML)
- ✅ No client-side JavaScript required
- ⚠️ Large i18n files may slightly increase build time
- 💡 Recommendation: Keep translation files < 100 keys each

## Testing Contract

### Required Tests

1. **Simple Translation**
   ```
   Given: Key "home" exists in all languages
   When: Template calls {{ i18n "home" }}
   Then: Returns correct translation for current language
   ```

2. **Missing Translation**
   ```
   Given: Key "missing_key" does not exist
   When: Template calls {{ i18n "missing_key" }}
   Then: Returns "missing_key"
   ```

3. **Pluralization**
   ```
   Given: Key "item" has one/other forms
   When: Template calls {{ T "item" 1 }} and {{ T "item" 5 }}
   Then: Returns "item" and "items" respectively
   ```

4. **Operator Override**
   ```
   Given: params.labels.teams = "Groups" in config
   When: Template uses label resolution pattern
   Then: Returns "Groups" instead of i18n value
   ```

5. **Fallback Chain**
   ```
   Given: Key exists in default language but not current
   When: Template calls {{ i18n "key" }}
   Then: Returns default language value
   ```

## Examples

### Complete Header Navigation

```go-html-template
<nav aria-label="{{ i18n "open_menu" }}">
  <button aria-label="{{ i18n "menu" }}">
    {{ i18n "menu" }}
  </button>
  <ul>
    {{ range .Site.Menus.main }}
      <li>
        <a href="{{ .URL }}">
          {{ or (T .Identifier) .Name }}
        </a>
      </li>
    {{ end }}
  </ul>
</nav>
```

### Content List with Metadata

```go-html-template
{{ range .Pages }}
  <article>
    <h2>
      <a href="{{ .RelPermalink }}">{{ .Title }}</a>
    </h2>
    <p class="meta">
      {{ i18n "published_on" }} 
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format (i18n "date_format") }}
      </time>
      {{ with .Params.author }}
        {{ i18n "by" }} {{ . }}
      {{ end }}
    </p>
    <p>{{ .Summary }}</p>
    <a href="{{ .RelPermalink }}">
      {{ i18n "read_more" }} <span aria-hidden="true">→</span>
    </a>
  </article>
{{ end }}
```

### Language Switcher Component

```go-html-template
{{ if .IsTranslated }}
  <nav aria-label="{{ i18n "language_switcher" }}">
    <span>{{ i18n "current_language" }}: </span>
    <ul>
      {{ range .AllTranslations }}
        <li>
          {{ if eq .Language.Lang $.Language.Lang }}
            <span aria-current="true">{{ .Language.LanguageName }}</span>
          {{ else }}
            <a href="{{ .RelPermalink }}" 
               hreflang="{{ .Language.LanguageCode }}"
               lang="{{ .Language.Lang }}">
              {{ .Language.LanguageName }}
            </a>
          {{ end }}
        </li>
      {{ end }}
    </ul>
  </nav>
{{ end }}
```

### Content Not Translated Notice

```go-html-template
{{ if and (ne .Language.Lang site.DefaultContentLanguage) (not .IsTranslated) }}
  <aside class="alert alert-info" role="status">
    <p>{{ i18n "content_not_translated" }}</p>
  </aside>
{{ end }}
```

## Best Practices

### DO:
✅ Use `i18n` or `T` for all user-visible strings
✅ Define all keys in default language first
✅ Keep translation keys descriptive (e.g., `published_on`, not `pub`)
✅ Use snake_case for consistency
✅ Provide context in i18n file comments
✅ Test with all configured languages
✅ Use params.labels for operator overrides

### DON'T:
❌ Hardcode strings in templates
❌ Use i18n for non-translatable content (UUIDs, etc.)
❌ Create language-specific template files (use i18n instead)
❌ Forget to add keys to all language files
❌ Use complex logic inside translation strings
❌ Rely on specific fallback behavior (always define keys)

## Version History

- **1.0.0** (2025-12-14): Initial specification for 006-i18n-terms feature
