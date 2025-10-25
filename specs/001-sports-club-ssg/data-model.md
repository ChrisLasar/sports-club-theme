# Data Model: Sports Club Static Site Template

**Feature**: 001-sports-club-ssg  
**Date**: 2025-10-25  
**Phase**: 1 (Design & Contracts)

## Purpose

Define the content types, front matter schemas, and relationships for the Hugo-based sports club template, mapping entities from the feature spec to Hugo's content organization.

## Content Types & Hugo Mapping

### 1. Club (Site Configuration)

**Storage**: `config/_default/hugo.toml` + `data/club.yaml`

**Schema** (`data/club.yaml`):

```yaml
name: "Example Sports Club"
logo: "/images/club-logo.svg"
description: "A community sports club for all ages"
founded: 2010
primarySports:
  - Football
  - Tennis
  - Athletics
contact:
  email: "info@exampleclub.org"
  phone: "+1234567890"
socialChannels:
  facebook: "https://facebook.com/exampleclub"
  twitter: "https://twitter.com/exampleclub"
  instagram: "https://instagram.com/exampleclub"
```

**Usage**: Referenced in layouts via `{{ site.Data.club.name }}`

---

### 2. Team (Content Type)

**Storage**: `content/teams/{team-slug}/index.md` (page bundle)

**Front Matter Schema**:

```yaml
title: "U13 Boys Football"           # Team name
group: "U13"                         # Group identifier (age, skill level, etc.)
sport: "Football"                    # Sport name
season:
  start: "2024-09-01"                # Season start date
  end: "2025-05-31"                  # Season end date
  status: "active"                   # active | off-season | archived
training:
  - day: "Tuesday"                   # Day of week
    startTime: "18:00"               # Start time
    endTime: "19:30"                 # End time
    venue: "main-field"              # Reference to venue (data file or slug)
  - day: "Thursday"
    startTime: "18:00"
    endTime: "19:30"
    venue: "main-field"
venue: "main-field"                  # Primary venue slug
coaches:                             # References to member entries with contact
  - member: "members/john-smith"     # Path to member content
    role: "Head Coach"
    email: "u13@exampleclub.org"     # Generic team email
  - member: "members/sarah-jones"
    role: "Assistant Coach"
    email: "u13@exampleclub.org"     # Generic team email
members:                             # References to member content (optional)
  - "members/jane-doe"
  - "members/alex-jones"
socialImage: "team-photo.jpg"        # Image in page bundle
description: "Our U13 boys team training times and fixtures"
tags:
  - football
  - youth
```

**Relationships**:

- **Has many**: Events (via taxonomy `teams: ["u13-boys"]`)
- **Has many**: Results (via taxonomy `teams: ["u13-boys"]`)
- **Has many**: Posts (via taxonomy `teams: ["u13-boys"]`)
- **Has many**: Members (via `members` list or reverse lookup)
- **References**: Members (via `coaches[].member` paths)

**Validation Rules**:

- `title` required
- `group` required
- `sport` required
- `season.status` enum: `active`, `off-season`, `archived`
- `training[].day` enum: Monday-Sunday
- `training[].startTime` format: HH:MM
- `coaches[].member` must reference valid member path
- `coaches[].email` must be generic team email (not personal)

---

### 3. Member (Content Type)

**Storage**: `content/members/{member-slug}.md`

**Front Matter Schema**:

```yaml
title: "Jane Doe"                    # Member name
role: "Coach"                        # Role title
teams:                               # Team references
  - "teams/u13-boys"
  - "teams/u15-girls"
group: "U13"                         # For players (age/skill level); omit for staff
bio: "Jane has been coaching youth football for 5 years..."
portrait: "jane-doe.jpg"             # Image filename (in page bundle if using bundles)
visibility:
  publicDisplay: true                # Show on public site
  showOnRoster: true                 # Include in team roster
  portraitConsent: false             # Show portrait (opt-in)
contactPublic: false                 # Show contact details publicly (default false)
socialImage: "jane-doe.jpg"          # Optional override
```

**Relationships**:

- **Belongs to many**: Teams (via `teams` list)
- **Referenced by**: Teams (via `coaches[].member` paths)

**Validation Rules**:

- `title` (name) required
- `role` required
- `visibility.portraitConsent` boolean, default `false`
- `visibility.showOnRoster` boolean, default `true`
- `contactPublic` boolean, default `false`
- If `visibility.portraitConsent = false`, portrait not rendered

---

### 4. Event/Fixture (Content Type)

**Storage**: `content/events/{event-slug}.md`

**Front Matter Schema**:

```yaml
title: "U13 Boys vs. Rival Club"     # Event title
type: "fixture"                      # fixture | tournament | training-camp
date: "2025-11-15T14:00:00Z"         # ISO 8601 datetime
location: "Away - Rival Club Stadium"
venue: "rival-stadium"               # Optional venue slug
teams:                               # Team references (taxonomy)
  - u13-boys
opponent: "Rival Club U13"           # For fixtures
description: "League match away at Rival Club"
registrationRequired: false          # Boolean
registrationDeadline: "2025-11-10"   # Optional date
status: "upcoming"                   # upcoming | completed | cancelled
socialImage: "event-poster.jpg"      # Optional
tags:
  - football
  - league
```

**Relationships**:

- **Belongs to many**: Teams (via `teams` taxonomy)
- **May have one**: Result (reverse link via `event` field in Result)

**Validation Rules**:

- `title` required
- `date` required, ISO 8601 format
- `type` enum: `fixture`, `tournament`, `training-camp`, `social`
- `status` enum: `upcoming`, `completed`, `cancelled`
- `teams` list required (at least one team)

**State Transitions**:

- `upcoming` → `completed` (after event date + result published)
- `upcoming` → `cancelled` (manual override)

---

### 5. Result (Content Type)

**Storage**: `content/results/{result-slug}.md`

**Front Matter Schema**:

```yaml
title: "U13 Boys vs. Rival Club - Win 3-1"
event: "events/u13-boys-vs-rival-2025-11-15"  # Reference to event
date: "2025-11-15"                   # Match date
teams:                               # Team references (taxonomy)
  - u13-boys
score:
  home: 3
  away: 1
  homeTeam: "Example SC U13"
  awayTeam: "Rival Club U13"
placement: null                      # For tournaments: 1st, 2nd, 3rd, etc.
highlights: "Great team performance with goals from Alex, Jamie, and Taylor."
notes: "Player of the match: Alex"
mediaGallery:                        # Optional image list
  - "goal-celebration-1.jpg"
  - "team-after-match.jpg"
socialImage: "goal-celebration-1.jpg"
tags:
  - football
  - win
```

**Relationships**:

- **Belongs to one**: Event (via `event` field)
- **Belongs to many**: Teams (via `teams` taxonomy)

**Validation Rules**:

- `title` required
- `event` reference required
- `date` required
- `teams` list required
- `score.home` and `score.away` integers (for score-based sports)
- `placement` string (for tournaments)

---

### 6. Post (Content Type)

**Storage**: `content/posts/{post-slug}.md`

**Front Matter Schema**:

```yaml
title: "Season Kickoff Event Success"
date: "2025-10-20T10:00:00Z"
author: "Club Admin"
summary: "Our annual season kickoff brought together over 200 members..."
teams:                               # Optional team tags (taxonomy)
  - u13-boys
  - u15-girls
tags:
  - news
  - events
categories:
  - Club News
socialImage: "kickoff-photo.jpg"
discussLink: "https://facebook.com/exampleclub/posts/12345"  # Optional social discussion link
```

**Relationships**:

- **Belongs to many**: Teams (via `teams` taxonomy, optional)

**Validation Rules**:

- `title` required
- `date` required, ISO 8601 format
- `summary` required (for list views and social meta)
- `discussLink` optional URL

---

### 7. Venue (Data File)

**Storage**: `data/venues.yaml`

**Schema**:

```yaml
main-field:
  name: "Main Training Field"
  address: "123 Club Lane, Hometown"
  mapLink: "https://maps.google.com/?q=..."
  facilities: "Changing rooms, floodlights"

rival-stadium:
  name: "Rival Club Stadium"
  address: "456 Away Road, Othertown"
  mapLink: "https://maps.google.com/?q=..."
  facilities: null
```

**Usage**: Referenced in layouts via `{{ index site.Data.venues .Params.venue }}`

---

### 8. Role (Implicit)

**Storage**: Inline in Member front matter (no separate content type)

**Schema** (part of Member and Team coaches):

```yaml
role: "Head Coach"  # Simple string in Member front matter
# In Team front matter, coaches reference members:
coaches:
  - member: "members/john-smith"
    role: "Head Coach"  # Role context for this team
```

**Note**: For complex role hierarchies, could add `data/roles.yaml`, but keeping simple per spec. Coaches are always referenced via member entries, not inline.

---

## Taxonomies

Hugo taxonomies for cross-linking content:

```toml
# config/_default/hugo.toml
[taxonomies]
  team = "teams"      # Relate posts/events/results to teams
  tag = "tags"
  category = "categories"
```

**Usage**:

- Team page lists: `{{ range .Site.Taxonomies.teams.u13-boys }}`
- Event filtering: filter by `.Params.teams`

---

## Content Relationships Summary

```text
Club (config/data)
  └─ has many Teams

Team (content/teams/)
  ├─ has many Events (via teams taxonomy)
  ├─ has many Results (via teams taxonomy)
  ├─ has many Posts (via teams taxonomy)
  ├─ has many Members (via members list or reverse)
  └─ references Venue (via venue slug)

Member (content/members/)
  └─ belongs to many Teams (via teams list)

Event (content/events/)
  ├─ belongs to many Teams (via teams taxonomy)
  ├─ references Venue (via venue slug)
  └─ may have one Result

Result (content/results/)
  ├─ belongs to one Event (via event field)
  └─ belongs to many Teams (via teams taxonomy)

Post (content/posts/)
  └─ belongs to many Teams (via teams taxonomy, optional)

Venue (data/venues.yaml)
  └─ referenced by Teams, Events
```

---

## Privacy & Visibility Rules

Implemented via front matter flags and template logic:

1. **Member portraits**: Only render if `visibility.portraitConsent = true`
2. **Roster visibility**: Only include member if `visibility.showOnRoster = true`
3. **Contact details**: Never show personal phone/email; use generic team emails
4. **Social channels**: Optional `discussLink` on posts; hide if not configured

---

## Validation & Constraints

- All dates in ISO 8601 format for Hugo date parsing
- Team slugs consistent across content (e.g., `u13-boys`)
- Image paths relative to page bundle or `static/images/`
- Social images: min 1200x630px for optimal sharing
- Alt text required for all images (enforced in CMS config)

---

## Migration Path to Multilingual

Current structure supports migration:

1. Enable `[languages]` in `config/_default/hugo.toml`
2. Move `content/` → `content/en/`
3. Add `content/de/`, `content/fr/`, etc.
4. Translate `i18n/*.toml` files
5. Front matter remains same; Hugo handles language routing

---

## Next Steps

See `contracts/` directory for:

- Hugo archetype templates for each content type
- Sveltia CMS `config.yml` mapping to these schemas
- Example content files
