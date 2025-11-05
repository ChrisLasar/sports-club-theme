---
title: "{{ replace .Name "-" " " | title }}"
eventType: "fixture"  # fixture | tournament | training-camp | social
date: "{{ .Date }}"
location: ""
venue: ""  # Venue path from content, e.g., venues/main-field
teams: []  # Array of team paths, e.g., ["teams/u13-boys", "teams/u15-girls"]
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
