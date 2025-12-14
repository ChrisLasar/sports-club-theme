# Data Model: Localization & Multilingual Content

**Feature**: 006-i18n-terms  
**Date**: 2025-12-14

## Overview

This document defines the data structures, file formats, and configuration patterns for implementing multilingual support in the Hugo sports club theme.

## Configuration Entities

### 1. Language Configuration

**Location**: `config/_default/hugo.toml`

**Schema**:
```toml
defaultContentLanguage = 'en'          # Primary language (ISO 639-1 code)
defaultContentLanguageInSubdir = false # false = default lang at root, true = in /en/

[languages.en]
  languageCode = 'en-US'               # Full locale code (BCP 47)
  languageDirection = 'ltr'            # Text direction: 'ltr' or 'rtl'
  languageName = 'English'             # Display name
  weight = 1                           # Sort order (lower = earlier)

[languages.de]
  languageCode = 'de-DE'
  languageDirection = 'ltr'
  languageName = 'Deutsch'
  weight = 2

[languages.fr]
  languageCode = 'fr-FR'
  languageDirection = 'ltr'
  languageName = 'Français'
  weight = 3
```

**Validation Rules**:
- `defaultContentLanguage` MUST match one of the defined language keys
- `languageCode` SHOULD follow BCP 47 format (e.g., 'en-US', 'de-DE')
- `weight` MUST be unique per language
- `languageDirection` MUST be either 'ltr' or 'rtl'
- `languageName` MUST be non-empty (used in language switcher)

### 2. Label Override Configuration

**Location**: `config/_default/hugo.toml` (within language sections)

**Schema**:
```toml
[languages.en.params.labels]
  home = "Home"                        # Optional: override default i18n value
  teams = "Groups"                     # Custom label instead of "Teams"
  news = "Blog"                        # Custom label instead of "News"
  events = "Events"
  results = "Results"
  members = "Members"

[languages.de.params.labels]
  home = "Startseite"
  teams = "Gruppen"                    # German override
  news = "Neuigkeiten"
  events = "Veranstaltungen"
  results = "Ergebnisse"
  members = "Mitglieder"

[languages.fr.params.labels]
  home = "Accueil"
  teams = "Équipes"
  news = "Actualités"
  events = "Événements"
  results = "Résultats"
  members = "Membres"
```

**Validation Rules**:
- Label keys MUST match identifiers used in templates
- Values MUST be non-empty strings
- Missing keys fall back to i18n translation
- All strings trimmed of leading/trailing whitespace

**Precedence**: `params.labels.{key}` > `i18n` > `{key}` (identifier name)

## Translation Files

### 3. i18n Translation Files

**Location**: `/i18n/`
**Format**: TOML (preferred) or YAML

#### 3.1 English (`i18n/en.toml`)

```toml
# Navigation
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

[about]
other = "About"

[contact]
other = "Contact"

# Common UI Elements
[read_more]
other = "Read more"

[view_all]
other = "View all"

[back]
other = "Back"

[next]
other = "Next"

[previous]
other = "Previous"

[search]
other = "Search"

[menu]
other = "Menu"

[close]
other = "Close"

[loading]
other = "Loading"

# Content Sections
[latest_news]
other = "Latest News"

[upcoming_events]
other = "Upcoming Events"

[recent_results]
other = "Recent Results"

[our_teams]
other = "Our Teams"

[team_members]
other = "Team Members"

# Date/Time
[date_format]
other = "January 2, 2006"

[time_format]
other = "3:04 PM"

[datetime_format]
other = "January 2, 2006 at 3:04 PM"

# Forms & Actions
[submit]
other = "Submit"

[cancel]
other = "Cancel"

[edit]
other = "Edit"

[delete]
other = "Delete"

[save]
other = "Save"

# Status & Feedback
[content_not_translated]
other = "This page is not yet available in English. Content from the default language is displayed."

[page_not_found]
other = "Page not found"

[error_occurred]
other = "An error occurred"

[no_results]
other = "No results found"

# Metadata
[published_on]
other = "Published on"

[updated_on]
other = "Updated on"

[author]
other = "Author"

[category]
other = "Category"

[tags]
other = "Tags"

[share]
other = "Share"

# Accessibility
[skip_to_content]
other = "Skip to content"

[open_menu]
other = "Open menu"

[close_menu]
other = "Close menu"

[language_switcher]
other = "Change language"

[current_language]
other = "Current language"
```

#### 3.2 German (`i18n/de.toml`)

```toml
# Navigation
[home]
other = "Startseite"

[teams]
other = "Mannschaften"

[news]
other = "Neuigkeiten"

[events]
other = "Veranstaltungen"

[results]
other = "Ergebnisse"

[members]
other = "Mitglieder"

[about]
other = "Über uns"

[contact]
other = "Kontakt"

# Common UI Elements
[read_more]
other = "Mehr lesen"

[view_all]
other = "Alle anzeigen"

[back]
other = "Zurück"

[next]
other = "Weiter"

[previous]
other = "Vorherige"

[search]
other = "Suchen"

[menu]
other = "Menü"

[close]
other = "Schließen"

[loading]
other = "Lädt"

# Content Sections
[latest_news]
other = "Neueste Meldungen"

[upcoming_events]
other = "Kommende Veranstaltungen"

[recent_results]
other = "Aktuelle Ergebnisse"

[our_teams]
other = "Unsere Mannschaften"

[team_members]
other = "Teammitglieder"

# Date/Time
[date_format]
other = "02.01.2006"

[time_format]
other = "15:04"

[datetime_format]
other = "02.01.2006 um 15:04"

# Forms & Actions
[submit]
other = "Absenden"

[cancel]
other = "Abbrechen"

[edit]
other = "Bearbeiten"

[delete]
other = "Löschen"

[save]
other = "Speichern"

# Status & Feedback
[content_not_translated]
other = "Diese Seite ist noch nicht auf Deutsch verfügbar. Der Inhalt in der Standardsprache wird angezeigt."

[page_not_found]
other = "Seite nicht gefunden"

[error_occurred]
other = "Ein Fehler ist aufgetreten"

[no_results]
other = "Keine Ergebnisse gefunden"

# Metadata
[published_on]
other = "Veröffentlicht am"

[updated_on]
other = "Aktualisiert am"

[author]
other = "Autor"

[category]
other = "Kategorie"

[tags]
other = "Schlagwörter"

[share]
other = "Teilen"

# Accessibility
[skip_to_content]
other = "Zum Inhalt springen"

[open_menu]
other = "Menü öffnen"

[close_menu]
other = "Menü schließen"

[language_switcher]
other = "Sprache ändern"

[current_language]
other = "Aktuelle Sprache"
```

#### 3.3 French (`i18n/fr.toml`)

```toml
# Navigation
[home]
other = "Accueil"

[teams]
other = "Équipes"

[news]
other = "Actualités"

[events]
other = "Événements"

[results]
other = "Résultats"

[members]
other = "Membres"

[about]
other = "À propos"

[contact]
other = "Contact"

# Common UI Elements
[read_more]
other = "Lire la suite"

[view_all]
other = "Voir tout"

[back]
other = "Retour"

[next]
other = "Suivant"

[previous]
other = "Précédent"

[search]
other = "Rechercher"

[menu]
other = "Menu"

[close]
other = "Fermer"

[loading]
other = "Chargement"

# Content Sections
[latest_news]
other = "Dernières actualités"

[upcoming_events]
other = "Événements à venir"

[recent_results]
other = "Résultats récents"

[our_teams]
other = "Nos équipes"

[team_members]
other = "Membres de l'équipe"

# Date/Time
[date_format]
other = "02/01/2006"

[time_format]
other = "15:04"

[datetime_format]
other = "02/01/2006 à 15:04"

# Forms & Actions
[submit]
other = "Soumettre"

[cancel]
other = "Annuler"

[edit]
other = "Modifier"

[delete]
other = "Supprimer"

[save]
other = "Enregistrer"

# Status & Feedback
[content_not_translated]
other = "Cette page n'est pas encore disponible en français. Le contenu dans la langue par défaut est affiché."

[page_not_found]
other = "Page non trouvée"

[error_occurred]
other = "Une erreur s'est produite"

[no_results]
other = "Aucun résultat trouvé"

# Metadata
[published_on]
other = "Publié le"

[updated_on]
other = "Mis à jour le"

[author]
other = "Auteur"

[category]
other = "Catégorie"

[tags]
other = "Mots-clés"

[share]
other = "Partager"

# Accessibility
[skip_to_content]
other = "Aller au contenu"

[open_menu]
other = "Ouvrir le menu"

[close_menu]
other = "Fermer le menu"

[language_switcher]
other = "Changer de langue"

[current_language]
other = "Langue actuelle"
```

**Validation Rules**:
- Every key in `en.toml` MUST have equivalent in `de.toml` and `fr.toml`
- Translation values MUST be non-empty
- Keys MUST use snake_case or kebab-case (consistent within file)
- Special reserved keys (_one, _other, _few, etc.) for pluralization if needed

**Extension Mechanism**:
Operators can add custom keys to i18n files or override in local `/i18n/` directory.

## Content Structure

### 4. Multilingual Content Files

#### 4.1 Default Language Content

**Pattern**: `content/{section}/{slug}.md`

**Example**: `content/posts/season-kickoff.md`

```yaml
---
title: "Season Kickoff"
date: 2025-12-01
draft: false
author: "members/john-smith"
categories: ["club-announcements"]
tags: ["season", "teams"]
---

Content in default language (English).
```

#### 4.2 Translated Content

**Pattern**: `content/{section}/{slug}.{lang}.md`

**Example**: `content/posts/season-kickoff.de.md`

```yaml
---
title: "Saisonauftakt"
date: 2025-12-01
draft: false
author: "members/john-smith"
categories: ["club-announcements"]
tags: ["saison", "mannschaften"]
---

Inhalt auf Deutsch.
```

**Translation Linking**:
- Hugo automatically links files with same base name
- `season-kickoff.md`, `season-kickoff.de.md`, `season-kickoff.fr.md` are linked
- Can override with `translationKey` in front matter:

```yaml
---
title: "Season Kickoff"
translationKey: "2025-season-start"
---
```

**Validation Rules**:
- Translated files MUST have same location as default
- Language code MUST match configured language
- `translationKey` (if used) MUST be identical across translations

#### 4.3 Section Index Pages

**Default**: `content/posts/_index.md`
**German**: `content/posts/_index.de.md`
**French**: `content/posts/_index.fr.md`

```yaml
---
title: "News"
description: "Latest updates from our sports club"
---
```

### 5. Menu Configuration

#### 5.1 Separate Menu Files (Recommended)

**Location**: `config/_default/menus.{lang}.toml`

**`menus.en.toml`**:
```toml
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

[[main]]
  identifier = "news"
  name = "News"
  pageRef = "/posts"
  weight = 3

[[main]]
  identifier = "events"
  name = "Events"
  pageRef = "/events"
  weight = 4

[[main]]
  identifier = "results"
  name = "Results"
  pageRef = "/results"
  weight = 5

[[main]]
  identifier = "members"
  name = "Members"
  pageRef = "/members"
  weight = 6
```

**`menus.de.toml`**:
```toml
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

[[main]]
  identifier = "news"
  name = "Neuigkeiten"
  pageRef = "/posts"
  weight = 3

# ... etc
```

**Validation Rules**:
- `identifier` SHOULD be consistent across language files (for template fallback)
- `pageRef` MUST point to valid content section
- `weight` determines order within menu

#### 5.2 Alternative: Dynamic Translation in Template

If using single menu config with identifiers:

```toml
# config/_default/menus.toml
[[main]]
  identifier = "teams"
  pageRef = "/teams"
  weight = 2
```

Template resolves translation:
```go-html-template
{{ range .Site.Menus.main }}
  <a href="{{ .URL }}">{{ or (T .Identifier) .Name }}</a>
{{ end }}
```

## Template Data Access Patterns

### 6. Accessing Translations in Templates

#### 6.1 Simple Translation Lookup

```go-html-template
{{ i18n "home" }}        {{/* Returns: Home / Startseite / Accueil */}}
{{ T "teams" }}          {{/* Alias for i18n */}}
```

#### 6.2 Translation with Fallback

```go-html-template
{{ $label := .Site.Language.Params.labels.teams | default (i18n "teams") }}
```

**Precedence**:
1. `languages.{lang}.params.labels.{key}` (operator override)
2. `i18n/{lang}.toml` `[{key}]` (translation file)
3. Key name as-is (fallback if neither exists)

#### 6.3 Current Language Info

```go-html-template
{{ .Language.Lang }}              {{/* en, de, fr */}}
{{ .Language.LanguageCode }}      {{/* en-US, de-DE, fr-FR */}}
{{ .Language.LanguageName }}      {{/* English, Deutsch, Français */}}
{{ .Language.Weight }}            {{/* 1, 2, 3 */}}
```

#### 6.4 Translation Status

```go-html-template
{{ .IsTranslated }}               {{/* true if page has translations */}}
{{ .Translations }}               {{/* slice of translated page objects (excluding current) */}}
{{ .AllTranslations }}            {{/* slice including current page */}}
```

#### 6.5 Link Generation

```go-html-template
{{ .RelPermalink }}               {{/* /de/posts/... */}}
{{ .Permalink }}                  {{/* https://example.org/de/posts/... */}}
{{ .Site.LanguagePrefix }}        {{/* /de or empty for default */}}
```

### 7. Page Object Fields

```go
type Page struct {
  Language struct {
    Lang          string  // "en", "de", "fr"
    LanguageCode  string  // "en-US", "de-DE", "fr-FR"
    LanguageName  string  // "English", "Deutsch", "Français"
    Weight        int     // Sort order
  }
  
  IsTranslated     bool    // Has translations in other languages
  Translations     []Page  // Other language versions (excluding current)
  AllTranslations  []Page  // All language versions (including current)
  TranslationKey   string  // Custom key linking translations
  
  RelPermalink     string  // Language-aware relative URL
  Permalink        string  // Language-aware absolute URL
}
```

## State Transitions

### 8. Content Translation Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ 1. Create Default Language Content                     │
│    - content/posts/article.md                          │
│    - Visible at /posts/article/ (English)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│ 2. Add Translation (Optional)                          │
│    - content/posts/article.de.md                       │
│    - Visible at /de/posts/article/ (German)            │
│    - Linked automatically via filename                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│ 3. Language Switching UI Available                     │
│    - Shows: English (current) | Deutsch (link)         │
│    - If no translation: only shows English             │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│ 4. User Navigates in German                            │
│    - URL: /de/...                                       │
│    - Untranslated pages show English content           │
│    - UI labels in German (via i18n)                    │
└─────────────────────────────────────────────────────────┘
```

## Relationships

### 9. Entity Relationships

```
Language Configuration (hugo.toml)
    ├─> Language (en)
    │       ├─> params.labels.* (overrides)
    │       └─> menus.* (navigation)
    ├─> Language (de)
    │       ├─> params.labels.*
    │       └─> menus.*
    └─> Language (fr)
            ├─> params.labels.*
            └─> menus.*

Translation Files
    ├─> i18n/en.toml
    ├─> i18n/de.toml
    └─> i18n/fr.toml

Content
    ├─> posts/article.md (default)
    │       ├─> article.de.md (German translation)
    │       └─> article.fr.md (French translation)
    └─> events/tournament.md (default only)
            └─> (no translations = fallback to default)
```

## Constraints & Business Rules

### 10. Required Data Constraints

1. **Language Configuration**
   - MUST define at least one language (default)
   - Default language MUST be valid ISO 639-1 code
   - Language weights MUST be unique
   - All configured languages MUST have corresponding i18n file

2. **Translation Files**
   - MUST exist for each configured language
   - MUST be valid TOML or YAML format
   - Keys in default language file SHOULD be present in all languages
   - Missing keys fall back to default language

3. **Content Translations**
   - Translated files MUST use correct language suffix
   - Translation suffix MUST match configured language
   - Front matter structure SHOULD be consistent across translations
   - Required fields (title, date) MUST be present in all versions

4. **Menus**
   - Menu identifiers SHOULD be consistent across languages
   - `pageRef` MUST point to existing content
   - Menu weights determine display order

5. **Links**
   - Internal links MUST use Hugo methods (`.RelPermalink`, `.Permalink`)
   - External links remain unchanged across languages
   - Anchor links preserved with language prefix

### 11. Validation Rules

```yaml
# Pseudo-schema for validation

LanguageConfig:
  defaultContentLanguage: 
    type: string
    required: true
    pattern: ^[a-z]{2}(-[A-Z]{2})?$
  
  languages:
    type: map
    required: true
    min_entries: 1
    key_pattern: ^[a-z]{2}$
    value:
      languageCode: 
        type: string
        required: true
        pattern: ^[a-z]{2}-[A-Z]{2}$
      languageName:
        type: string
        required: true
        min_length: 1
      weight:
        type: integer
        required: true
        unique: true

TranslationFile:
  format: [toml, yaml]
  required: true
  per_language: true
  structure:
    keys:
      pattern: ^[a-z_]+$
      values:
        other: 
          type: string
          required: true
          min_length: 1

ContentFile:
  location: ^content/[^/]+/.*\.md$
  front_matter:
    title:
      type: string
      required: true
    date:
      type: date
      required: true
    translationKey:
      type: string
      optional: true
  translation_suffix: \.{lang}\.md$
```

## Migration & Compatibility

### 12. Single-Language to Multilingual Migration

**Phase 1: Add Language Configuration**
```toml
# Before (implicit English)
title = "Sports Club"

# After (explicit multilingual)
defaultContentLanguage = 'en'

[languages.en]
  languageCode = 'en-US'
  languageName = 'English'
  weight = 1

[languages.de]
  languageCode = 'de-DE'
  languageName = 'Deutsch'
  weight = 2
```

**Phase 2: Extract UI Strings to i18n Files**
```go-html-template
<!-- Before -->
<a href="/teams">Teams</a>

<!-- After -->
<a href="/teams">{{ i18n "teams" }}</a>
```

**Phase 3: Add Translations Incrementally**
- No need to translate all content at once
- Untranslated pages automatically fall back
- Add language switcher when first translations available

## Examples

### 13. Complete Working Examples

#### Example 1: Translating a Blog Post

**English** (`content/posts/welcome.md`):
```yaml
---
title: "Welcome to Our Club"
date: 2025-12-14
categories: ["club-announcements"]
tags: ["welcome", "introduction"]
---

Welcome to our sports club! We're excited to have you here.
```

**German** (`content/posts/welcome.de.md`):
```yaml
---
title: "Willkommen in unserem Verein"
date: 2025-12-14
categories: ["club-announcements"]
tags: ["willkommen", "einführung"]
---

Willkommen in unserem Sportverein! Wir freuen uns, Sie hier begrüßen zu dürfen.
```

**French** (`content/posts/welcome.fr.md`):
```yaml
---
title: "Bienvenue dans notre club"
date: 2025-12-14
categories: ["club-announcements"]
tags: ["bienvenue", "introduction"]
---

Bienvenue dans notre club sportif ! Nous sommes ravis de vous accueillir.
```

**Access in Template**:
```go-html-template
<h1>{{ .Title }}</h1>
<p>{{ i18n "published_on" }}: {{ .Date.Format (i18n "date_format") }}</p>

{{ if .IsTranslated }}
  <nav aria-label="{{ i18n "language_switcher" }}">
    <ul>
      {{ range .AllTranslations }}
        <li>
          <a href="{{ .RelPermalink }}" 
             hreflang="{{ .Language.LanguageCode }}"
             {{ if eq .Language.Lang $.Language.Lang }}aria-current="true"{{ end }}>
            {{ .Language.LanguageName }}
          </a>
        </li>
      {{ end }}
    </ul>
  </nav>
{{ end }}
```

#### Example 2: Section Index with Partial Translation

**English** (`content/teams/_index.md`):
```yaml
---
title: "Our Teams"
description: "Meet the teams competing this season"
---
```

**German** (`content/teams/_index.de.md`):
```yaml
---
title: "Unsere Mannschaften"
description: "Lernen Sie die Mannschaften dieser Saison kennen"
---
```

**French**: (missing - falls back to English)

#### Example 3: Custom Label Override

**Configuration**:
```toml
[languages.en.params.labels]
  teams = "Groups"
  news = "Blog"

[languages.de.params.labels]
  teams = "Gruppen"
  news = "Blog"
```

**Template**:
```go-html-template
{{ $label := .Site.Language.Params.labels.teams | default (i18n "teams") }}
<a href="{{ "teams" | relLangURL }}">{{ $label }}</a>
{{/* Outputs: <a href="/teams">Groups</a> (English) */}}
{{/* Outputs: <a href="/de/teams">Gruppen</a> (German) */}}
```

## Summary

This data model defines:

- ✅ **Configuration structure** for languages and overrides
- ✅ **Translation file format** with all required keys
- ✅ **Content organization** using translation by filename
- ✅ **Menu configuration** for multilingual navigation
- ✅ **Template access patterns** for i18n data
- ✅ **Validation rules** for data integrity
- ✅ **Migration path** from single to multilingual
- ✅ **Complete examples** for common scenarios

All data structures are designed to:
- Work with Hugo's built-in i18n system
- Support partial translations with graceful fallback
- Allow operator customization without template changes
- Maintain performance with static build-time resolution
- Follow Hugo best practices and conventions
