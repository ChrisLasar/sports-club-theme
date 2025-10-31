# Media Files

This directory contains media files for the sports club website.

## Directory Structure

```
static/images/
├── placeholders/     # Placeholder images for development
├── uploads/          # CMS-uploaded images (teams, events, posts)
├── logos/            # Club logos and branding
└── favicon/          # Favicon files
```

## Image Guidelines

### For Editors (via CMS)

When uploading images through the CMS:

1. **File Size**: Keep images under 2MB (they will be optimized automatically)
2. **Dimensions**:
   - **Social images**: 1200x630px minimum
   - **Team photos**: 800x600px minimum
   - **Event photos**: 1200x800px minimum
   - **Member portraits**: 400x400px minimum (square)
3. **Format**: JPG or PNG (WebP conversion happens automatically)
4. **File names**: Use descriptive names: `u13-boys-team-photo-2025.jpg` not `IMG_1234.jpg`

### For Developers

**Page Bundle Images** (recommended):
Place images in the same folder as the content file:
```
content/
  teams/
    u13-boys/
      index.md
      team-photo.jpg        ← Hugo will find this automatically
      coach-portrait.jpg
```

**Static Images**:
Place in `static/images/uploads/`:
```
static/images/uploads/
  2025-season-kickoff.jpg
```

Reference in content:
```markdown
![Team photo](team-photo.jpg)              # For page bundles
![Event photo](/images/uploads/event.jpg)  # For static images
```

## Image Processing

Hugo automatically:
- Generates responsive image sizes (480w, 768w, 1200w)
- Creates WebP versions for modern browsers
- Adds lazy loading to below-fold images
- Includes width/height to prevent layout shift

## Placeholder Images

For development and testing, you can use placeholder services:

```markdown
![Placeholder](https://placehold.co/1200x630/1e40af/ffffff?text=Sports+Club)
```

Or use the included placeholder images in `static/images/placeholders/`.

## Required Images

At minimum, add these images before going live:

- [ ] Club logo (`data/club.yaml` → logo field)
- [ ] Favicon (static/favicon.svg and static/favicon.png)
- [ ] At least one team photo per team
- [ ] Social sharing image for homepage
- [ ] Default social image (fallback)

## Privacy & Consent

**IMPORTANT**: Before publishing any photos containing people:

1. Obtain written consent from all adults
2. Obtain parent/guardian consent for all youth members
3. For member portraits, ensure `portraitConsent: true` in front matter
4. Never publish personal contact information with photos
5. Use generic team emails only

See `CONTRIBUTING.md` for full privacy guidelines.

## Image Optimization Tips

### Before Upload

- Crop to correct aspect ratio
- Remove EXIF data (especially GPS coordinates)
- Compress with tools like TinyPNG or ImageOptim
- Use descriptive alt text in content

### Performance

All images are automatically optimized by Hugo:
- Resized to multiple variants
- Converted to WebP
- Lazy-loaded (except above-fold)
- Include srcset for responsive delivery

## Need Help?

- Hugo image processing: https://gohugo.io/content-management/image-processing/
- Page bundles: https://gohugo.io/content-management/page-bundles/
- Sveltia CMS media: https://github.com/sveltia/sveltia-cms#media-files
