# Quickstart: Multilingual UI Terminology

**Audience**: Site maintainers  
**Time to Complete**: 10 minutes  
**Prerequisites**: Basic text editor, Hugo site running

## What This Does

Enables your sports club site to display all UI labels (navigation, headings, buttons) in English, German, or French. You can also customize specific terms (e.g., change "News" to "Blog") per language.

## Quick Start (3 Steps)

### Step 1: Set Your Site Language (2 minutes)

Edit `config/_default/hugo.toml` and add language configuration:

```toml
defaultContentLanguage = "en"  # Change to "de" or "fr" if desired

[languages]
  [languages.en]
    languageCode = "en-US"
    languageDirection = "ltr"
    languageName = "English"
    title = "Sports Club"
    weight = 1
    [languages.en.params]
      subtitle = "Community sports for all ages"
```

**That's it!** Your site now uses English UI labels from the theme defaults.

### Step 2: Preview Your Site (1 minute)

```bash
hugo server
```

Open http://localhost:1313 - all navigation, headings, and buttons now use translations from `i18n/en.yaml`.

### Step 3: Customize Terms (Optional, 3 minutes)

Want to change "News" to "Blog" or "Teams" to "Groups"? Add overrides:

```toml
[languages.en.params]
  terms.news = "Blog"
  terms.teams = "Groups"
```

Save and reload. ✅ Changes appear everywhere automatically!

---

## Enable Multiple Languages

### Add German

```toml
[languages.de]
  languageCode = "de-DE"
  languageDirection = "ltr"
  languageName = "Deutsch"
  title = "Sportverein"
  weight = 2
  [languages.de.params]
    subtitle = "Gemeinschaftssport für alle Altersgruppen"
```

### Add French

```toml
[languages.fr]
  languageCode = "fr-FR"
  languageDirection = "ltr"
  languageName = "Français"
  title = "Club Sportif"
  weight = 3
  [languages.fr.params]
    subtitle = "Sport communautaire pour tous les âges"
```

### Build All Languages

```bash
hugo  # Builds all configured languages
```

Output structure:

```text
public/
├── index.html       # Default language (en)
├── de/
│   └── index.html   # German version
└── fr/
    └── index.html   # French version
```

---

## Common Customizations

### Change Navigation Labels

```toml
[languages.en.params]
  terms.teams = "Squads"
  terms.news = "Blog"
  terms.members = "Athletes"
  terms.events = "Fixtures"
```

### Add Language Switcher (Optional)

The header already includes a language switcher dropdown that appears automatically when multiple languages are configured. No additional setup needed!

### Translate Page Titles

Page titles (in `<title>` tags) automatically use translated section names. No action required.

---

## Available Terms to Override

All terms defined in `i18n/en.yaml`, `i18n/de.yaml`, and `i18n/fr.yaml` can be overridden:

### Navigation
- `home`, `teams`, `events`, `results`, `news`, `members`

### Section Headings
- `teams_heading`, `teams_subtitle`
- `news_heading`, `news_subtitle`
- `events_heading`, `results_heading`, `members_heading`

### Actions
- `read_more`, `view_details`, `view_all`, `back_to`
- `filter_by_category`, `filter_by_team`
- `all_categories`, `all_teams`

### Accessibility
- `skip_to_content`, `skip_to_navigation`
- `main_navigation`, `open_menu`, `close_menu`

### Status
- `upcoming`, `past`, `date`, `time`, `venue`
- `no_results`

**Full list**: See `i18n/en.yaml` in your theme directory.

---

## Examples

### Example 1: English Site with Custom Terms

```toml
defaultContentLanguage = "en"

[languages.en]
  languageCode = "en-US"
  languageName = "English"
  title = "Sports Club"
  [languages.en.params]
    terms.news = "Blog"
    terms.teams = "Squads"
```

**Result**: Navigation shows "Blog" instead of "News", "Squads" instead of "Teams".

### Example 2: Bilingual Site (English + German)

```toml
defaultContentLanguage = "en"

[languages.en]
  languageCode = "en-US"
  languageName = "English"
  title = "Sports Club"
  weight = 1

[languages.de]
  languageCode = "de-DE"
  languageName = "Deutsch"
  title = "Sportverein"
  weight = 2
```

**Result**: 
- English site at `/` with English labels
- German site at `/de/` with German labels
- Language switcher dropdown in header

### Example 3: Trilingual with Overrides

```toml
defaultContentLanguage = "en"

[languages.en]
  languageCode = "en-US"
  languageName = "English"
  title = "Sports Club"
  [languages.en.params]
    terms.news = "Blog"

[languages.de]
  languageCode = "de-DE"
  languageName = "Deutsch"
  title = "Sportverein"
  [languages.de.params]
    terms.news = "Blog"  # Keep "Blog" in German too

[languages.fr]
  languageCode = "fr-FR"
  languageName = "Français"
  title = "Club Sportif"
  # No override - uses default "Actualités"
```

**Result**:
- English: "Blog"
- German: "Blog"
- French: "Actualités" (default)

---

## Troubleshooting

### Problem: Changes don't appear

**Solution**: Restart Hugo server
```bash
# Stop server (Ctrl+C)
hugo server
```

Configuration changes require a restart.

### Problem: Seeing translation keys instead of text (e.g., "[i18n] teams")

**Solution 1**: Run with warnings to see missing translations
```bash
hugo server --printI18nWarnings
```

**Solution 2**: Check for typos in `terms.*` keys - they must match exactly.

### Problem: Wrong language displaying

**Solution**: Check `defaultContentLanguage` matches your desired language code:
```toml
defaultContentLanguage = "en"  # or "de" or "fr"
```

### Problem: Language switcher not appearing

**Solution**: You need at least 2 languages configured. Add another `[languages.XX]` section.

---

## Advanced: Add a New Language

Want to add Spanish?

1. **Create translation file**: `i18n/es.yaml`

```yaml
home: "Inicio"
teams: "Equipos"
news: "Noticias"
# ... copy all keys from en.yaml and translate
```

2. **Add language config**: `config/_default/hugo.toml`

```toml
[languages.es]
  languageCode = "es-ES"
  languageName = "Español"
  title = "Club Deportivo"
  weight = 4
```

3. **Rebuild**: `hugo`

Done! Spanish now available at `/es/`.

---

## Next Steps

✅ **Customize terms** to match your club's terminology  
✅ **Add more languages** as your community grows  
✅ **Translate content** (future enhancement - see docs)  

---

## Technical Details

### Where Translations Come From

1. **Default translations**: `i18n/en.yaml`, `i18n/de.yaml`, `i18n/fr.yaml` (provided by theme)
2. **Your overrides**: `config/_default/hugo.toml` in `[languages.XX.params.terms]`

### Fallback Behavior

If a translation is missing:
1. Tries current language's i18n file
2. Falls back to default language's i18n file
3. Shows the key itself (never breaks)

Example: If `terms.teams` override is removed, shows default "Teams" (en), "Mannschaften" (de), or "Équipes" (fr).

### Performance Impact

- **JavaScript**: 0 KB added (fully static)
- **Build time**: +50-100ms for 3 languages
- **HTML size**: ~50 bytes per translated label

No performance penalty!

---

## Reference

### Configuration File Location

`config/_default/hugo.toml` (or `hugo.yaml`, `hugo.json`)

### Translation Files Location

```text
i18n/
├── en.yaml    # English (provided by theme)
├── de.yaml    # German (provided by theme)
└── fr.yaml    # French (provided by theme)
```

**Do not edit these files directly!** Use `terms.*` overrides in config instead.

### Supported Language Codes

- `en` (English)
- `de` (German / Deutsch)
- `fr` (French / Français)

More can be added by creating `i18n/XX.yaml` files.

---

## Summary

**Enable multilingual UI**: Add `[languages]` sections to `config/_default/hugo.toml`

**Customize terms**: Add `terms.KEY = "Value"` under `[languages.XX.params]`

**Build**: `hugo` (generates all configured languages)

**Preview**: `hugo server` and visit http://localhost:1313

That's it! Your sports club site now speaks multiple languages. 🌍
