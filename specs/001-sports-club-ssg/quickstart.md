# Quickstart: Sports Club Static Site Template

**Feature**: 001-sports-club-ssg  
**Date**: 2025-10-25  
**Audience**: Club editors and site administrators

## Overview

This quickstart explains how to add and update content for your sports club website using Sveltia CMS. No technical skills or command-line experience required.

---

## For Editors: Adding Content via CMS

### Accessing the CMS

1. Open your web browser and go to `yourclubsite.com/admin/`
2. Log in with your GitHub/GitLab account (ask your site administrator for access)
3. You'll see the Sveltia CMS dashboard with content collections

### Adding a New Team

1. Click **Teams** in the left sidebar
2. Click **New Team** button
3. Fill in the form:
   - **Team Name**: e.g., "U13 Boys Football"
   - **Group**: e.g., "U13" (or "Beginner", "Advanced", etc.)
   - **Sport**: e.g., "Football"
   - **Season**: Start date, end date, status (active/off-season)
   - **Training Schedule**: Click "+ Add training" for each session
     - Day (Monday-Sunday)
     - Start time (HH:MM format, e.g., "18:00")
     - End time (e.g., "19:30")
     - Venue (must match venue slug from site config)
   - **Coaches**: Click "+ Add coaches" for each coach
     - Select existing member from dropdown (member must be created first)
     - Role (e.g., "Head Coach", "Assistant Coach")
     - **Generic team email** (e.g., `u13@yourclub.org`) — NOT personal email
   - **Social Image**: Upload a team photo
   - **Description**: Brief text about the team
   - **Body**: Longer team information in Markdown
4. Click **Save** (saves draft) or **Publish** (makes live)

**Note**: Create member profiles for coaches before adding them to teams.

### Adding a Member Profile

1. Click **Members** in the left sidebar
2. Click **New Member**
3. Fill in:
   - **Name**: Member's full name
   - **Role**: e.g., "Coach", "Manager", "Player"
   - **Teams**: List team paths (e.g., `teams/u13-boys`)
   - **Group**: For players (e.g., "U13", "Beginner"); leave blank for staff
   - **Biography**: Optional text about the member
   - **Portrait**: Upload a photo
   - **Privacy Settings**:
     - ✅ **Show on Public Site**: Usually checked
     - ✅ **Show on Team Roster**: Usually checked
     - ⚠️ **Portrait Consent (opt-in)**: **MUST be checked to show portrait**—default is OFF for privacy
   - **Show Contact Publicly**: Leave unchecked for youth members
4. Click **Publish**

**Privacy Note**: Portraits are **hidden by default** unless you explicitly check "Portrait Consent". Always get consent before enabling for youth members.

**Important**: Create member profiles before assigning them as coaches to teams.

### Adding an Event/Fixture

1. Click **Events & Fixtures**
2. Click **New Event**
3. Fill in:
   - **Event Title**: e.g., "U13 Boys vs. Rival Club"
   - **Type**: fixture | tournament | training-camp | social
   - **Date & Time**: Select date and time
   - **Location**: e.g., "Away - Rival Club Stadium"
   - **Teams**: Enter team slugs (e.g., `u13-boys`)
   - **Opponent**: For fixtures only
   - **Status**: upcoming (default) | completed | cancelled
   - **Registration Required**: Check if yes; set deadline date
4. Click **Publish**

### Adding a Result

1. Click **Results**
2. Click **New Result**
3. Fill in:
   - **Title**: e.g., "U13 Boys vs. Rival Club - Win 3-1"
   - **Event Reference**: Path to the event (e.g., `events/u13-boys-vs-rival-2025-11-15`)
   - **Date**: Match date
   - **Teams**: Team slugs
   - **Score**: Home score, away score, team names
   - **Highlights**: Brief match report
   - **Media Gallery**: Upload photos (optional)
4. Click **Publish**

### Adding a News Post

1. Click **News & Posts**
2. Click **New Post**
3. Fill in:
   - **Title**: Post headline
   - **Publish Date**: Auto-filled; adjust if needed
   - **Author**: Your name or "Club Admin"
   - **Summary**: Required—used in previews and social sharing
   - **Teams**: Optional—tag related teams
   - **Body**: Write your post in Markdown (see formatting tips below)
   - **Social Image**: Upload a featured image
   - **Discussion Link**: Optional—link to your Facebook/Twitter post for comments
4. Click **Publish**

**Comments Note**: The site does not have on-site comments. If you add a Discussion Link, a "Discuss on [Platform]" button will appear on the post.

### Markdown Formatting Tips

- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Heading**: `## Heading`
- **List**: `- Item 1`
- **Link**: `[Link text](https://example.com)`
- **Image**: `![Alt text](image-filename.jpg)`

---

## For Developers: Local Setup & Preview

### Prerequisites

- Hugo Extended 0.152+ installed
- Node.js 18+ and npm (for Tailwind CSS processing)
- Git

### Setup Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourorg/sports-club-theme.git
   cd sports-club-theme
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   This installs Tailwind CSS, daisyUI, and PostCSS.

3. **Configure Hugo**:

   Edit `config/_default/hugo.toml`:

   ```toml
   baseURL = "https://yourclubsite.com"
   languageCode = "en-us"
   title = "Your Club Name"

   [taxonomies]
     team = "teams"
     tag = "tags"
     category = "categories"

   [params]
     description = "Your club description"
   ```

4. **Add club data**:

   Edit `data/club.yaml`:

   ```yaml
   name: "Your Sports Club"
   logo: "/images/club-logo.svg"
   description: "Community sports for all ages"
   contact:
     email: "info@yourclub.org"
   socialChannels:
     facebook: "https://facebook.com/yourclub"
   ```

5. **Add venues**:

   Edit `data/venues.yaml`:

   ```yaml
   main-field:
     name: "Main Training Field"
     address: "123 Club Lane, Hometown"
     mapLink: "https://maps.google.com/?q=..."
   ```

6. **Preview locally**:

   ```bash
   hugo server -D
   ```

   Open <http://localhost:1313> in your browser.

7. **Build for production**:

   ```bash
   hugo --minify
   ```

   Output is in `public/` directory—deploy to your hosting provider.

### Directory Structure

```text
sports-club-theme/
├── archetypes/          # Content templates
│   ├── teams/index.md
│   ├── members.md
│   ├── events.md
│   ├── results.md
│   └── posts.md
├── assets/              # Tailwind CSS, Alpine.js
│   └── css/main.css
├── config/              # Site configuration
│   └── _default/
│       └── hugo.toml
├── content/             # All site content
│   ├── teams/
│   ├── members/
│   ├── events/
│   ├── results/
│   ├── posts/
│   └── pages/
├── data/                # Shared data
│   ├── club.yaml
│   └── venues.yaml
├── layouts/             # Hugo templates
│   ├── _default/
│   ├── teams/
│   ├── members/
│   ├── events/
│   ├── results/
│   ├── posts/
│   └── partials/
├── static/              # Static files
│   ├── admin/           # Sveltia CMS
│   │   ├── config.yml
│   │   └── index.html
│   ├── images/
│   └── robots.txt
├── tailwind.config.js   # Tailwind + daisyUI config
├── package.json         # Node dependencies
└── public/              # Generated site (git-ignored)
```

### Creating Content via Command Line

```bash
# Create a new team
hugo new teams/u13-boys/index.md

# Create a new member
hugo new members/jane-doe.md

# Create a new event
hugo new events/u13-boys-vs-rival-2025-11-15.md

# Create a new result
hugo new results/u13-boys-win-3-1.md

# Create a new post
hugo new posts/season-kickoff-2025.md
```

Edit the created Markdown files and fill in front matter fields.

---

## Deployment

### Netlify

1. Connect your Git repository to Netlify
2. Build command: `hugo --minify`
3. Publish directory: `public`
4. Environment variables:
   - `HUGO_VERSION`: `0.152.0`
   - `NODE_VERSION`: `18`

### Vercel

1. Connect repository to Vercel
2. Framework Preset: Hugo
3. Build command: `hugo --minify`
4. Output directory: `public`

### GitHub Pages

1. Add `.github/workflows/hugo.yml`:

   ```yaml
   name: Deploy Hugo site to Pages

   on:
     push:
       branches: ["main"]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: peaceiris/actions-hugo@v2
           with:
             hugo-version: '0.152.0'
             extended: true
         - run: npm ci
         - run: hugo --minify
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./public
   ```

2. Enable GitHub Pages in repository settings, source: `gh-pages` branch

---

## Performance & Accessibility

### Performance Budgets

The site is designed to meet:

- **LCP** ≤ 2.5s on 3G mobile
- **CLS** ≤ 0.1
- **Total JS** ≤ 50KB gzip

### Testing

```bash
# Run Lighthouse CI
npm run lighthouse

# Check accessibility
npm run a11y
```

### Optimization Tips

- **Images**: Upload images ≤ 2MB; Hugo will resize automatically
- **Alt text**: Always provide for accessibility
- **Lazy loading**: Images below fold are lazy-loaded by default
- **CSS**: Tailwind purges unused styles automatically

---

## Troubleshooting

### CMS Login Issues

- Ensure Git backend is configured correctly in `static/admin/config.yml`
- Check that your Git provider (GitHub/GitLab) OAuth is set up
- Verify you have write access to the repository

### Build Errors

- Check Hugo version: `hugo version` (must be Extended 0.152+)
- Verify front matter YAML syntax in content files
- Ensure image paths are correct (relative to page bundle or `static/`)

### Images Not Showing

- For team page bundles, images must be in `content/teams/{team-slug}/`
- For other content, images go in `static/images/uploads/`
- Check `socialImage` field matches actual filename

### Privacy Settings Not Working

- Verify `visibility.portraitConsent` is set in member front matter
- Check template logic in `layouts/members/single.html`
- Default is `false`—must be explicitly enabled

---

## Support

For questions or issues:

- Check the [Hugo documentation](https://gohugo.io/documentation/)
- Review [Sveltia CMS docs](https://github.com/sveltia/sveltia-cms)
- Contact your site administrator

---

## Next Steps

1. Add example content for each content type
2. Customize daisyUI theme in `tailwind.config.js`
3. Update club logo and branding images
4. Configure social media links in `data/club.yaml`
5. Test accessibility with screen reader
6. Run Lighthouse audit and optimize

Happy editing! 🎉
