# Sports Club Static Site Template

A Hugo-based static site generator template for sports clubs, featuring team management, event scheduling, results tracking, and news publishing with a user-friendly CMS interface.

## Features

- 🏆 **Team Management**: Manage multiple teams with training schedules, coaches, and rosters
- 📅 **Events & Fixtures**: Track upcoming matches, tournaments, and club events
- 📊 **Results Archive**: Record and display match results and tournament placements
- 📰 **News Publishing**: Share club news and updates with team associations
- 👥 **Member Profiles**: Privacy-first member roster with consent-based portrait display
- 📝 **Git-Based CMS**: Non-technical content editing via Sveltia CMS
- 🎨 **Modern Styling**: Built with Tailwind CSS 4.x and daisyUI 5.x
- ⚡ **Performance**: Optimized for speed (LCP ≤ 2.5s on 3G)
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 📱 **Mobile-First**: Responsive design for all devices

## Prerequisites

- **Hugo Extended** 0.152.0 or higher ([installation guide](https://gohugo.io/installation/))
- **Node.js** 18.0.0 or higher ([download](https://nodejs.org/))
- **Git** for version control

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd sports-club-theme

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:1313/`

### 2. Configure Your Club

Edit `data/club.yaml` with your club information:

```yaml
name: "Your Sports Club"
logo: "/images/club-logo.svg"
description: "Your club description"
contact:
  email: "info@yourclub.org"
  phone: "+1234567890"
socialChannels:
  facebook: "https://facebook.com/yourclub"
  instagram: "https://instagram.com/yourclub"
```

### 3. Add Content

#### Via CMS (Recommended for Non-Technical Users)

1. Build and deploy your site (see [Deployment](#deployment))
2. Access the CMS at `yoursite.com/admin/`
3. Log in with GitHub/GitLab credentials
4. Use the visual interface to add teams, members, events, and posts

#### Via Command Line

```bash
# Create a new team
hugo new content/teams/u13-boys/index.md

# Create a new member
hugo new content/members/john-smith.md

# Create an event
hugo new content/events/upcoming-match.md

# Create a post
hugo new content/posts/season-announcement.md
```

Edit the created Markdown files with your content.

## Project Structure

```
.
├── archetypes/        # Content templates
│   ├── teams/
│   ├── members.md
│   ├── events.md
│   ├── results.md
│   └── posts.md
├── assets/            # CSS, JS, and other processed assets
│   └── css/
│       └── main.css
├── content/           # Your content (Markdown files)
│   ├── teams/
│   ├── members/
│   ├── events/
│   ├── results/
│   └── posts/
├── data/              # Site data files
│   ├── club.yaml
│   └── venues.yaml
├── layouts/           # HTML templates
│   ├── _default/
│   ├── partials/
│   ├── teams/
│   ├── members/
│   ├── events/
│   ├── results/
│   └── posts/
├── static/            # Static files (copied as-is)
│   ├── admin/         # CMS configuration
│   └── images/
└── config/            # Hugo configuration
    └── _default/
        └── hugo.toml
```

## Development

### Available Scripts

```bash
# Start development server with drafts and live reload
npm run dev

# Build production site
npm run build

# Clean build artifacts
npm run clean
```

### Adding Example Content

See `specs/001-sports-club-ssg/quickstart.md` for detailed instructions on:
- Creating teams with training schedules
- Adding member profiles with privacy settings
- Managing events and results
- Publishing news posts

## Deployment

### Netlify

1. Connect your Git repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Environment variables**: `HUGO_VERSION=0.152.0`
3. Deploy!

The CMS will be available at `yoursite.netlify.app/admin/`

### Vercel

1. Import your Git repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Hugo
   - **Build Command**: `npm run build`
   - **Output Directory**: `public`
3. Add environment variable: `HUGO_VERSION=0.152.0`

### GitHub Pages

```bash
# Build the site
npm run build

# Deploy to GitHub Pages (configure your repository settings)
# Or use GitHub Actions for automated deployment
```

## Customization

### Unified Card System

This template uses a unified card component system for consistent content display across all archetypes (teams, members, events, results, posts). Changes to card styling propagate automatically to all pages.

**Key Features**:
- Single reusable card partial: `layouts/partials/card.html`
- Archetype-specific mappers: `layouts/partials/mappers/{type}-to-card.html`
- Built with daisyUI card components
- Responsive grid layouts with equal-height cards
- Support for default and compact variants

**Quick Example**:

```go-html-template
{{- /* Display cards in a responsive grid */ -}}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
  {{ range .Pages }}
    {{ $cardData := partial "mappers/event-to-card.html" . }}
    {{ partial "card.html" $cardData }}
  {{ end }}
</div>
```

**Documentation**:
- **Usage Guide**: `specs/003-unify-card-component/quickstart.md`
- **Data Model**: `specs/003-unify-card-component/data-model.md`
- **Contract**: `specs/003-unify-card-component/contracts/card-partial.md`

### Theming

Edit `tailwind.config.js` to customize colors and styling:

```javascript
theme: {
  extend: {
    colors: {
      'club-primary': '#1a365d',
      'club-secondary': '#2d3748',
    },
  },
},
daisyui: {
  themes: [
    {
      light: {
        primary: '#1a365d',
        secondary: '#2d3748',
        // ... more theme colors
      },
    },
  ],
},
```

### Adding Venues

Edit `data/venues.yaml`:

```yaml
main-field:
  name: "Main Training Field"
  address: "123 Club Lane, Hometown"
  mapLink: "https://maps.google.com/?q=..."
  facilities: "Changing rooms, floodlights"
```

## Privacy & GDPR

This template includes privacy-first features:

- **Portrait Consent**: Member portraits are hidden by default; explicit consent required
- **Generic Emails**: Team contact uses generic emails (e.g., `team@club.org`), not personal addresses
- **Visibility Controls**: Members can opt out of public roster display
- **No Tracking**: No analytics or tracking by default

See `specs/001-sports-club-ssg/quickstart.md` for privacy policy considerations.

## Performance

Target metrics:
- **LCP** (Largest Contentful Paint): ≤ 2.5s on 3G
- **CLS** (Cumulative Layout Shift): ≤ 0.1
- **Total JavaScript**: ≤ 50KB gzip

Optimizations:
- Responsive images with WebP/AVIF
- Lazy loading for below-fold images
- Tailwind CSS purge for minimal CSS
- Minified HTML/CSS/JS
- Optional Alpine.js for progressive enhancement

## Accessibility

Compliant with **WCAG 2.1 Level AA**:
- Semantic HTML5 elements
- Keyboard navigation support
- ARIA labels for interactive elements
- Color contrast ≥ 4.5:1 for body text
- Alt text for images
- Skip links for screen readers

## Documentation

- **Feature Specification**: `specs/001-sports-club-ssg/spec.md`
- **Implementation Plan**: `specs/001-sports-club-ssg/plan.md`
- **Data Model**: `specs/001-sports-club-ssg/data-model.md`
- **Editor Guide**: `specs/001-sports-club-ssg/quickstart.md`
- **Contract Specifications**: `specs/001-sports-club-ssg/contracts/`

## Support

For questions or issues:
1. Check the quickstart guide: `specs/001-sports-club-ssg/quickstart.md`
2. Review contract specifications in `specs/001-sports-club-ssg/contracts/`
3. Open an issue in the repository

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [Hugo](https://gohugo.io/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [daisyUI](https://daisyui.com/) - Tailwind CSS components
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) - Git-based CMS
- [Alpine.js](https://alpinejs.dev/) - Progressive JavaScript framework
