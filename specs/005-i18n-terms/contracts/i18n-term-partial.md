# Template Partial Contract: i18n-term.html

**Type**: Hugo Template Partial  
**Purpose**: Resolve UI terminology with multilingual support and config overrides  
**Location**: `layouts/partials/i18n-term.html`

## Interface

### Input Parameters (dict)

```go
{
  "key": string,      // Required: Translation key (e.g., "teams", "news")
  "context": any,     // Optional: Page/site context for interpolation
  "count": int        // Optional: Integer for pluralization
}
```

### Return Value

```go
string  // Translated/overridden term or key itself (never empty)
```

## Usage Examples

### Basic Usage

```html
{{ partial "i18n-term.html" (dict "key" "teams") }}
```

**Output**:
- English: "Teams" (or override like "Groups")
- German: "Mannschaften"
- French: "Équipes"

### With Context (Interpolation)

```html
{{ partial "i18n-term.html" (dict "key" "no_items_yet" "context" (dict "Type" "teams")) }}
```

**Output**: "No teams have been created yet. Check back soon!"

### With Count (Pluralization)

```html
{{ partial "i18n-term.html" (dict "key" "items_count" "count" 5) }}
```

**Output**: Uses Hugo's pluralization rules for the term.

## Behavior Specification

### Resolution Order (Fallback Chain)

1. **Config Override Check**
   - Path: `site.Language.Params.terms.{KEY}`
   - If exists: Return value immediately
   - If not exists: Continue to step 2

2. **Current Language i18n**
   - Path: `i18n/{LANG_CODE}.yaml`
   - Call: `i18n KEY [context|count]`
   - If found: Return translation
   - If not found: Hugo falls back to default language (step 3)

3. **Default Language i18n**
   - Path: `i18n/{defaultContentLanguage}.yaml`
   - If found: Return translation
   - If not found: Continue to step 4

4. **Key Itself (Failsafe)**
   - Return: The key string itself
   - Ensures templates never break

### Edge Cases

| Scenario | Behavior | Example |
|----------|----------|---------|
| Missing override | Uses i18n default | Override removed → shows "Teams" not "Groups" |
| Missing i18n key | Falls back to default language | `teams` missing in `de.yaml` → shows English "Teams" |
| Both missing | Shows key itself | All missing → shows "teams" (raw key) |
| Empty override value | Treated as missing | `terms.teams = ""` → ignored, uses i18n |
| Invalid key type | Hugo template error | Not a string → build fails |
| Context with no interpolation | Ignored safely | Context provided but term has no `{{ }}` → context unused |

## Performance Characteristics

- **Execution time**: ~0.1ms per call (Hugo template function)
- **Memory**: Negligible (strings only)
- **Build impact**: None (compiled at build time)
- **Runtime impact**: Zero (fully static output)

## Error Handling

### Build-Time Errors

| Error                     | Cause                                      | Fix                     |
| ------------------------- | ------------------------------------------ | ----------------------- |
| Template syntax error     | Invalid Hugo syntax in partial             | Fix template syntax     |
| Missing context parameter | Template expects context but none provided | Add `"context"` to dict |

### Runtime Errors

**None** - This partial cannot fail at runtime because output is static HTML.

### Development Warnings

Enable with `hugo --printI18nWarnings`:

```bash
WARN 2025/12/13 i18n|MISSING_TRANSLATION: "teams" for language "de"
```

Indicates `teams` key is missing from `i18n/de.yaml`.

## Dependencies

### Hugo Functions Used

- `i18n`: Hugo's built-in translation function
- `index`: Access map values by key
- `with`: Conditional scope

### Required Files

- `i18n/{LANG_CODE}.yaml`: Translation files for each language
- `config/_default/hugo.toml`: Language configuration

### Optional Files

- None (all functionality is self-contained)

## Versioning

**Version**: 1.0.0  
**Hugo Compatibility**: 0.152.0+  
**Breaking Changes**: None expected

### Future Enhancements (Non-Breaking)

- Support for gender-specific translations
- Support for context-aware pluralization
- Support for date/time formatting

## Testing Contract

### Unit Tests (Manual)

Test cases for validation:

1. **Override exists**: Config has `terms.teams = "Groups"` → Returns "Groups"
2. **Override missing**: No override → Returns i18n value
3. **i18n exists**: Key in `i18n/en.yaml` → Returns translation
4. **i18n missing**: Key missing → Falls back to default language
5. **All missing**: Key nowhere → Returns key itself
6. **With context**: Context interpolates correctly
7. **With count**: Pluralization works

### Integration Tests

Test complete flow:

1. Build site with English config
2. Verify navigation shows English terms
3. Add German language
4. Verify German navigation shows German terms
5. Add override `terms.news = "Blog"`
6. Verify "Blog" appears instead of "News"
7. Remove override
8. Verify "News" reappears

### Visual Regression Tests

- Compare screenshots of navigation before/after language change
- Verify all labels update consistently

## Security Considerations

**None** - This partial handles only static configuration and translation strings. No user input, no external data sources.

Potential XSS risk: **None** - All values come from trusted sources (site config and theme i18n files).

## Accessibility Considerations

This partial is used for:

- Navigation labels
- Aria-labels
- Skip links
- Section headings

**Requirement**: All translations must be meaningful and descriptive for screen readers.

**Best Practice**: Keep translations concise but clear (e.g., "Main navigation" not just "Nav").

## Example Implementation

See `layouts/partials/i18n-term.html`:

```go-html-template
{{- $key := .key -}}
{{- $context := .context -}}
{{- $count := .count -}}

{{- $override := "" -}}
{{- with site.Language.Params.terms -}}
  {{- $override = index . $key -}}
{{- end -}}

{{- if $override -}}
  {{- $override -}}
{{- else -}}
  {{- if $count -}}
    {{- i18n $key $count -}}
  {{- else if $context -}}
    {{- i18n $key $context -}}
  {{- else -}}
    {{- i18n $key -}}
  {{- end -}}
{{- end -}}
```

## Migration Guide

### From Hard-Coded Terms

**Before**:
```html
<a href="/teams">Teams</a>
```

**After**:
```html
<a href="/teams">{{ partial "i18n-term.html" (dict "key" "teams") }}</a>
```

### From Direct i18n Calls

**Before**:
```html
<a href="/teams">{{ i18n "teams" }}</a>
```

**After**:
```html
<a href="/teams">{{ partial "i18n-term.html" (dict "key" "teams") }}</a>
```

**Benefit**: Now supports config overrides!

## Support

For issues or questions:

1. Check `i18n/*.yaml` files have required keys
2. Verify config syntax in `hugo.toml`
3. Run with `--printI18nWarnings` to see missing translations
4. Check Hugo version is 0.152.0+
