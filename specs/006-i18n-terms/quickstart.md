# Quickstart: Multilingual Support

**Feature**: 006-i18n-terms  
**Audience**: Site Operators & Content Editors  
**Time**: 15-20 minutes

## Overview

This quickstart guide will walk you through:

1. Enabling multilingual support for German, English, and French
2. Translating UI labels (navigation, buttons, etc.)
3. Creating translated content pages
4. Adding a language switcher
5. Customizing specific terms

By the end, you'll have a working multilingual site with selectively translated content.

## Prerequisites

- Hugo 0.152+ (Extended edition) installed
- Existing sports club theme site
- Text editor

## Step 1: Configure Languages (5 min)

### 1.1 Update Hugo Configuration

Edit `config/_default/hugo.toml`:

```toml
# Set your default language
defaultContentLanguage = 'en'

# false = English at root (/about/)
# true = English in subdirectory (/en/about/)
defaultContentLanguageInSubdir = false

# Define all three languages
[languages.en]
  languageCode = 'en-US'
  languageDirection = 'ltr'
  languageName = 'English'
  weight = 1

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

**What this does**:
- Sets English as the default language
- Enables German and French as additional languages
- English pages will be at root (`/about/`), German at `/de/about/`, French at `/fr/about/`

### 1.2 Test the Configuration

```bash
hugo server
```

Visit `http://localhost:1313/de/` and `http://localhost:1313/fr/` - you should see your site (in English for now, but at the German/French URLs).

## Step 2: Add Translation Files (5 min)

### 2.1 Create i18n Directory

```bash
mkdir -p i18n
```

### 2.2 Create English Translations

Create `i18n/en.toml`:

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

# Common UI
[read_more]
other = "Read more"

[view_all]
other = "View all"

[back]
other = "Back"

# Content sections
[latest_news]
other = "Latest News"

[upcoming_events]
other = "Upcoming Events"

[recent_results]
other = "Recent Results"

# Dates
[date_format]
other = "January 2, 2006"

# Language switcher
[language_switcher]
other = "Change language"

[content_not_translated]
other = "This page is not yet available in English. Content from the default language is displayed."
```

### 2.3 Create German Translations

Create `i18n/de.toml`:

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

# Common UI
[read_more]
other = "Mehr lesen"

[view_all]
other = "Alle anzeigen"

[back]
other = "Zurück"

# Content sections
[latest_news]
other = "Neueste Meldungen"

[upcoming_events]
other = "Kommende Veranstaltungen"

[recent_results]
other = "Aktuelle Ergebnisse"

# Dates
[date_format]
other = "02.01.2006"

# Language switcher
[language_switcher]
other = "Sprache ändern"

[content_not_translated]
other = "Diese Seite ist noch nicht auf Deutsch verfügbar. Der Inhalt in der Standardsprache wird angezeigt."
```

### 2.4 Create French Translations

Create `i18n/fr.toml`:

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

# Common UI
[read_more]
other = "Lire la suite"

[view_all]
other = "Voir tout"

[back]
other = "Retour"

# Content sections
[latest_news]
other = "Dernières actualités"

[upcoming_events]
other = "Événements à venir"

[recent_results]
other = "Résultats récents"

# Dates
[date_format]
other = "02/01/2006"

# Language switcher
[language_switcher]
other = "Changer de langue"

[content_not_translated]
other = "Cette page n'est pas encore disponible en français. Le contenu dans la langue par défaut est affiché."
```

## Step 3: Update Templates to Use i18n (Already Done)

The theme templates are already updated to use `{{ i18n "key" }}` for all UI labels. If you're customizing templates, use this pattern:

```go-html-template
<!-- Before (hardcoded) -->
<a href="/teams">Teams</a>

<!-- After (translated) -->
<a href="{{ "teams" | relLangURL }}">{{ i18n "teams" }}</a>
```

**Test it**: Refresh your browser and navigate to `/de/` - the navigation should now be in German!

## Step 4: Create Translated Content (5 min)

Let's translate an example news post.

### 4.1 Find Your Content

Locate an existing post, for example:
`content/posts/season-kickoff-u13-boys.md`

### 4.2 Create German Translation

Create a new file with `.de.md` suffix:
`content/posts/season-kickoff-u13-boys.de.md`

Copy the content and translate:

```yaml
---
title: "Saisonauftakt: U13 Jungen-Team startet stark"
date: 2025-11-05T10:00:00Z
draft: false
author: "members/john-smith"
categories: ["team-news"]
tags: ["u13-boys", "saison-2025"]
teams:
  - "teams/u13-boys"
---

Die U13 Jungen haben mit einem beeindruckenden 4:2-Sieg gegen die Rivalen in die Saison gestartet...

[Rest of content in German]
```

### 4.3 Create French Translation (Optional)

Similarly, create `content/posts/season-kickoff-u13-boys.fr.md`:

```yaml
---
title: "Début de saison : L'équipe U13 garçons démarre fort"
date: 2025-11-05T10:00:00Z
draft: false
author: "members/john-smith"
categories: ["team-news"]
tags: ["u13-boys", "saison-2025"]
teams:
  - "teams/u13-boys"
---

L'équipe U13 garçons a commencé la saison avec une victoire impressionnante de 4-2 contre leurs rivaux...

[Rest of content in French]
```

### 4.4 Test Translations

```bash
hugo server
```

Visit:
- English: `http://localhost:1313/news/2025/11/season-kickoff-u13-boys/`
- German: `http://localhost:1313/de/news/2025/11/season-kickoff-u13-boys/`
- French: `http://localhost:1313/fr/news/2025/11/season-kickoff-u13-boys/`

You should see the translated versions!

## Step 5: Customize Specific Terms (Optional) (3 min)

Want to use "Groups" instead of "Teams" on your English site?

### 5.1 Add Label Overrides

Edit `config/_default/hugo.toml`, add to the `[languages.en]` section:

```toml
[languages.en]
  languageCode = 'en-US'
  languageName = 'English'
  weight = 1
  
  # Custom label overrides
  [languages.en.params.labels]
    teams = "Groups"
    news = "Blog"

[languages.de]
  languageCode = 'de-DE'
  languageName = 'Deutsch'
  weight = 2
  
  # German overrides
  [languages.de.params.labels]
    teams = "Gruppen"
```

### 5.2 Test Overrides

Restart Hugo server and check the navigation - "Teams" should now show as "Groups" in English and "Gruppen" in German!

## Step 6: Verify Everything Works

### Checklist

- [ ] Visit `/de/` - navigation in German?
- [ ] Visit `/fr/` - navigation in French?
- [ ] Click a translated post - correct language?
- [ ] Click an untranslated post from `/de/` - shows English content?
- [ ] Language switcher appears on translated pages?
- [ ] Custom label overrides visible?

## Common Tasks

### Translating Section Index Pages

To translate the "News" section page:

**English** (already exists): `content/posts/_index.md`

```yaml
---
title: "News"
description: "Latest updates from our club"
---
```

**German**: Create `content/posts/_index.de.md`

```yaml
---
title: "Neuigkeiten"
description: "Aktuelle Meldungen aus unserem Verein"
---
```

### Translating Team Pages

**English**: `content/teams/u13-boys/index.md`

**German**: `content/teams/u13-boys/index.de.md`

**French**: `content/teams/u13-boys/index.fr.md`

Hugo automatically links these as translations because they share the same path.

### Adding a New Translation Key

If you need a new UI label:

1. Add to all three `i18n/*.toml` files:

```toml
[your_new_key]
other = "Your English text"
```

2. Use in templates:

```go-html-template
{{ i18n "your_new_key" }}
```

## Troubleshooting

### Navigation Still in English

**Problem**: After adding i18n files, navigation still shows English.

**Solution**:
- Check file names: `i18n/de.toml` (not `i18n/german.toml`)
- Verify TOML syntax (no missing quotes)
- Restart Hugo server

### Translation Not Showing

**Problem**: Created `post.de.md` but still seeing English version.

**Solution**:
- Check file is in correct location (same directory as `post.md`)
- Verify language suffix matches configured language (`de`, not `ger` or `german`)
- Check front matter is valid YAML/TOML
- Run `hugo --printI18nWarnings` to see any warnings

### Language Switcher Not Appearing

**Problem**: No language links visible.

**Solution**:
- Language switcher only appears on pages WITH translations
- Create at least one translated version of a page
- Check that `{{ partial "language-switcher.html" . }}` is in your layout

### Wrong Language URL

**Problem**: German page showing at `/de-DE/` instead of `/de/`.

**Solution**:
- Language code in config should be short form: `de`, not `de-DE`
- `languageCode` can be full form `de-DE` (for metadata)
- The language key itself must be short: `[languages.de]`

## Next Steps

### Add More Translations

- Translate key pages (About, Contact)
- Translate team pages
- Translate important news posts

### Customize Styling

- Style the language switcher (see `layouts/partials/language-switcher.html`)
- Add flag icons (optional, ensure accessibility)
- Make responsive for mobile

### Configure Menus

Create language-specific menus:

**`config/_default/menus.en.toml`**:

```toml
[[main]]
  name = "Home"
  pageRef = "/"
  weight = 1

[[main]]
  name = "Teams"
  pageRef = "/teams"
  weight = 2
```

**`config/_default/menus.de.toml`**:

```toml
[[main]]
  name = "Startseite"
  pageRef = "/"
  weight = 1

[[main]]
  name = "Mannschaften"
  pageRef = "/teams"
  weight = 2
```

### Documentation

- Document which pages are translated
- Create translation guidelines for content editors
- Plan which pages need translation priority

## Support

For more information:

- **Full Documentation**: See `/specs/006-i18n-terms/` directory
- **Hugo Docs**: [gohugo.io/content-management/multilingual](https://gohugo.io/content-management/multilingual/)
- **i18n Function**: [gohugo.io/functions/i18n](https://gohugo.io/functions/i18n/)

## Summary

You've successfully:

✅ Configured three languages (English, German, French)  
✅ Created translation files for UI labels  
✅ Translated a content page  
✅ Customized specific terms via configuration  
✅ Tested multilingual navigation

Your site now supports multiple languages with selective content translation and automatic fallback for untranslated pages!
