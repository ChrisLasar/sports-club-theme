# Contributing to Sports Club Theme

Thank you for your interest in improving this sports club website template! This guide covers both content editors and technical contributors.

---

## For Content Editors

### Content Standards

**Writing Guidelines:**
- Use clear, concise language appropriate for all ages
- Avoid jargon unless necessary; explain when used
- Write in an inclusive, welcoming tone
- Proofread before publishing

**Image Requirements:**
- **Format**: JPG or PNG preferred
- **Size**: Maximum 2MB per image (will be optimized automatically)
- **Dimensions**: Minimum 1200x630px for social images
- **Alt Text**: ALWAYS provide descriptive alt text for accessibility
- **Consent**: Obtain written consent before publishing photos of youth members

**Member Privacy:**
- Never publish personal email addresses or phone numbers for youth members
- Use generic team emails (e.g., `u13@yourclub.org`)
- Enable "Portrait Consent" ONLY with explicit written permission
- Default privacy setting is portraits hidden—this is intentional
- Obtain parent/guardian consent for all youth member data

**Content Types:**

1. **Teams**: Update training schedules at start of each season
2. **Events**: Publish upcoming fixtures at least 1 week in advance
3. **Results**: Add match reports within 48 hours of completion
4. **Posts**: Aim for at least 2-4 posts per month
5. **Members**: Keep coach and staff profiles current

### Using Sveltia CMS

1. Access the CMS at `yoursite.com/admin/`
2. Log in with your authorized Git account
3. Draft → Review → Publish workflow:
   - **Save**: Keeps as draft (not visible on site)
   - **Publish**: Makes content live immediately
4. All edits are version-controlled via Git (full history preserved)

### Markdown Quick Reference

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered item
2. Next item

[Link text](https://example.com)
![Image alt text](image.jpg)
```

---

## For Developers

### Getting Started

1. **Fork and clone the repository**
2. **Install dependencies**: `npm install`
3. **Run development server**: `npm run dev`
4. **Build for production**: `npm run build`

### Code Standards

**HTML Templates (Hugo):**
- Use semantic HTML5 elements (`<article>`, `<nav>`, `<section>`)
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works for all controls
- Test with screen readers (NVDA, VoiceOver)

**CSS (Tailwind + daisyUI):**
- Use utility classes; avoid custom CSS unless necessary
- Follow mobile-first responsive design
- Maintain color contrast ≥4.5:1 (WCAG 2.1 AA)
- Use daisyUI components for consistency

**JavaScript (Alpine.js):**
- Keep JS minimal and optional (progressive enhancement)
- All core features must work without JavaScript
- Use Alpine.js for filter controls and UI enhancements only

**Content Archetypes:**
- Follow contracts in `specs/001-sports-club-ssg/contracts/`
- Document all front matter fields with comments
- Provide sensible defaults

### Performance Requirements

- **Lighthouse Score**: ≥90 (mobile and desktop)
- **LCP**: ≤ 2.5s on 3G mobile simulation
- **CLS**: ≤ 0.1
- **Total JS**: ≤ 50KB gzip
- **Images**: Lazy-loaded below fold; responsive srcset

### Accessibility Requirements

- **WCAG 2.1 AA compliance** (minimum)
- Test with keyboard navigation
- Test with screen reader (NVDA on Windows, VoiceOver on macOS)
- Validate with axe DevTools or WAVE
- All images must have alt text
- Forms must have proper labels

### Testing Checklist

Before submitting a pull request:

- [ ] Run `npm run build` successfully
- [ ] Test on mobile (≤320px width)
- [ ] Test on desktop (≥1440px width)
- [ ] Verify keyboard navigation works
- [ ] Check color contrast with devtools
- [ ] Validate HTML with W3C validator
- [ ] Test with JavaScript disabled
- [ ] Run Lighthouse audit (score ≥90)
- [ ] Test with screen reader

### Git Workflow

1. **Branch naming**: `feature/description` or `fix/description`
2. **Commit messages**: Clear, imperative mood (e.g., "Add event filtering")
3. **Pull requests**:
   - Reference related issues
   - Include screenshots for UI changes
   - Describe testing performed
   - Update documentation if needed

### File Structure

```
archetypes/         # Content templates
assets/css/         # Tailwind CSS entry point
config/_default/    # Hugo configuration
content/            # Markdown content files
  teams/            # Team pages (page bundles)
  members/          # Member profiles
  events/           # Fixtures and events
  results/          # Match results
  posts/            # News posts
data/               # YAML data files (club, venues)
layouts/            # Hugo templates
  _default/         # Base templates
  partials/         # Reusable components
  teams/            # Team templates
  members/          # Member templates
  events/           # Event templates
  results/          # Result templates
  posts/            # Post templates
static/             # Static files
  admin/            # Sveltia CMS
  images/           # Uploaded media
```

### Adding a New Content Type

1. Create archetype in `archetypes/`
2. Add layouts in `layouts/{type}/`
3. Create partial component if needed
4. Add to Sveltia CMS config in `static/admin/config.yml`
5. Update navigation if needed
6. Document in `specs/001-sports-club-ssg/quickstart.md`
7. Add example content

### Dependencies

**Production:**
- Hugo Extended 0.152+
- Tailwind CSS 4.x
- daisyUI 5.x
- Alpine.js 3.x (CDN)
- Sveltia CMS (CDN)

**Development:**
- Node.js 18+
- PostCSS
- Autoprefixer

### Deployment

See `specs/001-sports-club-ssg/quickstart.md` for deployment instructions for:
- Netlify
- Vercel  
- GitHub Pages

---

## Privacy & Data Protection

### Personal Data Handling

This template is designed with privacy-first defaults:

1. **Member portraits**: Hidden by default; require explicit consent
2. **Contact information**: Use generic team emails only
3. **Youth member data**: Extra protection required by law in many jurisdictions
4. **No tracking**: No analytics or cookies by default
5. **No authentication**: Public site only; no user accounts

### GDPR/Privacy Compliance

**If your club is subject to GDPR or similar laws:**

1. Add a privacy policy page explaining data collection
2. Obtain written consent for all member photos and data
3. Provide a mechanism for data deletion requests
4. Document data retention policies
5. Consider adding a cookie consent banner if analytics are added

**Data stored in this template:**
- Team information (public)
- Training schedules (public)
- Event information (public)
- Match results (public)
- Member names and roles (public by default)
- Member portraits (hidden by default; opt-in only)

### Recommended Practices

- **Youth members**: Always obtain parent/guardian consent
- **Generic emails**: Never publish personal email addresses
- **Consent forms**: Maintain physical/digital records
- **Annual review**: Re-confirm consent annually
- **Right to be forgotten**: Provide process to remove data

---

## Questions or Issues?

- **Content questions**: Contact your site administrator
- **Technical issues**: Open a GitHub issue
- **Security concerns**: Email security@yourclub.org (private disclosure)

---

## Code of Conduct

We expect all contributors to:
- Be respectful and inclusive
- Protect privacy of club members (especially youth)
- Follow accessibility best practices
- Write clear, maintainable code
- Document changes appropriately

Thank you for contributing to make this template better! 🎉
