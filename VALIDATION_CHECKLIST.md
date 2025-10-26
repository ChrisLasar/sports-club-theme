# Validation & Testing Checklist

This document provides step-by-step validation procedures for T074, T091-T092, T095-T097, and T100.

---

## T074: Test Sveltia CMS Workflow

### Prerequisites
- Site deployed to hosting with Git backend configured
- GitHub/GitLab OAuth set up for Sveltia CMS
- User has write access to repository

### Test Procedure

1. **Access CMS**
   - Navigate to `https://yoursite.com/admin/`
   - Authenticate with GitHub/GitLab
   - Verify dashboard loads

2. **Test Team Creation**
   - Click "Teams" → "New Team"
   - Fill all required fields:
     - Team Name, Group, Sport
     - Training schedule (at least one session)
     - Coaches (select from members)
   - Add social image
   - **Save as draft** first
   - **Publish**
   - Verify team page appears on site

3. **Test Member Creation**
   - Click "Members" → "New Member"
   - Fill fields, test privacy settings:
     - portraitConsent: false (default) - verify portrait hidden
     - portraitConsent: true - verify portrait shows
   - Publish
   - Verify member page

4. **Test Event Creation**
   - Click "Events & Fixtures" → "New Event"
   - Create upcoming fixture
   - Set teams, opponent, location
   - Publish
   - Verify event appears in:
     - /events/ list
     - Related team page
     - Homepage (if upcoming)

5. **Test Result Creation**
   - Click "Results" → "New Result"
   - Link to existing event
   - Add score/placement
   - Publish
   - Verify result appears correctly

6. **Test Post Creation**
   - Click "News & Posts" → "New Post"
   - Add content, featured image
   - Tag teams
   - Add discussLink (optional)
   - Publish
   - Verify post on homepage and tagged team pages

### Success Criteria
- ✅ All content types can be created
- ✅ Changes trigger Git commits
- ✅ Published content appears on site within build time (1-3 minutes)
- ✅ Privacy settings work correctly
- ✅ Relationships (team tags, event links) function

---

## T091: Performance Metrics Validation

### Tools Required
- Google Lighthouse (Chrome DevTools)
- WebPageTest (optional)
- Chrome DevTools Network tab

### Test Procedure

#### 1. Lighthouse Audit (Mobile)

```bash
# In Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Mobile" device
# 4. Check: Performance, Accessibility, Best Practices, SEO
# 5. Click "Analyze page load"
```

**Test these pages:**
- Homepage (/)
- Team page (/teams/u13-boys/)
- Event list (/events/)
- Post (/posts/[any-post]/)

**Target Metrics:**
- Performance: ≥ 90
- LCP: ≤ 2.5s
- CLS: ≤ 0.1
- FID/INP: ≤ 100ms
- Total Blocking Time: ≤ 200ms

#### 2. JavaScript Bundle Size

```bash
# Build production site
npm run build

# Check JS size
ls -lh public/**/*.js | grep -v '.min'

# Gzip size
gzip -c public/path/to/main.js | wc -c
```

**Target:** ≤ 50KB gzip for all JS combined

#### 3. 3G Network Simulation

```bash
# In Chrome DevTools:
# 1. Network tab
# 2. Throttling: "Slow 3G"
# 3. Reload page
# 4. Measure LCP
```

**Target:** LCP ≤ 2.5s on Slow 3G

### Success Criteria
- ✅ Lighthouse Performance ≥ 90
- ✅ LCP ≤ 2.5s (even on 3G)
- ✅ CLS ≤ 0.1
- ✅ Total JS ≤ 50KB gzip

---

## T092: Social Share Preview Validation

### Tools Required
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Or use: https://www.opengraph.xyz/

### Test Procedure

1. **Test Homepage**
   - URL: https://yoursite.com/
   - Verify:
     - Title: Club name
     - Description: Club description
     - Image: Club logo or hero image (1200x630px)

2. **Test Team Page**
   - URL: https://yoursite.com/teams/u13-boys/
   - Verify:
     - Title: "U13 Boys | Club Name"
     - Description: Team description
     - Image: Team photo (if socialImage set)

3. **Test Post**
   - URL: https://yoursite.com/posts/[post-slug]/
   - Verify:
     - Title: Post title
     - Description: Post summary
     - Image: Featured image (socialImage)
     - Author tag (optional)

### Validation Tools

```bash
# View generated meta tags
curl https://yoursite.com/ | grep -A 2 'og:'
curl https://yoursite.com/ | grep -A 2 'twitter:'
```

### Success Criteria
- ✅ Title, description, image present for all pages
- ✅ Images are 1200x630px minimum
- ✅ Images load correctly in all validators
- ✅ No missing or broken meta tags

---

## T095: Accessibility Audit

### Tools Required
- axe DevTools (browser extension)
- WAVE (https://wave.webaim.org/)
- Keyboard (manual testing)
- Screen reader (NVDA on Windows, VoiceOver on macOS)

### Test Procedure

#### 1. Automated Testing

```bash
# Using axe DevTools:
# 1. Install browser extension
# 2. Open DevTools → axe tab
# 3. Click "Scan ALL of my page"
# 4. Review issues
```

**Test all page types:**
- Homepage
- Team list and single
- Member list and single
- Event list and single
- Result list and single
- Post list and single

**Target:** 0 critical issues, ≤ 3 minor issues

#### 2. Keyboard Navigation Test

**Test sequence:**
1. Press Tab repeatedly - verify focus visible and logical order
2. Navigate to team page
3. Tab through training schedule, coach cards
4. Navigate to events page
5. Tab through filter controls
6. Test Enter/Space to activate links/buttons
7. Test Escape to close mobile menu (if open)

**Success criteria:**
- ✅ All interactive elements reachable
- ✅ Focus indicator visible (outline/ring)
- ✅ Logical tab order (top to bottom, left to right)
- ✅ No keyboard traps

#### 3. Screen Reader Test

```bash
# macOS VoiceOver
Cmd + F5 to enable
VO + Right Arrow to navigate

# Windows NVDA
Download from https://www.nvaccess.org/
Ctrl + Alt + N to start
```

**Test:**
- Homepage hero section reads correctly
- Navigation menu announces items
- Team training schedule table is understandable
- Form labels are announced
- Image alt text is read
- Filter controls are labeled

#### 4. Color Contrast

```bash
# Using Chrome DevTools:
# 1. Inspect element
# 2. Check contrast ratio in Color Picker
# 3. Must be ≥ 4.5:1 for normal text
# 4. Must be ≥ 3:1 for large text (18pt+)
```

**Check these elements:**
- Body text on base-100 background
- Badge text (primary, secondary, accent)
- Button text
- Link text
- Form labels

### Success Criteria
- ✅ 0 critical axe violations
- ✅ All keyboard navigation works
- ✅ Screen reader can navigate all content
- ✅ Color contrast ≥ 4.5:1 (AA standard)

---

## T096: HTML Validation

### Tools
- W3C Validator: https://validator.w3.org/
- HTML5 Validator: https://html5.validator.nu/

### Test Procedure

1. **Build Production Site**
   ```bash
   npm run build
   ```

2. **Validate Key Pages**
   - Homepage: `public/index.html`
   - Team page: `public/teams/u13-boys/index.html`
   - Event list: `public/events/index.html`
   - Post: `public/posts/[post]/index.html`

3. **Upload to Validator**
   - Go to https://validator.w3.org/#validate_by_upload
   - Upload each HTML file
   - Review errors/warnings

4. **Common Issues to Check**
   - Unclosed tags
   - Missing alt attributes
   - Duplicate IDs
   - Invalid nesting
   - Missing DOCTYPE

### Success Criteria
- ✅ 0 errors on all tested pages
- ✅ Warnings are acceptable if documented (e.g., experimental features)

---

## T097: Quickstart Workflow Test

### Prerequisites
- Fresh machine or VM
- No Hugo or Node.js installed (to test from scratch)

### Test Procedure

1. **Follow quickstart.md exactly**
   ```bash
   # Clone repository
   git clone https://github.com/yourorg/sports-club-theme.git
   cd sports-club-theme
   
   # Install Hugo Extended 0.152+
   # (follow instructions in quickstart.md)
   
   # Verify Hugo version
   hugo version
   
   # Install dependencies
   npm install
   
   # Run dev server
   npm run dev
   ```

2. **Verify Site Loads**
   - Open http://localhost:1313/
   - Verify homepage loads
   - Click through to teams, events, results, posts
   - Test filters on events and results pages

3. **Test Build**
   ```bash
   npm run build
   ```
   - Verify `public/` directory created
   - Check for errors in console

4. **Test Content Creation**
   ```bash
   hugo new teams/new-team/index.md
   hugo new members/new-member.md
   hugo new events/new-event.md
   hugo new results/new-result.md
   hugo new posts/new-post.md
   ```
   - Verify archetypes work
   - Check front matter is correct

### Success Criteria
- ✅ Fresh clone builds successfully
- ✅ All commands in quickstart.md work
- ✅ No missing dependencies
- ✅ Site runs in < 5 minutes from clone

---

## T100: Final Requirements Review

Review all functional requirements from `specs/001-sports-club-ssg/spec.md`:

### FR-001: Team Pages
- ✅ Team name, group, sport displayed
- ✅ Training schedule with day/time/venue
- ✅ Coach information with contact
- ✅ Season information

### FR-002: Training Schedule Display
- ✅ Day, time, venue shown
- ✅ Venue details from data/venues.yaml
- ✅ Map link (if venue has mapLink)

### FR-003: Coach Contact
- ✅ Generic team email shown
- ✅ No personal contact info
- ✅ Multiple coaches supported

### FR-004: Member Roster
- ✅ Grouped by role
- ✅ Privacy-aware portraits
- ✅ portraitConsent defaults to false

### FR-005: Off-Season Messaging
- ✅ season.status: active | off-season | archived
- ✅ Conditional messaging displayed

### FR-006: Event Listings
- ✅ Events list with status (upcoming/completed)
- ✅ Filter by team
- ✅ Filter by status

### FR-007: Event Details
- ✅ Date, time, location
- ✅ Opponent (for fixtures)
- ✅ Registration info (if required)

### FR-008: Results Archive
- ✅ Results with scores
- ✅ Tournament placements
- ✅ Filter by team

### FR-009: News Posts
- ✅ Title, author, date, summary
- ✅ Featured image
- ✅ Team tagging

### FR-010: Discuss Links
- ✅ Optional discussLink field
- ✅ Conditional display (only if set)

### FR-011: Sveltia CMS
- ✅ All content types in CMS
- ✅ Intuitive field names
- ✅ Privacy defaults

### FR-012: Social Metadata
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Per-page override via socialImage

### FR-013: Mobile-First
- ✅ Responsive design
- ✅ Touch-friendly navigation
- ✅ Mobile menu

### Success Criteria
- ✅ All 13 functional requirements met
- ✅ All success criteria from spec.md achieved
- ✅ All user stories validated

---

## Final Checklist Summary

- [ ] T074: CMS workflow tested with real deployment
- [ ] T091: Lighthouse audit (Performance ≥ 90)
- [ ] T092: Social previews validated on 3 platforms
- [ ] T095: Accessibility audit (0 critical issues)
- [ ] T096: HTML validation (0 errors)
- [ ] T097: Quickstart workflow tested from fresh clone
- [ ] T100: All FR-001 through FR-013 verified

---

## Notes

- Most validation tasks require the site to be deployed to a public URL
- CMS testing requires OAuth configuration with Git provider
- Performance testing is most accurate on real hosting (not localhost)
- Accessibility testing should involve real users when possible

---

## Next Steps After Validation

1. Fix any issues found during validation
2. Re-run failed tests
3. Update documentation if workflow changes
4. Create production deployment
5. Train content editors on CMS
6. Set up monitoring (uptime, analytics if desired)
