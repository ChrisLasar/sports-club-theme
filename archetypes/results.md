---
title: "{{ replace .Name "-" " " | title }}"
event: ""  # Path to event from content, e.g., "events/u13-boys-vs-rival-2025-11-15"
date: "{{ .Date }}"
teams: []  # Array of team paths, e.g., ["teams/u13-boys", "teams/u15-girls"]
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
