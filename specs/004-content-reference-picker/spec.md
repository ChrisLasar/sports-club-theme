# Feature Specification: Content Reference Picker

**Feature Branch**: `004-content-reference-picker`  
**Created**: 2025-11-02  
**Status**: Draft  
**Input**: User description: "Allow users to select content references from dropdown instead of specifying absolute paths in CMS"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team Coach Selection (Priority: P1)

When creating or editing a team page in the CMS, the user needs to assign coaches to the team. Instead of typing the path `members/jane-doe` manually (which could be error-prone), the user should select from a dropdown list showing all available members with their names and roles.

**Why this priority**: This is the most common relationship in the site. Teams need coaches, and incorrect paths currently cause build failures. This addresses the core pain point described by the user.

**Independent Test**: Can be fully tested by creating a new team in the CMS, clicking the coaches field, seeing a dropdown of available members (showing name and role), selecting a member, and verifying the correct path is saved.

**Acceptance Scenarios**:

1. **Given** I am editing a team page in the CMS, **When** I click the "Member" field under Coaches, **Then** I see a dropdown list of all members showing their name and role
2. **Given** I select a member from the dropdown, **When** I save the team, **Then** the correct member path is stored in the front matter (e.g., `members/jane-doe`)
3. **Given** I try to add a coach, **When** no members exist in the system, **Then** I see a message "No members available - create a member first"
4. **Given** I have selected a coach, **When** I view the published team page, **Then** the coach information is correctly displayed

---

### User Story 2 - Event-to-Team Reference (Priority: P1)

When creating events or fixtures, the user needs to associate the event with one or more teams. Instead of manually entering team slugs like `teams/u13-boys`, the user should select teams from a searchable dropdown.

**Why this priority**: Events are central to a sports club site. Incorrect team references break the relationship between events and teams, making it impossible for users to find events for their teams.

**Independent Test**: Can be fully tested by creating a new event in the CMS, adding teams via dropdown selection, saving the event, and verifying that the event appears on the selected teams' pages.

**Acceptance Scenarios**:

1. **Given** I am creating a new event, **When** I click the "Teams" field, **Then** I see a dropdown of all available teams with their names and sport
2. **Given** I select multiple teams from the dropdown, **When** I save the event, **Then** all selected team slugs are stored in the teams array
3. **Given** there are many teams in the system, **When** I type in the teams field, **Then** the dropdown filters to show only matching teams
4. **Given** I save an event with team references, **When** I view a team page, **Then** the event appears in that team's event list

---

### User Story 3 - Result-to-Event Reference (Priority: P2)

When recording a match result, the user needs to link it to the original event. Instead of typing the event path manually, the user should select from a list of recent/upcoming events.

**Why this priority**: This completes the event lifecycle (event creation → event occurs → result recorded). While important, results can initially be created without event references if needed.

**Independent Test**: Can be fully tested by creating a result entry, selecting an existing event from a dropdown, and verifying the result is linked to that event on the published site.

**Acceptance Scenarios**:

1. **Given** I am creating a match result, **When** I click the "Event Reference" field, **Then** I see a dropdown of events sorted by date (most recent first)
2. **Given** I select an event from the dropdown, **When** I save the result, **Then** the correct event path is stored in the front matter
3. **Given** I view the event page, **When** a result is linked to it, **Then** the result summary appears on the event page

---

### User Story 4 - Post Author Selection (Priority: P2)

When creating a news post, the user needs to set the post author. Instead of typing a name as free text, the user should select a member from the system to ensure consistency and enable author profile linking.

**Why this priority**: While important for attribution and linking to member profiles, posts can function with text-based author names as a fallback. This enhances functionality but isn't blocking.

**Independent Test**: Can be fully tested by creating a post, selecting an author from member dropdown, saving, and verifying the author's profile is linked on the published post.

**Acceptance Scenarios**:

1. **Given** I am creating a news post, **When** I click the "Author" field, **Then** I see a dropdown of all members
2. **Given** I select a member as author, **When** I save the post, **Then** the member reference is stored and the member's name is displayed
3. **Given** I view the published post, **When** I click the author name, **Then** I navigate to the author's member profile page
4. **Given** a member is deleted, **When** posts reference that member as author, **Then** the system shows a fallback author name without breaking

---

### User Story 5 - Venue Selection for Teams and Events (Priority: P3)

When setting a venue for teams (training location) or events, the user should select from predefined venues in `data/venues.yaml` rather than typing the venue slug manually.

**Why this priority**: While venue references improve data consistency, they don't cause build failures if incorrect. The site can display venue slugs even if not found in the data file.

**Independent Test**: Can be fully tested by editing a team's training venue or an event's venue, selecting from the venues dropdown, and verifying the venue details display correctly on the published page.

**Acceptance Scenarios**:

1. **Given** I am editing a team's training schedule, **When** I click the "Venue" field, **Then** I see a dropdown of all venues from `data/venues.yaml` showing venue names
2. **Given** I select a venue, **When** I save the team, **Then** the venue slug is stored and venue details (address, map link) appear on the team page
3. **Given** I am creating an event, **When** I select a venue, **Then** the venue's full details are available for display on the event page

---

### Edge Cases

- What happens when a referenced content item is deleted after being selected (e.g., a member who is a coach is removed)?
- How does the dropdown handle a large number of items (e.g., 100+ members or teams)?
- What if the CMS backend (Sveltia/Decap CMS) doesn't support the relation widget for data files (venues.yaml)?
- What if a user needs to reference content that doesn't exist yet (should they be able to create it inline)?
- How does the system handle renamed content (slug changes) that break existing references?
- What happens if a collection is empty when creating a new item that needs to reference it?
- How are references validated during build time if the CMS validation fails?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CMS configuration MUST use the `relation` widget for all content reference fields (member, team, event references).
- **FR-002**: Reference dropdowns MUST display human-readable labels (e.g., member name + role) while storing the correct path/slug in front matter.
- **FR-003**: Dropdowns MUST be searchable when more than 10 items exist in the collection.
- **FR-004**: Team coach selection MUST show member name and role in format "Jane Doe (Head Coach)".
- **FR-005**: Event and team selection MUST show team name and sport in format "U13 Boys (Football)".
- **FR-006**: Event selection in results MUST show event title and date, sorted by date descending.
- **FR-007**: Venue selection MUST show venue display name from `data/venues.yaml` while storing the venue key/slug.
- **FR-008**: The CMS MUST prevent saving if a required reference field is empty.
- **FR-009**: Post author field MUST support both member reference (preferred) and free-text fallback for backward compatibility.
- **FR-010**: Multiple selection MUST be supported for fields that accept arrays (teams, tags).
- **FR-011**: Build process MUST validate that referenced content exists and output clear error messages if references are broken.
- **FR-012**: CMS MUST display a helpful message when a reference collection is empty (e.g., "No members available. Create a member first.").

### Key Entities *(include if feature involves data)*

- **Member**: Represents a person (player, coach, staff). Has name, role, teams, bio, portrait. Referenced by: teams (as coaches), posts (as authors).
- **Team**: Represents a sports team. Has name, sport, group, venue, coaches (member references), training schedule. Referenced by: events, results, posts, members.
- **Event**: Represents a fixture, tournament, training camp, or social event. Has title, date, event type, venue, teams. Referenced by: results.
- **Result**: Represents a match outcome. Has score, teams, event reference, placement, highlights.
- **Venue**: Defined in `data/venues.yaml`. Has name, address, map link, facilities. Referenced by: teams (primary venue and training venues), events.
- **Post**: News article. Has title, author (member reference or text), summary, teams, categories, tags.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create team pages with coach assignments without typing any paths manually - 100% of coach fields use dropdown selection.
- **SC-002**: CMS validation prevents saving entries with invalid references before build time - 0% of build failures due to invalid content references.
- **SC-003**: Reference selection dropdowns appear within 2 seconds even with 50+ items in the collection.
- **SC-004**: Users can search/filter reference dropdowns and find the correct item within 3 keystrokes on average.
- **SC-005**: All existing manual path references in archetypes are replaced with relation widget configurations in CMS config.
- **SC-006**: Build process validates references and provides actionable error messages (e.g., "Result 'u13-boys-win' references event 'events/missing-event' which does not exist") when references are broken.
- **SC-007**: Documentation is updated to show content editors how to use the new reference pickers instead of typing paths.

---

## Constitution Alignment Checklist

> Verify the feature complies with the Constitution quality gates.

- No login/auth or server/database introduced by this feature - CMS is git-based (Sveltia/Decap).
- Output remains fully static - reference resolution happens at Hugo build time.
- Content stays human-readable - front matter still contains readable slugs/paths, just selected via UI instead of typed.
- CMS configuration changes are documented for content editors.
- No JavaScript required on the published site - this is a CMS editing improvement only.
- References are validated at build time to maintain site integrity.
