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
