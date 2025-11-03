# Quickstart: Content Reference Picker

**Feature**: 004-content-reference-picker  
**Target Audience**: Content editors and site administrators  
**Time to Complete**: 10 minutes  
**Prerequisites**: Sveltia CMS configured and accessible

---

## What This Feature Does

Instead of manually typing content paths like `members/jane-doe` or `teams/u13-boys`, you can now **select content from dropdown menus** in the CMS. This prevents typos, shows you available options, and makes creating relationships between content much easier.

**Example**: When creating a team, you can select coaches from a list of all members with a searchable dropdown, rather than remembering or looking up their exact file paths.

---

## Quick Demo (2 minutes)

### Before: Manual Path Entry

**Old way** (typing paths manually):

1. Edit a team
2. Find the "Coach" field
3. Remember the coach's filename: `members/jane-doe`
4. Type it exactly right (typos cause errors!)
5. Hope you spelled everything correctly

### After: Dropdown Selection

**New way** (selecting from dropdown):

1. Edit a team
2. Click the "Coaches" field
3. See a list of all members: "Jane Doe (Head Coach)", "John Smith (Assistant Coach)"
4. Type to search: "jane" → filters to Jane Doe
5. Click to select → path is automatically added
6. Done! No typing, no typos.

---

## Step-by-Step Guide

### 1. Adding Coaches to a Team

**Scenario**: You want to assign Jane Doe as coach of the U13 Boys team.

1. **Open the CMS** at `/admin/` (e.g., `https://yoursite.com/admin/`)
2. **Navigate** to "Teams" in the left sidebar
3. **Open** the "U13 Boys" team (or create a new team)
4. **Scroll** to the "Coaches" field
5. **Click** the coaches dropdown
   - You'll see: "Jane Doe (Head Coach)", "John Smith (Player)", etc.
   - If empty, it means no members exist yet → Create members first
6. **Search** (optional): Type "jane" to filter the list
7. **Select** "Jane Doe (Head Coach)"
8. **Add more** (optional): Click the dropdown again to add another coach
9. **Save** the team

**What gets stored**:

```yaml
coaches:
  - members/jane-doe
```

**What you see on the published site**: Coach name and details pulled from Jane Doe's member page.

---

### 2. Linking Events to Teams

**Scenario**: You're creating a match event between U13 Boys and U15 Girls.

1. **Navigate** to "Events"
2. **Click** "New Event"
3. **Fill in** basic info (title, date, event type)
4. **Scroll** to "Teams" field
5. **Click** the dropdown
   - You'll see: "U13 Boys (Football)", "U15 Girls (Volleyball)", etc.
6. **Select** "U13 Boys (Football)"
7. **Click dropdown again** to add another team
8. **Select** "U15 Girls (Volleyball)"
9. **Fill in** venue (dropdown), opponent (if applicable)
10. **Save** the event

**What gets stored**:

```yaml
teams:
  - teams/u13-boys
  - teams/u15-girls
```

**Result**: Event appears on both team pages automatically.

---

### 3. Setting Post Authors

**Scenario**: You're writing a news post about a tournament win.

1. **Navigate** to "News Posts"
2. **Click** "New Post"
3. **Fill in** title, date, summary
4. **Scroll** to "Author" field
5. **Click** the dropdown
   - You'll see: "Jane Doe (Head Coach)", "John Smith (Assistant Coach)"
6. **Select** the author
7. **Fill in** post content
8. **Optional**: Add related teams (e.g., "U13 Boys (Football)")
9. **Save** the post

**What gets stored**:

```yaml
author: members/jane-doe
teams:
  - teams/u13-boys
```

**Result**: Author's name appears on the post with a link to their member profile.

---

### 4. Selecting Venues

**Scenario**: Setting a team's home venue.

1. **Navigate** to "Teams"
2. **Open** a team
3. **Scroll** to "Primary Venue" field
4. **Click** the dropdown
   - You'll see: "Main Training Field", "Tennis Courts", "Athletics Track"
   - If empty, create venues first
5. **Search** (optional): Type "field" to filter
6. **Select** the venue
7. **Optional**: Add training schedule with different venues
8. **Save** the team

**What gets stored**:

```yaml
primary_venue: venues/main-field
training_schedule:
  - day: Monday
    time: "18:00-19:30"
    venue: venues/training-ground
```

**Result**: Venue details (name, address, map link) appear on the team page.

---

## Recommended Content Creation Order

To make the most of reference pickers, create content in this order:

1. **Venues** (training facilities, stadiums)
   - No dependencies
2. **Members** (coaches, players, staff)
   - No dependencies
3. **Teams** (now you can select coaches from members, venues for training)
   - Requires: Members, Venues
4. **Events** (now you can select teams and venues)
   - Requires: Teams, Venues
5. **Results** (can link to events)
   - Requires: Events (optional)
6. **Posts** (can select authors and related teams)
   - Requires: Members (for authors), Teams (for tagging)

**Why?** If you try to create a team before creating members, the coaches dropdown will be empty. If you create an event before creating venues, the venue dropdown will be empty. Create dependencies first.

---

## Tips & Tricks

### 1. Searching Dropdowns

**Shortcut**: Start typing in any dropdown to filter options.

**Example**: In a team's coaches field:

- Type "jane" → filters to "Jane Doe"
- Type "coach" → filters to all coaches
- Type "u13" → (in team selection) filters to U13 teams

### 2. Multiple Selections

Some fields allow multiple selections (e.g., teams in an event, coaches in a team).

**How it works**:

1. Click dropdown
2. Select first item
3. Click dropdown again
4. Select second item
5. Repeat as needed
6. Click outside dropdown to close

**Removing items**:

- Click the "X" next to each selected item

### 3. When Dropdown is Empty

If a dropdown shows no options:

1. **Check**: Are there items in that collection?
   - Example: No members? The coaches dropdown will be empty.
2. **Action**: Create the dependent content first.
3. **Refresh**: If you just created content, reload the CMS (Ctrl+F5) to see it in dropdowns.

**Helpful Hint Text**: Most dropdowns include hint text like "If no members appear, create members first."

### 4. Editing References

**To change a reference**:

1. Open the content item (e.g., a team)
2. Click the dropdown field (e.g., coaches)
3. Remove old selection (click "X")
4. Select new option
5. Save

### 5. Finding Content Quickly

**Use search** in the CMS sidebar:

1. Press `Ctrl+F` (Windows/Linux) or `Cmd+F` (Mac)
2. Type content name
3. Navigate directly to that item

---

## Common Scenarios

### Scenario: Assigning Multiple Coaches to a Team

1. Edit team
2. Coaches field → select first coach
3. Click dropdown again → select second coach
4. Repeat for all coaches
5. Save

**Front matter result**:

```yaml
coaches:
  - members/jane-doe
  - members/john-smith
  - members/alice-williams
```

### Scenario: Creating a Tournament Event with 4 Teams

1. New Event
2. Event Type → "tournament"
3. Teams field → select first team
4. Click dropdown → select second team
5. Repeat for all 4 teams
6. Fill in date, venue, description
7. Save

**Front matter result**:

```yaml
teams:
  - teams/u13-boys
  - teams/u13-girls
  - teams/u15-boys
  - teams/u15-girls
```

### Scenario: Linking a Result to an Event

1. New Result
2. Title → "U13 Boys Win 3-1"
3. Date → match date
4. Event field → select the event from dropdown
5. Score → home: 3, away: 1
6. Highlights → describe the match
7. Save

**Result**: The match result appears on the event page.

---

## What Happens Behind the Scenes

### Front Matter Format

When you select items from dropdowns, the CMS stores content paths in YAML front matter:

```yaml
---
title: "U13 Boys"
coaches:
  - members/jane-doe  # Reference to Jane Doe's member page
  - members/john-smith  # Reference to John Smith's member page
primary_venue: home-field  # Reference to venue in data/venues.yaml
---
```

### Hugo Resolves References at Build Time

When you build the site, Hugo finds and displays the referenced content:

**Template code** (you don't need to write this):

```html
{{ range .Params.coaches }}
  {{ with $.Site.GetPage . }}
    <div class="coach">{{ .Title }} - {{ .Params.role }}</div>
  {{ end }}
{{ end }}
```

**Published site shows**: "Jane Doe - Head Coach"

### Build Validation

If a reference is broken (e.g., you deleted a member who is still referenced as a coach), **the build will fail** with a clear error message:

```
ERROR: content/teams/u13-boys/index.md references missing member: members/jane-doe
```

This prevents broken links on your site.

---

## Troubleshooting

### Problem: Dropdown is Empty

**Possible Causes**:

1. No content exists in the referenced collection
2. CMS cache needs to be refreshed

**Solutions**:

1. Create content in the dependent collection first (e.g., create members before assigning coaches)
2. Reload CMS: Press `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Check CMS configuration: Is the collection name correct?

### Problem: Can't Find a Specific Item in Dropdown

**Solutions**:

1. **Type to search**: Start typing the item name to filter the list
2. **Check spelling**: Ensure the content item exists with that name
3. **Check collection**: Are you looking in the right collection?
   - Example: Coaches come from "Members", not "Teams"

### Problem: Selected Item Doesn't Appear on Published Site

**Possible Causes**:

1. Hugo build hasn't run since you made the change
2. Reference is broken (item was deleted)
3. Template doesn't display that field

**Solutions**:

1. Rebuild the site (`hugo` or `npm run build`)
2. Check Hugo build output for errors
3. Verify the item still exists in the CMS

### Problem: Build Fails with Reference Error

**Example Error**:

```
ERROR: content/teams/u13-boys/index.md references missing member: members/jane-doe
```

**Solution**:

1. The referenced member was deleted
2. **Fix Option A**: Restore the deleted member
3. **Fix Option B**: Edit the team and remove/change the coach reference
4. Rebuild

---

## Key Takeaways

✅ **Dropdown selection** replaces manual path typing  
✅ **Search** to quickly find content  
✅ **Multiple selections** supported where needed  
✅ **Create dependencies first** (venues and members before teams, teams before events)  
✅ **Broken references** cause build errors (this is a good thing - prevents broken site)  
✅ **All references use Relation widgets** - consistent pattern across all content types including venues

---

## Screenshots

*Note: Screenshots to be added during implementation*

1. Team editor with coaches dropdown showing members
2. Event editor with teams selection (multiple)
3. Post editor with author selection
4. Venue dropdown in team editor
5. Search functionality in dropdown
6. Multiple selected coaches on a team

---

## Next Steps

1. **Practice**: Create a test member, then assign them as a coach
2. **Explore**: Try creating an event with multiple teams
3. **Review**: Check your published site to see how references appear
4. **Report**: If you find a broken reference, check the Hugo build log

**Need Help?** Refer to the main documentation or contact your site administrator.

---

**Related Documentation**:

- [CMS Configuration Contract](./contracts/cms-config.md) (for admins)
- [Data Model](./data-model.md) (for developers)
- [Research Document](./research.md) (technical details)
