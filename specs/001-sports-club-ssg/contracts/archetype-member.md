# Hugo Archetype: Member

**File**: `archetypes/members.md`

Creates a new member profile with privacy defaults.

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
role: ""  # e.g., Coach, Manager, Player, Chairperson
teams: []  # List of team slugs, e.g., ["teams/u13-boys"]
group: ""  # For players: U13, U15, Beginner, etc.; omit for staff
bio: ""
portrait: ""  # Filename of portrait image
visibility:
  publicDisplay: true
  showOnRoster: true
  portraitConsent: false  # IMPORTANT: Default false for privacy
contactPublic: false  # Never show personal contact by default
socialImage: ""
---

## Biography

[Add member bio here]

## Teams

[Teams listed in front matter will auto-link]
```

**Usage**:

```bash
hugo new members/jane-doe.md
```

**Privacy Notes**:

- `portraitConsent` defaults to `false`—explicit opt-in required
- `contactPublic` defaults to `false`—no personal contact shown
- Editors must explicitly enable portrait display via CMS checkbox
