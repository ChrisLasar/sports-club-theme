# Phase 0: Research & Technical Decisions

**Feature**: Localization & Multilingual Content (006-i18n-terms)  
**Date**: 2025-12-14

## Research Questions & Findings

### Q1: How should we structure multilingual content in Hugo?

**Decision**: Translation by filename (not separate content directories)

**Rationale**:
- User requirement: "operator can offer individual pages in multiple languages without translating all pages"
- Translation by filename allows partial translations more naturally
- Files like `post.md` (default), `post.de.md`, `post.fr.md` can coexist
- Simpler mental model for editors: translations are adjacent to originals
- Hugo automatically falls back to default language when translation missing

**Alternatives Considered**:
- **Separate content directories** (`content/en/`, `content/de/`, `content/fr/`):
  - Pros: Cleaner separation, better for fully-translated sites
  - Cons: More overhead for partial translations, harder to see what's translated
  - **Rejected**: User wants selective translation, not full site duplication

**Hugo Documentation Reference**:
- Translation by filename uses suffixes: `about.md`, `about.de.md`, `about.fr.md`
- Files in same directory are automatically linked as translations
- Can override with `translationKey` in front matter if needed

### Q2: What should the URL structure be for different languages?

**Decision**: Language prefix in path with default language at root (configurable)

**Rationale**:
- User requirement: "Language selection is coded in the url, eg. exampledomain.com/de/..."
- Standard multilingual URL pattern: `/de/posts/...`, `/fr/posts/...`
- Default language can be at root (`/posts/...`) or subdirectory (`/en/posts/...`)
- SEO-friendly: search engines understand language from URL
- Shareable: language persists across navigation

**Configuration Approach**:
```toml
defaultContentLanguage = 'en'
defaultContentLanguageInSubdir = false  # English at root

[languages.en]
  languageCode = 'en-US'
  languageName = 'English'
  weight = 1

[languages.de]
  languageCode = 'de-DE'
  languageName = 'Deutsch'
  weight = 2

[languages.fr]
  languageCode = 'fr-FR'
  languageName = 'Français'
  weight = 3
```

**Alternatives Considered**:
- **Query parameters** (`?lang=de`):
  - Pros: Simpler routing
  - Cons: Not SEO-friendly, harder to share, not standard
  - **Rejected**: Against web standards and user requirement

- **Subdomains** (`de.example.org`):
  - Pros: Clear separation
  - Cons: Requires DNS/hosting setup, overkill for this use case
  - **Rejected**: Too complex for target users

### Q3: How should UI labels (navigation, buttons) be localized?

**Decision**: Hugo i18n system with TOML translation files

**Rationale**:
- Hugo's built-in `i18n` function with translation files in `/i18n/` directory
- Translation files: `en.toml`, `de.toml`, `fr.toml`
- Template usage: `{{ i18n "home" }}` or `{{ T "home" }}`
- Supports plural forms and parameterized strings
- Operator can add custom translations without editing templates

**Translation File Structure**:
```toml
# i18n/en.toml
[home]
other = "Home"

[teams]
other = "Teams"

[news]
other = "News"

[events]
other = "Events"

[results]
other = "Results"

[members]
other = "Members"
```

**Alternatives Considered**:
- **Hardcoded strings in templates**:
  - Pros: Simple initially
  - Cons: Requires template edits to change labels, violates Constitution
  - **Rejected**: Not maintainable, not operator-friendly

- **JavaScript-based translation**:
  - Pros: Dynamic switching
  - Cons: Violates Constitution (must work without JS), client-side overhead
  - **Rejected**: Against static-first principle

### Q4: How should operators override specific terms?

**Decision**: Language-specific params in hugo.toml

**Rationale**:
- User requirement: "operator should be able to override individual terms"
- Hugo allows language-specific parameters in config
- Templates check params first, then fall back to i18n
- No template editing required
- Version-control friendly

**Implementation Pattern**:
```toml
[languages.en.params.labels]
  teams = "Groups"      # Override "Teams" → "Groups"
  news = "Blog"         # Override "News" → "Blog"

[languages.de.params.labels]
  teams = "Gruppen"     # Override German label
```

**Template Pattern**:
```go-html-template
{{ $label := .Site.Language.Params.labels.teams | default (i18n "teams") }}
<a href="/teams">{{ $label }}</a>
```

**Alternatives Considered**:
- **Editing i18n files directly**:
  - Pros: Centralized translations
  - Cons: Overwritten on theme updates, harder for operators
  - **Rejected**: Not upgrade-safe

- **Custom JSON/YAML in /data**:
  - Pros: Flexible structure
  - Cons: Unnecessary complexity, duplicates i18n system
  - **Rejected**: Hugo's built-in system is sufficient

### Q5: How to handle internal links in multilingual context?

**Decision**: Use Hugo's `.RelPermalink` and `.Permalink` methods

**Rationale**:
- User requirement: "Every internal link should link to a page instance of the current language"
- Hugo automatically generates language-aware permalinks
- `.RelPermalink` returns path with language prefix (e.g., `/de/about/`)
- `.Permalink` returns full URL with language
- No manual URL construction needed

**Best Practices**:
```go-html-template
{{/* Always use Hugo methods, never hardcode URLs */}}
<a href="{{ .RelPermalink }}">{{ .Title }}</a>

{{/* For language switching */}}
{{ range .Translations }}
  <a href="{{ .RelPermalink }}" hreflang="{{ .Language.LanguageCode }}">
    {{ .Language.LanguageName }}
  </a>
{{ end }}

{{/* For menu items */}}
{{ range .Site.Menus.main }}
  <a href="{{ .URL }}">{{ or (T .Identifier) .Name }}</a>
{{ end }}
```

**Common Pitfalls to Avoid**:
- ❌ Hardcoding URLs: `/about/` → won't work for `/de/about/`
- ❌ String concatenation: `{{ .Site.LanguagePrefix }}/about/` → fragile
- ✅ Using Hugo methods: `{{ .RelPermalink }}` → always correct

### Q6: How to implement language switching UI?

**Decision**: Dedicated partial with `.Translations` and `.AllTranslations`

**Rationale**:
- `.Translations` returns translations of current page (excluding current language)
- `.AllTranslations` returns all translations including current (useful for full list)
- Can show availability: some pages may not have all translations
- Accessible: proper `hreflang` and `lang` attributes

**Implementation Strategy**:
```go-html-template
{{/* partials/language-switcher.html */}}
{{ if .IsTranslated }}
  <nav aria-label="Language switcher">
    <ul>
      <li>
        <span aria-current="true">{{ .Language.LanguageName }}</span>
      </li>
      {{ range .Translations }}
        <li>
          <a href="{{ .RelPermalink }}" hreflang="{{ .Language.LanguageCode }}">
            {{ .Language.LanguageName }}
          </a>
        </li>
      {{ end }}
    </ul>
  </nav>
{{ end }}
```

**Alternatives Considered**:
- **Dropdown select**:
  - Pros: Compact
  - Cons: Requires JavaScript for navigation (violates Constitution)
  - **Rejected**: Must work without JS

- **Flag icons**:
  - Pros: Visual
  - Cons: Accessibility issues, not all languages have flags
  - **Rejected**: Text labels are more accessible

### Q7: How to handle fallback for missing translations?

**Decision**: Hugo's automatic fallback + explicit messaging

**Rationale**:
- Hugo automatically serves default language content when translation missing
- User won't see broken pages or 404s
- Can detect and inform user: "This page is not available in [language]"
- Maintains navigation structure even with partial translations

**Detection Pattern**:
```go-html-template
{{ if ne .Language.Lang .Site.DefaultContentLanguage }}
  {{ if not .IsTranslated }}
    <aside class="alert alert-info">
      <p>{{ i18n "content_not_translated" }}</p>
    </aside>
  {{ end }}
{{ end }}
```

**Translation String**:
```toml
# i18n/de.toml
[content_not_translated]
other = "Diese Seite ist noch nicht auf Deutsch verfügbar. Der englische Inhalt wird angezeigt."

# i18n/fr.toml
[content_not_translated]
other = "Cette page n'est pas encore disponible en français. Le contenu anglais est affiché."
```

### Q8: What metadata is needed for SEO and social sharing?

**Decision**: Language attributes and alternate links in `<head>`

**Rationale**:
- `<html lang="...">` attribute for primary language
- `<link rel="alternate" hreflang="...">` for translations
- Open Graph `og:locale` and `og:locale:alternate`
- Helps search engines understand multilingual structure

**Implementation in `head.html` partial**:
```go-html-template
<html lang="{{ .Language.LanguageCode }}">

{{/* In <head> */}}
<link rel="canonical" href="{{ .Permalink }}" />

{{ range .AllTranslations }}
  <link rel="alternate" hreflang="{{ .Language.LanguageCode }}" href="{{ .Permalink }}" />
{{ end }}

<meta property="og:locale" content="{{ .Language.LanguageCode }}" />
{{ range .Translations }}
  <meta property="og:locale:alternate" content="{{ .Language.LanguageCode }}" />
{{ end }}
```

### Q9: How to structure menu configuration for multiple languages?

**Decision**: Language-specific menu files or config sections

**Rationale**:
- Menus can have different entries per language
- Can use identifiers for translation lookup
- Supports both approaches: separate files or single config

**Approach 1: Separate files** (Recommended)
```toml
# config/_default/menus.en.toml
[[main]]
  identifier = "home"
  name = "Home"
  pageRef = "/"
  weight = 1

[[main]]
  identifier = "teams"
  name = "Teams"
  pageRef = "/teams"
  weight = 2

# config/_default/menus.de.toml
[[main]]
  identifier = "home"
  name = "Startseite"
  pageRef = "/"
  weight = 1

[[main]]
  identifier = "teams"
  name = "Mannschaften"
  pageRef = "/teams"
  weight = 2
```

**Approach 2: Dynamic translation in template**
```go-html-template
{{ range .Site.Menus.main }}
  <a href="{{ .URL }}">{{ or (T .Identifier) .Name }}</a>
{{ end }}
```

### Q10: What about date and number formatting?

**Decision**: Use Hugo's date formatting with language-aware layouts

**Rationale**:
- Hugo's `.Format` respects locale settings
- Can use language-specific date/time formats
- No additional libraries needed

**Implementation**:
```go-html-template
{{/* Different formats per language */}}
{{ if eq .Language.Lang "de" }}
  {{ .Date.Format "02.01.2006" }}  {{/* DD.MM.YYYY */}}
{{ else if eq .Language.Lang "fr" }}
  {{ .Date.Format "02/01/2006" }}  {{/* DD/MM/YYYY */}}
{{ else }}
  {{ .Date.Format "January 2, 2006" }}  {{/* Month Day, Year */}}
{{ end }}
```

**Better approach** (Using i18n):
```toml
# i18n/en.toml
[date_format]
other = "January 2, 2006"

# i18n/de.toml
[date_format]
other = "02.01.2006"

# i18n/fr.toml
[date_format]
other = "02/01/2006"
```

```go-html-template
{{ .Date.Format (i18n "date_format") }}
```

## Best Practices Summary

### DO:
✅ Use `{{ i18n "key" }}` or `{{ T "key" }}` for all UI labels
✅ Use `.RelPermalink` and `.Permalink` for all internal links
✅ Provide translation files for all three languages (en, de, fr)
✅ Use `hreflang` attributes on language switcher links
✅ Set `lang` attribute on `<html>` element
✅ Include alternate language links in `<head>`
✅ Test with partial translations to verify fallback
✅ Use language-specific params for operator overrides
✅ Provide clear documentation with examples

### DON'T:
❌ Hardcode URLs or language prefixes
❌ Use JavaScript for language switching (must work without JS)
❌ Forget to add `<link rel="alternate">` tags
❌ Assume all pages are translated
❌ Use flag icons without text labels (accessibility)
❌ Edit theme templates for custom labels (use config)
❌ Break navigation when translations are missing

## Performance Considerations

### i18n File Loading
- Hugo loads all i18n files at build time (not runtime)
- Minimal impact on build performance
- No client-side overhead
- Consider: Only include necessary translation keys to keep files manageable

### Content Organization
- Translation by filename keeps related files together
- Hugo efficiently processes translations during build
- No additional database or API calls needed
- Static output remains performant

## Documentation Requirements

### For Operators
1. How to configure languages in `hugo.toml`
2. How to create translated pages (filename conventions)
3. How to override UI labels via config params
4. How to add custom translation strings
5. How language fallback works

### For Content Editors
1. How to create a translated version of a page
2. What happens when translation is missing
3. How to link between translated pages
4. Front matter fields that should be translated

### For Theme Developers
1. How to use `i18n` function in templates
2. How to create language-aware partials
3. How to implement language switcher
4. How to add new translatable strings

## Migration Strategy

### Existing Single-Language Sites
1. Set `defaultContentLanguage` to current language
2. Add i18n files for UI labels
3. Gradually add translations for key pages
4. Add language switcher to header
5. Update templates to use `i18n` function

### New Multilingual Sites
1. Configure all languages from start
2. Create translated versions of key content
3. Use English as default, translate selectively
4. Document which pages are available in which languages

## Testing Strategy

### Build-Time Tests
- Verify all three languages render without errors
- Check that missing translations fall back correctly
- Validate all internal links resolve properly

### Content Tests
- Create example page in all three languages
- Create example page in only default language
- Verify fallback message appears appropriately

### Navigation Tests
- Test language switcher on translated pages
- Test language switcher on non-translated pages
- Verify menu items appear in correct language

### SEO Tests
- Validate `hreflang` attributes present
- Check `lang` attribute on HTML element
- Verify Open Graph locale metadata

## Next Steps (Phase 1)

1. Create data model for i18n configuration
2. Design i18n file structure and initial translation keys
3. Create language switcher partial specification
4. Update template specifications to use `i18n` function
5. Document operator override mechanism
6. Create example translated content
