# Quickstart: Live Preview Deployment System

**Feature**: 002-preview-deployment  
**Purpose**: Get started with automatic preview deployments for your Hugo site

---

## Overview

This system automatically deploys your Hugo site to GitHub Pages:

- **Main branch** → Published at `https://username.github.io/repo-name/`
- **Feature branches** → Previews at `https://username.github.io/repo-name/preview/branch-name/`
- **Preview index** → List of all active previews at `https://username.github.io/repo-name/preview/`

---

## Prerequisites

- ✅ GitHub repository with Hugo site
- ✅ Hugo 0.152+ Extended (for Tailwind CSS)
- ✅ Node.js 22+ and npm
- ✅ `package.json` with dependencies (daisyUI, Tailwind CSS 4.x)

---

## Setup (One-time)

### 1. Create gh-pages Branch

```bash
# Create orphan branch (no history)
git checkout --orphan gh-pages

# Clear all files
git rm -rf .

# Create initial commit
echo "# GitHub Pages Branch" > README.md
git add README.md
git commit -m "Initialize gh-pages branch"

# Push to GitHub
git push origin gh-pages

# Return to main branch
git checkout main
```

### 2. Add Workflow Files

Copy the three workflow files to `.github/workflows/`:

```bash
mkdir -p .github/workflows

# Copy from specs/002-preview-deployment/contracts/
cp specs/002-preview-deployment/contracts/deploy-main.yml .github/workflows/
cp specs/002-preview-deployment/contracts/deploy-preview.yml .github/workflows/
cp specs/002-preview-deployment/contracts/cleanup-preview.yml .github/workflows/
```

### 3. Update BASE_URL

Edit **all three** workflow files and replace `BASE_URL`:

```yaml
# Change this:
env:
  BASE_URL: "https://username.github.io/repo-name"

# To your actual GitHub Pages URL:
env:
  BASE_URL: "https://your-username.github.io/your-repo-name"
```

### 4. Enable GitHub Pages

1. Go to **Settings** → **Pages** in your GitHub repository
2. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Click **Save**

### 5. Configure Repository Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Enable **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

---

## Usage

### Deploy Main Branch

Push to `main` branch:

```bash
git add .
git commit -m "Update homepage"
git push origin main
```

**Result**: Site deployed to `https://your-username.github.io/your-repo-name/`

### Create Feature Preview

Push to any other branch:

```bash
git checkout -b feature/new-design
# Make changes...
git add .
git commit -m "Try new homepage design"
git push origin feature/new-design
```

**Result**: Preview at `https://your-username.github.io/your-repo-name/preview/feature-new-design/`

### View All Previews

Visit the preview index:

```
https://your-username.github.io/your-repo-name/preview/
```

This page shows:
- All active feature branch previews
- Build status (success/error)
- Commit info and timestamps
- Links to view previews or error pages

### Remove Preview

Delete the branch:

```bash
git push origin --delete feature/new-design
```

**Result**: Preview automatically removed, index updated

---

## Workflow Behavior

### Main Branch Deployments

- **Trigger**: Push to `main`
- **Concurrency**: No cancellation (waits for previous deployment)
- **Cache**: Restores from `hugo-main-*` keys
- **Build**: Production mode, no drafts/future posts
- **Deployment**: Replaces root content, preserves `/preview/` directory

### Feature Branch Deployments

- **Trigger**: Push to any branch except `main`
- **Concurrency**: Cancels previous run for same branch
- **Cache**: Branch-specific keys (`hugo-branch-name-*`)
- **Build**: Preview mode, includes drafts and future posts
- **Deployment**: Creates/updates `/preview/branch-name/` directory
- **Error Handling**: Deploys error page if build fails

### Cleanup

- **Trigger**: Branch deletion
- **Action**: Removes `/preview/branch-name/` directory
- **Index**: Automatically regenerates preview index

---

## Build Performance

### Cache Strategy

Hugo resource cache is saved after each successful build:

- **Main branch**: `hugo-main-{run_id}` → fallback to `hugo-main-` → fallback to `hugo-`
- **Feature branch**: `hugo-feature-name-{run_id}` → fallback to `hugo-feature-name-` → fallback to `hugo-`

### Expected Build Times

| Scenario | First Build | Cached Build |
|----------|-------------|--------------|
| **Main branch** | 3-5 minutes | 1-2 minutes |
| **Feature branch** | 3-5 minutes | 1-2 minutes |
| **No cache** | 5-7 minutes | 5-7 minutes |

Cache includes:
- Processed images (WebP conversions, resizing)
- CSS/JS bundles
- Template execution cache

---

## Troubleshooting

### Build Fails on Feature Branch

**What happens**:
- Error page deployed to `/preview/branch-name/error.html`
- Preview index shows red "error" status
- Full logs linked from error page

**How to fix**:
1. Click **View Full Logs** on error page
2. Find Hugo error message in workflow logs
3. Fix the issue locally
4. Push again to re-trigger build

### Build Fails on Main Branch

**What happens**:
- Workflow fails, no deployment
- Previous site version remains live
- GitHub Actions shows red X

**How to fix**:
1. Check **Actions** tab for error details
2. Fix issue locally
3. Push fix to `main`

### Preview Not Updating

**Check**:
1. **Actions** tab shows workflow running/completed
2. Correct branch name in URL (case-sensitive, sanitized)
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. GitHub Pages can take 1-2 minutes to serve new files

### Preview Index Not Showing New Preview

**Cause**: Index generation runs after deployment

**Solution**: Wait 30-60 seconds, then refresh preview index page

### Cache Issues (Slow Builds)

**Reset cache**:
1. Go to **Settings** → **Actions** → **Caches**
2. Delete old caches
3. Next build will recreate cache

---

## URLs Quick Reference

| Content | URL Pattern |
|---------|-------------|
| **Main site** | `https://username.github.io/repo-name/` |
| **Preview index** | `https://username.github.io/repo-name/preview/` |
| **Feature preview** | `https://username.github.io/repo-name/preview/branch-name/` |
| **Error page** | `https://username.github.io/repo-name/preview/branch-name/error.html` |
| **Preview metadata** | `https://username.github.io/repo-name/preview/branch-name/.preview-meta.json` |
| **Preview list JSON** | `https://username.github.io/repo-name/preview/.preview-list.json` |

---

## Advanced Configuration

### Change Hugo Version

Edit `env.HUGO_VERSION` in all three workflows:

```yaml
env:
  HUGO_VERSION: "0.160.0"  # Update to desired version
```

### Change Node Version

Edit `env.NODE_VERSION` in deploy workflows:

```yaml
env:
  NODE_VERSION: "20"  # Update to desired version
```

### Customize Preview Build Options

In `deploy-preview.yml`, modify Hugo command:

```yaml
- name: Build Hugo Site
  run: |
    hugo \
      --minify \
      --baseURL "${{ env.BASE_URL }}/preview/${{ steps.sanitize.outputs.branch }}/" \
      --environment preview \
      --buildDrafts \      # Remove to exclude drafts
      --buildFuture \      # Remove to exclude future-dated posts
      --buildExpired       # Add to include expired content
```

### Disable Concurrent Cancellation

In `deploy-preview.yml`:

```yaml
concurrency:
  group: deploy-preview-${{ github.ref_name }}
  cancel-in-progress: false  # Change to false
```

---

## Monitoring

### Check Deployment Status

**GitHub Actions tab**:
- Shows all workflow runs
- Filter by branch or workflow name
- View logs for debugging

**Workflow badges** (optional):

Add to README.md:

```markdown
![Deploy Main](https://github.com/username/repo-name/actions/workflows/deploy-main.yml/badge.svg)
![Deploy Preview](https://github.com/username/repo-name/actions/workflows/deploy-preview.yml/badge.svg)
```

### Preview Index API

Programmatically access preview list:

```bash
curl https://username.github.io/repo-name/preview/.preview-list.json
```

Returns JSON with all active previews:

```json
{
  "generated_at": "2025-10-29T14:30:00Z",
  "total_previews": 2,
  "previews": [
    {
      "branch": "feature-new-design",
      "url": "/preview/feature-new-design/",
      "commit": "abc123...",
      "commit_message": "Try new homepage design",
      "timestamp": "2025-10-29T14:25:00Z",
      "build_status": "success",
      "author": "johndoe"
    }
  ]
}
```

---

## Best Practices

### 1. Branch Naming

Use descriptive, URL-friendly names:

✅ **Good**: `feature-homepage-redesign`, `fix-navigation-bug`, `experiment-new-theme`

❌ **Avoid**: `feature/work/homepage/v2` (too many slashes), `FIX_BUG` (uppercase)

**Why**: Branch names become URLs. Slashes are converted to hyphens, uppercase to lowercase.

### 2. Commit Messages

Write clear messages:

✅ **Good**: "Update homepage hero section with new CTA"

❌ **Avoid**: "wip", "fix", "updates"

**Why**: Commit messages appear in preview index and metadata.

### 3. Clean Up Branches

Delete merged branches:

```bash
git branch -d feature-name      # Delete locally
git push origin --delete feature-name  # Delete remotely
```

**Why**: Reduces clutter in preview index, saves GitHub Pages space.

### 4. Test Before Merging

Always check preview before merging to main:

1. Push feature branch
2. Wait for deployment (1-2 minutes)
3. Visit preview URL
4. Test on mobile/desktop
5. Merge to main if OK

---

## Next Steps

- ✅ Setup complete! Push to `main` to deploy
- 📖 Read [data-model.md](./data-model.md) for metadata structures
- 🔧 Review [research.md](./research.md) for technical decisions
- 📋 See [spec.md](./spec.md) for full feature specification

---

## Support

**Issues**: File in GitHub repository  
**Workflow logs**: Check **Actions** tab  
**Hugo docs**: https://gohugo.io/documentation/  
**GitHub Pages docs**: https://docs.github.com/pages
