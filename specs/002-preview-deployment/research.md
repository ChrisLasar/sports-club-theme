# Research: Live Preview Deployment System

**Feature**: 002-preview-deployment  
**Date**: 2025-10-29  
**Purpose**: Technical research and design decisions for GitHub Pages-based preview deployment system

---

## 1. GitHub Actions Workflow Design

### Decision: Separate Workflows for Main and Feature Branches

**Rationale**:
- Main branch deployments have different requirements (preserve on failure, deploy to root)
- Feature branches need different handling (show error pages, deploy to subdirectories)
- Separate workflows provide clearer separation of concerns and easier maintenance

**Implementation Approach**:
- Create `.github/workflows/deploy-main.yml` for main branch deployments
- Create `.github/workflows/deploy-preview.yml` for feature branch deployments
- Use workflow concurrency groups to manage cancellation behavior

**Alternatives Considered**:
- Single workflow with conditional steps: Rejected due to increased complexity and harder-to-maintain conditionals
- Manual deployment scripts: Rejected as it doesn't meet automation requirements

**Reference**: Hugo official GitHub Pages deployment documentation

---

## 2. GitHub Pages URL Structure

### Decision: Path-Based Routing with Single gh-pages Branch

**Rationale**:
- GitHub Pages supports one deployment per repository by default
- Path-based routing (`/preview/{branch-name}/`) works within this limitation
- Simpler than managing multiple deployment branches or repositories
- Predictable URL patterns for users

**Implementation**:
- Main branch deploys to root: `https://username.github.io/repo-name/`
- Feature branches deploy to: `https://username.github.io/repo-name/preview/{branch-name}/`
- Single `gh-pages` branch contains all deployments in organized directory structure

**Alternatives Considered**:
- Subdomain per branch: Requires custom domain and complex DNS configuration
- Separate GitHub Pages sites: Not feasible within single repository limits
- GitHub Actions artifacts: Limited to 90 days retention and requires authentication

**Reference**: GitHub Pages documentation, clarification session Q1

---

## 3. Hugo Build Caching Strategy

### Decision: Use GitHub Actions Cache for Hugo Cache Directory

**Rationale**:
- Hugo's built-in caching significantly speeds up incremental builds
- GitHub Actions cache/restore action provides persistent cache across runs
- Reduces build times from minutes to seconds for content-only changes

**Implementation**:
- Cache Hugo's resource cache directory (`${{ runner.temp }}/hugo_cache`)
- Use cache keys based on run ID with fallback to branch-based keys
- Restore cache before build, save after successful build
- Cache includes processed images, JS bundles, and other resource transformations

**Configuration**:
```yaml
- uses: actions/cache/restore@v4
  with:
    path: ${{ runner.temp }}/hugo_cache
    key: hugo-${{ github.ref_name }}-${{ github.run_id }}
    restore-keys: |
      hugo-${{ github.ref_name }}-
      hugo-
```

**Alternatives Considered**:
- No caching: Rejected due to slow rebuild times (3-5 minutes for every change)
- Cache entire public directory: Rejected as Hugo needs to rebuild for baseURL changes
- Third-party caching solutions: Rejected as GitHub Actions native caching is sufficient

**Reference**: Hugo documentation on caching, GitHub Actions official example

---

## 4. Dependency Caching (Node.js, Hugo, Dart Sass)

### Decision: Cache npm Dependencies, Download Tools Per Build

**Rationale**:
- npm dependencies change less frequently than content
- Caching node_modules saves significant time (30-60 seconds per build)
- Hugo and Dart Sass binaries are small (~30MB combined) and download quickly
- Version pinning in environment variables ensures consistency

**Implementation**:
- Use `actions/setup-node@v4` with built-in npm cache
- Download Hugo Extended and Dart Sass in each workflow run
- Pin versions via environment variables at top of workflow

**npm Cache Configuration**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
```

**Alternatives Considered**:
- Cache Hugo/Dart Sass binaries: Minimal time saved, adds cache complexity
- Use Docker images with pre-installed tools: Slower pull times, less control over versions
- Install tools via package managers (apt/snap): Version availability and consistency issues

**Reference**: Hugo deployment examples, GitHub Actions setup-node documentation

---

## 5. Concurrency Control and Cancellation

### Decision: Cancel In-Progress Deployments for Same Branch

**Rationale**:
- Fast iteration: developers pushing multiple commits shouldn't wait for old builds
- Resource efficiency: avoid running builds that will be superseded
- Latest commit always takes priority

**Implementation**:
```yaml
concurrency:
  group: preview-${{ github.ref }}
  cancel-in-progress: true
```

**Behavior**:
- Each branch has its own concurrency group
- New push cancels any running deployment for that branch
- Different branches can deploy concurrently

**Alternatives Considered**:
- Queue all deployments sequentially: Too slow, doesn't meet 5-minute requirement
- No cancellation: Wastes resources and delays latest changes
- Cancel all deployments: Would cancel unrelated branches, too aggressive

**Reference**: GitHub Actions concurrency documentation, clarification session Q5

---

## 6. Build Failure Handling

### Decision: Differentiated Error Handling by Branch Type

**Rationale**:
- Main branch must remain stable (production-like)
- Feature branches benefit from visible error feedback
- Preserving working main preview prevents broken production state

**Implementation for Main Branch**:
- If build fails, skip deployment step
- Preserve last successful deployment in gh-pages branch
- Show error in GitHub Actions log and commit status
- Do not update gh-pages root directory

**Implementation for Feature Branches**:
- If build fails, generate error page with build logs
- Deploy error page to `/preview/{branch-name}/`
- Error page includes:
  - Branch name and commit SHA
  - Build error message
  - Link to full build logs
  - Timestamp of failure

**Error Page Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Build Failed: {branch-name}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>Build Failed</h1>
  <p>Branch: {branch-name}</p>
  <p>Commit: {commit-sha}</p>
  <pre>{error-message}</pre>
  <a href="{github-actions-url}">View full build log</a>
</body>
</html>
```

**Alternatives Considered**:
- Same handling for all branches: Less flexible, doesn't match stakeholder needs
- Remove failed previews: Loss of previous working version
- Always preserve last build: Hides errors, makes debugging harder

**Reference**: Clarification session Q4

---

## 7. Preview Index Generation

### Decision: Auto-Generated HTML Index at /preview/index.html

**Rationale**:
- Provides easy discovery of all active previews
- Can be styled to match the Hugo theme
- Shows metadata (branch name, commit, timestamp)
- Accessible via standard browser without tools

**Implementation**:
- Generate index.html during each deployment
- Read gh-pages branch structure to discover active previews
- Include for each preview:
  - Branch name (link to preview)
  - Last commit SHA and message
  - Deployment timestamp
  - Build status (success/error)
- Style with minimal Tailwind CSS for consistency

**Index Generation Script** (Python):
```python
import os
import json
from datetime import datetime

def generate_preview_index(preview_dir):
    previews = []
    for branch_name in os.listdir(preview_dir):
        meta_file = os.path.join(preview_dir, branch_name, '.preview-meta.json')
        if os.path.exists(meta_file):
            with open(meta_file) as f:
                previews.append(json.load(f))
    
    # Sort by timestamp, newest first
    previews.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Generate HTML
    html = generate_html_template(previews)
    
    with open(os.path.join(preview_dir, 'index.html'), 'w') as f:
        f.write(html)
```

**Metadata File Format** (`.preview-meta.json`):
```json
{
  "branch": "feature-name",
  "commit": "abc123...",
  "commit_message": "Add new feature",
  "timestamp": "2025-10-29T10:30:00Z",
  "build_status": "success",
  "author": "username"
}
```

**Alternatives Considered**:
- JSON only: Not user-friendly for non-technical stakeholders
- Markdown in repository: Requires separate update, can go stale
- README.md badges: Limited formatting, hard to maintain

**Reference**: Clarification session Q3

---

## 8. Branch Cleanup on Deletion

### Decision: GitHub Actions Workflow Triggered by Branch Deletion

**Rationale**:
- Automatic cleanup when branches are deleted
- Keeps gh-pages branch size manageable
- Matches user expectation (deleted branch = removed preview)

**Implementation**:
```yaml
name: Cleanup Preview
on:
  delete:
    branches:
      - '**'
jobs:
  cleanup:
    if: github.event.ref_type == 'branch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: gh-pages
      - name: Remove preview directory
        run: |
          rm -rf "preview/${{ github.event.ref }}"
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add preview/
          git commit -m "Remove preview for deleted branch: ${{ github.event.ref }}"
          git push
```

**Edge Case**: If workflow doesn't run (network issues, etc.), previews may linger but this is acceptable as they don't break anything

**Alternatives Considered**:
- Manual cleanup: Doesn't meet automation requirement
- Time-based cleanup (30 days): More complex, clarification specified immediate removal
- Leave all previews: gh-pages branch grows indefinitely

**Reference**: Specification FR-010, clarification session

---

## 9. Hugo BaseURL Configuration

### Decision: Dynamic BaseURL via GitHub Actions Context

**Rationale**:
- Each preview needs correct baseURL for assets and links
- GitHub provides repository and branch information via context
- Allows proper functioning of absolute URLs

**Implementation**:
```yaml
- name: Build Hugo site
  env:
    HUGO_BASEURL: ${{ github.ref == 'refs/heads/main' && format('https://{0}.github.io/{1}/', github.repository_owner, github.event.repository.name) || format('https://{0}.github.io/{1}/preview/{2}/', github.repository_owner, github.event.repository.name, github.ref_name) }}
  run: |
    hugo --gc --minify \
      --baseURL "$HUGO_BASEURL" \
      --cacheDir "${{ runner.temp }}/hugo_cache"
```

**URL Patterns**:
- Main: `https://username.github.io/repo-name/`
- Feature: `https://username.github.io/repo-name/preview/branch-name/`

**Alternatives Considered**:
- Relative URLs only: Breaks social sharing, RSS feeds, and some Hugo features
- Hardcoded baseURL: Not flexible, requires manual updates
- Environment-specific config files: More complex, harder to maintain

**Reference**: Hugo baseURL documentation, GitHub Actions context variables

---

## 10. Git Workflow Integration

### Decision: Non-Conflicting Deployment Updates to gh-pages

**Rationale**:
- Multiple deployments may run concurrently for different branches
- Need to avoid git conflicts when updating gh-pages
- Each deployment updates only its own directory

**Implementation Strategy**:
1. Shallow clone gh-pages branch
2. Create/update only the specific directory (root for main, `/preview/{branch}/` for features)
3. Regenerate preview index
4. Commit and force-push changes

**Force Push Safety**:
- Each deployment job only modifies its assigned directory
- Preview index regeneration is idempotent
- Acceptable to lose intermediate states (latest commit wins)

```yaml
- name: Deploy to gh-pages
  run: |
    git clone --depth 1 --branch gh-pages https://github.com/${{ github.repository }} gh-pages-repo
    cd gh-pages-repo
    
    # Update specific directory
    if [ "${{ github.ref }}" = "refs/heads/main" ]; then
      rm -rf *
      cp -r ../public/* .
    else
      mkdir -p preview/${{ github.ref_name }}
      rm -rf preview/${{ github.ref_name }}/*
      cp -r ../public/* preview/${{ github.ref_name }}/
    fi
    
    # Commit and push
    git add .
    git commit -m "Deploy ${{ github.ref_name }}: ${{ github.sha }}"
    git push --force
```

**Alternatives Considered**:
- Merge strategy: More complex, can have conflicts
- Single sequential queue: Too slow for concurrent branches
- Separate deployment branches: Doesn't work with GitHub Pages limitations

**Reference**: GitHub Pages deployment best practices

---

## Summary of Key Decisions

1. **Workflow Architecture**: Separate workflows for main and feature branches with concurrency control
2. **URL Structure**: Path-based routing with single gh-pages branch
3. **Caching**: Hugo cache and npm dependencies cached for performance
4. **Error Handling**: Preserve main, show errors for features
5. **Preview Discovery**: Auto-generated HTML index with metadata
6. **Cleanup**: Automatic removal on branch deletion
7. **Build Configuration**: Dynamic baseURL based on branch
8. **Performance**: Target 5-minute builds with caching optimization

All decisions align with GitHub Pages constraints, Hugo best practices, and the project's constitution requirements for static, performant, accessible sites.
