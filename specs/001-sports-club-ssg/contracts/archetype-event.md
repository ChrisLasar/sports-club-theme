# Hugo Archetype: Event

**File**: `archetypes/events.md`

Creates a new event/fixture.

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
type: "fixture"  # fixture | tournament | training-camp | social
date: "{{ .Date }}"
location: ""
venue: ""  # Venue slug from data/venues.yaml
teams: []  # Team slugs (taxonomy)
opponent: ""  # For fixtures
description: ""
registrationRequired: false
registrationDeadline: ""
status: "upcoming"  # upcoming | completed | cancelled
socialImage: ""
tags: []
---

## Event Details

[Add event description, travel info, or other details here]

## Registration

{{ if .Params.registrationRequired }}
Registration deadline: {{ .Params.registrationDeadline }}
{{ else }}
No registration required.
{{ end }}
```

**Usage**:

```bash
hugo new events/u13-boys-vs-rival-2025-11-15.md
```

**Notes**:

- `date` auto-filled with creation date; editors update to actual event date
- `status` defaults to `upcoming`; editors or automated processes update post-event
