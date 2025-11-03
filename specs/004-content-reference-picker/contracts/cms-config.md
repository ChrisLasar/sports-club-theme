# CMS Configuration Contract: Content References

**Feature**: 004-content-reference-picker  
**File**: `static/admin/config.yml` (or `public/admin/config.yml`)  
**CMS**: Sveltia CMS / Decap CMS  
**Date**: 2025-11-02

## Overview

This contract defines the Sveltia/Decap CMS configuration changes to enable dropdown-based content reference selection using Relation and Select widgets.

---

## Complete Configuration

```yaml
# Backend configuration (unchanged)
backend:
  name: github  # or gitlab, gitea
  repo: owner/repo-name
  branch: main

media_folder: "static/images"
public_folder: "/images"

# Collections with Relation widgets
collections:
  # ========================================
  # MEMBERS COLLECTION
  # ========================================
  - name: "members"
    label: "Members"
    label_singular: "Member"
    folder: "content/members"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      - {label: "Role", name: "role", widget: "select", options: ["Head Coach", "Assistant Coach", "Player", "Staff", "Volunteer"], required: true}
      
      # RELATION WIDGET: Teams this member is associated with
      - label: "Teams"
        name: "teams"
        widget: "relation"
        collection: "teams"
        search_fields: ["title", "sport", "group"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{sport}})"]
        multiple: true
        required: false
        hint: "Select teams this member belongs to. If no teams appear, create teams first."
      
      - {label: "Bio", name: "bio", widget: "markdown", required: false}
      - {label: "Portrait", name: "portrait", widget: "image", required: false}
      - label: "Social"
        name: "social"
        widget: "object"
        required: false
        fields:
          - {label: "Email", name: "email", widget: "string", required: false}
          - {label: "Phone", name: "phone", widget: "string", required: false}
          - {label: "Website", name: "website", widget: "string", required: false}

  # ========================================
  # TEAMS COLLECTION
  # ========================================
  - name: "teams"
    label: "Teams"
    label_singular: "Team"
    folder: "content/teams"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      - {label: "Sport", name: "sport", widget: "select", options: ["Football", "Basketball", "Volleyball", "Handball", "Tennis", "Other"], required: true}
      - {label: "Group", name: "group", widget: "string", required: true, hint: "e.g., U13, U15, Adults, Veterans"}
      
      # RELATION WIDGET: Coaches (references to members)
      - label: "Coaches"
        name: "coaches"
        widget: "relation"
        collection: "members"
        search_fields: ["title", "role"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{role}})"]
        multiple: true
        required: false
        hint: "Select members who coach this team. If no members appear, create members first."
      
      # RELATION WIDGET: Primary venue (references venues collection)
      - label: "Primary Venue"
        name: "primary_venue"
        widget: "relation"
        collection: "venues"
        search_fields: ["title", "address"]
        value_field: "{{slug}}"
        display_fields: ["{{title}}"]
        required: false
        hint: "Select the team's home venue. If no venues appear, create venues first."
      
      # Training schedule with venue selection
      - label: "Training Schedule"
        name: "training_schedule"
        widget: "list"
        required: false
        fields:
          - {label: "Day", name: "day", widget: "select", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
          - {label: "Time", name: "time", widget: "string", hint: "e.g., 18:00-19:30"}
          - label: "Venue"
            name: "venue"
            widget: "relation"
            collection: "venues"
            search_fields: ["title"]
            value_field: "{{slug}}"
            display_fields: ["{{title}}"]
            hint: "Select training venue"
      
      - {label: "Featured Image", name: "featured_image", widget: "image", required: false}

  # ========================================
  # EVENTS COLLECTION
  # ========================================
  - name: "events"
    label: "Events"
    label_singular: "Event"
    folder: "content/events"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      - {label: "Event Type", name: "event_type", widget: "select", options: ["match", "tournament", "training_camp", "social"], required: true}
      
      # RELATION WIDGET: Teams involved in this event
      - label: "Teams"
        name: "teams"
        widget: "relation"
        collection: "teams"
        search_fields: ["title", "sport", "group"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{sport}})"]
        multiple: true
        min: 1
        required: true
        hint: "Select at least one team for this event."
      
      # SELECT WIDGET: Venue
      
      # RELATION WIDGET: Venue
      - label: "Venue"
        name: "venue"
        widget: "relation"
        collection: "venues"
        search_fields: ["title", "address"]
        value_field: "{{slug}}"
        display_fields: ["{{title}}"]
        required: false
        hint: "Where is this event taking place? If no venues appear, create venues first."
      
      - {label: "Opponent", name: "opponent", widget: "string", required: false, hint: "Opponent team name (for matches)"}
      - {label: "Description", name: "description", widget: "markdown", required: false}
      - {label: "Featured Image", name: "featured_image", widget: "image", required: false}  # ========================================
  # RESULTS COLLECTION
  # ========================================
  - name: "results"
    label: "Results"
    label_singular: "Result"
    folder: "content/results"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      
      # RELATION WIDGET: Event reference (optional)
      - label: "Event"
        name: "event"
        widget: "relation"
        collection: "events"
        search_fields: ["title", "date"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} - {{date}}"]
        required: false
        hint: "Link this result to an event (optional)."
      
      # Score object
      - label: "Score"
        name: "score"
        widget: "object"
        required: false
        fields:
          - {label: "Home", name: "home", widget: "number", value_type: "int", min: 0}
          - {label: "Away", name: "away", widget: "number", value_type: "int", min: 0}
      
      # RELATION WIDGET: Teams (can also be derived from event)
      - label: "Teams"
        name: "teams"
        widget: "relation"
        collection: "teams"
        search_fields: ["title", "sport"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{sport}})"]
        multiple: true
        required: false
      
      - {label: "Placement", name: "placement", widget: "string", required: false, hint: "e.g., 1st Place, 2nd Place"}
      - {label: "Highlights", name: "highlights", widget: "markdown", required: false}
      - {label: "Featured Image", name: "featured_image", widget: "image", required: false}

  # ========================================
  # POSTS (NEWS) COLLECTION
  # ========================================
  - name: "posts"
    label: "News Posts"
    label_singular: "Post"
    folder: "content/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      
      # RELATION WIDGET: Author (member reference)
      - label: "Author"
        name: "author"
        widget: "relation"
        collection: "members"
        search_fields: ["title", "role"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{role}})"]
        required: true
        hint: "Select the post author from members."
      
      - {label: "Summary", name: "summary", widget: "text", required: true}
      - {label: "Body", name: "body", widget: "markdown", required: true}
      
      # RELATION WIDGET: Related teams (optional)
      - label: "Related Teams"
        name: "teams"
        widget: "relation"
        collection: "teams"
        search_fields: ["title", "sport"]
        value_field: "{{slug}}"
        display_fields: ["{{title}} ({{sport}})"]
        multiple: true
        required: false
        hint: "Tag teams related to this post."
      
      - label: "Categories"
        name: "categories"
        widget: "select"
        multiple: true
        required: false
        options:
          - "team-news"
          - "match-reports"
          - "club-announcements"
          - "achievements"
      
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Featured Image", name: "featured_image", widget: "image", required: false}

  # ========================================
  # VENUES COLLECTION
  # ========================================
  - name: "venues"
    label: "Venues"
    label_singular: "Venue"
    folder: "content/venues"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string", required: true, hint: "e.g., Main Training Field, Tennis Courts"}
      - {label: "Date", name: "date", widget: "datetime", required: true}
      - {label: "Address", name: "address", widget: "string", required: true}
      - {label: "Map Link", name: "map_link", widget: "string", required: false, hint: "Google Maps URL"}
      - {label: "Facilities", name: "facilities", widget: "text", required: false, hint: "Describe available facilities"}
      - {label: "Image", name: "image", widget: "image", required: false}
      - {label: "Description", name: "description", widget: "markdown", required: false}
```

---

## Widget Configuration Details

### Relation Widget Pattern

**Standard Pattern**:

```yaml
- label: "Display Name"
  name: "field_name"
  widget: "relation"
  collection: "target_collection"
  search_fields: ["field1", "field2"]
  value_field: "{{slug}}"
  display_fields: ["{{title}} ({{additional_context}})"]
  multiple: true|false
  min: 1  # For multiple selections
  max: 10  # For multiple selections (optional)
  required: true|false
  hint: "Helper text for users"
```

**Field Explanations**:

- `collection`: Name of the collection to reference (must match collection `name`)
- `search_fields`: Fields to search when user types (can be nested like `name.first`)
- `value_field`: Field value to store (use `{{slug}}` for content path)
- `display_fields`: Fields to show in dropdown (use templates for formatting)
- `multiple`: Allow selecting multiple items
- `required`: Prevent saving without selection

### Select Widget Pattern (for Data File References)

```yaml
- label: "Venue"
  name: "venue"
  widget: "select"
  required: false
  options:
    - label: "Human-Readable Name"
      value: "data-file-key"
```

**Maintenance Note**: When adding venues to `data/venues.yaml`, update:

1. `teams` collection → `primary_venue` options
2. `teams` collection → `training_schedule.venue` options
3. `events` collection → `venue` options

---

## Migration from Manual Entry

### Before (Manual Path Entry)

```yaml
collections:
  - name: "teams"
    fields:
      - {label: "Coach", name: "coach", widget: "string"}
      # User types: members/jane-doe
```

### After (Relation Widget)

```yaml
collections:
  - name: "teams"
    fields:
      - label: "Coaches"
        name: "coaches"
        widget: "relation"
        collection: "members"
        value_field: "{{slug}}"
        # User selects from dropdown: "Jane Doe (Head Coach)"
        # Stores: members/jane-doe
```

**Result**: No front matter changes needed. Path format is identical.

---

## Sveltia CMS Enhancements

These features work automatically in Sveltia CMS:

1. **No API rate limits**: All content loaded once via GraphQL
2. **Instant search**: No delay when typing in relation fields
3. **Auto-switch to radio/checkbox**: When ≤5 options, dropdown becomes radio buttons (single) or checkboxes (multiple)
4. **Default search fields**: If `search_fields` omitted, defaults to `display_fields` → `value_field` → `identifier_field`
5. **Default value field**: If `value_field` omitted, defaults to `{{slug}}`
6. **New items immediately available**: Creating a member makes it instantly selectable in team coaches

---

## Testing Checklist

### CMS UI Testing

- [ ] Open team editor → coaches field shows dropdown with member names and roles
- [ ] Type "jane" in coaches field → filters to members with "jane" in name
- [ ] Select coach from dropdown → save team → verify front matter contains `members/jane-doe`
- [ ] Create new member → immediately available in team coaches dropdown
- [ ] Event teams field → requires at least 1 team (min: 1)
- [ ] Post author field → required (can't save without selecting)
- [ ] Empty members collection → team coaches field shows empty dropdown (add hint text)
- [ ] Training schedule venue → matches primary_venue options

### Front Matter Verification

After saving content via CMS, verify front matter format:

```yaml
# content/teams/u13-boys/index.md
---
title: "U13 Boys"
coaches:
  - members/jane-doe
  - members/john-smith
primary_venue: home-field
training_schedule:
  - day: Monday
    time: "18:00-19:30"
    venue: training-ground
---
```

### Build Testing

- [ ] Hugo build succeeds with valid references
- [ ] Hugo build fails with clear error for broken references (if validation added)
- [ ] Team page displays coach names from member references
- [ ] Event page displays team names from team references
- [ ] Result page links to event page
- [ ] Venue details display on team/event pages

---

## Rollout Strategy

### Phase 1: Update CMS Config (No Content Changes)

1. Update `static/admin/config.yml` with new widget configurations
2. Commit and deploy CMS config
3. Reload CMS (Ctrl+F5 to clear cache)
4. Test one collection (e.g., teams)
5. Verify existing content works with new config

### Phase 2: Update Archetypes (Optional)

Update archetype files to match new config:

```yaml
# archetypes/teams.md
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
sport: ""
group: ""
coaches: []  # Changed from: coach: ""
primary_venue: ""
---
```

### Phase 3: User Training

1. Document new dropdown workflow in quickstart
2. Show screenshots of relation dropdowns
3. Explain recommended content creation order:
   - Create members first
   - Then create teams (select coaches from members)
   - Then create events (select teams)
   - Then create results (optional: select events)

---

## Known Limitations

1. **Data File Sync**: Venue options must be manually synced with `data/venues.yaml`
2. **No Inline Creation**: Can't create a member while editing a team (Sveltia limitation - planned for future)
3. **No Bi-Directional Updates**: Deleting a member doesn't remove references from teams (build validation catches this)
4. **Large Collections**: With 100+ items, scrolling may slow down (Sveltia mitigates with infinite scroll)

---

## Future Enhancements

1. **Dynamic Venue Options**: Script to generate Select options from `data/venues.yaml`
2. **Reference Validation UI**: Show warnings in CMS for broken references
3. **Inline Content Creation**: Create member while editing team (when Sveltia supports it)
4. **Bi-Directional Reference Display**: Show which teams reference a member on the member edit page
5. **Bulk Reference Updates**: Tool to update all references when content is renamed

---

## Contract Compliance

- ✅ Uses standard Sveltia/Decap CMS widgets (Relation, Select)
- ✅ Stores human-readable paths in front matter
- ✅ No custom JavaScript required
- ✅ Mobile-optimized (Sveltia CMS is responsive)
- ✅ Accessible (keyboard navigation, screen reader support)
- ✅ Zero runtime dependencies (CMS is build-time tool)
- ✅ Compatible with existing content (no migration needed)

---

**Next Steps**: Create quickstart.md with user guide and examples.
