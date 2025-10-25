# Hugo Archetype: Team

**File**: `archetypes/teams/index.md`

Creates a new team page bundle with sensible defaults.

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
ageGroup: ""  # e.g., U13, U15, Senior, etc.
sport: ""  # e.g., Football, Tennis, Athletics
season:
  start: "{{ now.Format "2006-01-02" }}"
  end: ""
  status: "active"  # active | off-season | archived
training:
  - day: "Tuesday"
    startTime: "18:00"
    endTime: "19:30"
    venue: "main-field"
venue: "main-field"
coaches:
  - name: ""
    role: "Head Coach"
    email: ""  # Generic team email, e.g., u13@club.org
members: []
socialImage: ""  # Filename of image in this page bundle
description: ""
tags: []
---

## About This Team

[Add team description here]

## Training Schedule

See front matter above for training times.

## Contact

For inquiries about this team, contact: [coach email from front matter]
```

**Usage**:

```bash
hugo new teams/u13-boys/index.md
```

**Notes**:

- Creates page bundle ready for colocated images
- Editors fill in `ageGroup`, `sport`, training times, and coach details via CMS
