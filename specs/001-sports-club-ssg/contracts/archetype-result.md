# Hugo Archetype: Result

**File**: `archetypes/results.md`

Creates a new result entry linked to an event.

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
event: ""  # Path to event, e.g., "events/u13-boys-vs-rival-2025-11-15"
date: "{{ .Date }}"
teams: []  # Team slugs (taxonomy)
score:
  home: 0
  away: 0
  homeTeam: ""
  awayTeam: ""
placement: null  # For tournaments: "1st", "2nd", "3rd", etc.
highlights: ""
notes: ""
mediaGallery: []  # List of image filenames
socialImage: ""
tags: []
---

## Match Report

[Add match highlights, player performance notes, etc.]

## Media

{{ range .Params.mediaGallery }}
- {{ . }}
{{ end }}
```

**Usage**:

```bash
hugo new results/u13-boys-vs-rival-win-3-1.md
```

**Notes**:

- Editors link to event via `event` field
- `score` fields for score-based sports; `placement` for tournaments/competitions
