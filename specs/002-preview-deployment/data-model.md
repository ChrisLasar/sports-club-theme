# Data Model: Live Preview Deployment System

**Feature**: 002-preview-deployment  
**Date**: 2025-10-29  
**Purpose**: Define data structures and entities for the preview deployment system

---

## Overview

This feature is primarily infrastructure (CI/CD workflows) and doesn't introduce traditional data models in the application sense. However, it does define metadata structures for tracking deployments and preview states.

---

## 1. Preview Metadata

**Purpose**: Track information about each deployed preview for display in the preview index

**Storage**: JSON file (`.preview-meta.json`) in each preview directory on gh-pages branch

**Structure**:

```json
{
  "branch": "string",
  "commit": "string (SHA)",
  "commit_message": "string",  
  "commit_author": "string",
  "timestamp": "string (ISO 8601)",
  "build_status": "success | error",
  "build_duration_seconds": "number",
  "hugo_version": "string",
  "error_message": "string | null"
}
```

**Field Descriptions**:

- `branch`: Name of the Git branch this preview represents
- `commit`: Full SHA hash of the deployed commit
- `commit_message`: First line of the commit message
- `commit_author`: GitHub username or email of commit author
- `timestamp`: ISO 8601 timestamp when deployment completed
- `build_status`: Whether build succeeded or failed
- `build_duration_seconds`: Time taken to build the Hugo site
- `hugo_version`: Version of Hugo used for the build
- `error_message`: Build error details if status is "error", null otherwise

**Lifecycle**:

1. Created/updated during each deployment
2. Read by preview index generation script
3. Deleted when branch preview is removed

**Example**:

```json
{
  "branch": "feature/new-homepage",
  "commit": "abc123def456789...",
  "commit_message": "Update homepage hero section",
  "commit_author": "johndoe",
  "timestamp": "2025-10-29T14:30:00Z",
  "build_status": "success",
  "build_duration_seconds": 45,
  "hugo_version": "0.152.0",
  "error_message": null
}
```

---

## 2. Workflow State (GitHub Actions)

**Purpose**: Track workflow execution state and artifacts

**Storage**: GitHub Actions runtime (not persisted in repository)

**Implicit Structure** (via GitHub Actions context):

```yaml
workflow_run:
  id: number
  name: string
  head_branch: string
  head_sha: string
  event: string
  status: "queued" | "in_progress" | "completed"
  conclusion: "success" | "failure" | "cancelled" | "skipped"
  created_at: timestamp
  updated_at: timestamp
  run_number: number
  run_attempt: number
```

**Key Fields Used**:

- `head_branch`: Determines deployment directory (root vs `/preview/{branch}/`)
- `head_sha`: Used in commit status updates and metadata
- `status` / `conclusion`: Determines whether to deploy or show error page
- `run_number`: Used in cache keys

**Access**: Via `${{ github }}` context in workflow files

---

## 3. Deployment Directory Structure

**Purpose**: Organize deployed sites on gh-pages branch

**Storage**: Git repository (gh-pages branch)

**Structure**:

```text
gh-pages/
├── index.html                    # Main branch site (root)
├── about/
├── posts/
├── [other main branch content]
├── preview/
│   ├── index.html               # Preview index page
│   ├── .preview-list.json       # Machine-readable preview list
│   ├── feature-new-homepage/
│   │   ├── .preview-meta.json
│   │   ├── index.html
│   │   └── [site content]
│   ├── fix-navigation/
│   │   ├── .preview-meta.json
│   │   ├── index.html
│   │   └── [site content]
│   └── experiment-redesign/
│       ├── .preview-meta.json
│       ├── error.html           # If build failed
│       └── [no other content]
└── .nojekyll                    # Disable Jekyll processing
```

**Rules**:

- Main branch content at root (no `preview/` directory)
- Each feature branch in `/preview/{branch-name}/`
- Branch names sanitized: slashes converted to hyphens (e.g., `feature/auth` → `feature-auth`)
- Hidden files (`.preview-meta.json`) excluded from Hugo builds but kept for metadata

---

## 4. Preview Index Data

**Purpose**: Aggregated view of all active previews

**Storage**: JSON file (`/preview/.preview-list.json`) for API access

**Structure**:

```json
{
  "generated_at": "2025-10-29T14:35:00Z",
  "total_previews": 3,
  "previews": [
    {
      "branch": "feature-new-homepage",
      "url": "/preview/feature-new-homepage/",
      "commit": "abc123...",
      "commit_message": "Update homepage hero section",
      "timestamp": "2025-10-29T14:30:00Z",
      "build_status": "success",
      "author": "johndoe"
    },
    {
      "branch": "fix-navigation",
      "url": "/preview/fix-navigation/",
      "commit": "def456...",
      "commit_message": "Fix mobile navigation bug",
      "timestamp": "2025-10-29T12:15:00Z",
      "build_status": "success",
      "author": "janedoe"
    },
    {
      "branch": "experiment-redesign",
      "url": "/preview/experiment-redesign/",
      "commit": "ghi789...",
      "commit_message": "Try new design approach",
      "timestamp": "2025-10-29T10:00:00Z",
      "build_status": "error",
      "author": "designlead",
      "error_message": "POSTCSS: failed to transform \"css/main.css\""
    }
  ]
}
```

**Field Descriptions**:

- `generated_at`: When this index was last regenerated
- `total_previews`: Count of active previews
- `previews`: Array of preview objects sorted by timestamp (newest first)

**Lifecycle**:

1. Generated after each deployment
2. Reads all `.preview-meta.json` files in `/preview/` subdirectories
3. Sorts by timestamp descending
4. Writes to `.preview-list.json` and generates `index.html`

---

## 5. Error Page Data

**Purpose**: Display build failure information for failed feature branch deployments

**Storage**: Static HTML file (`/preview/{branch-name}/error.html`)

**Embedded Data** (in HTML):

```html
<div id="error-data" data-branch="..." data-commit="..." data-timestamp="...">
  <h1>Build Failed</h1>
  <dl>
    <dt>Branch:</dt>
    <dd>feature-name</dd>
    
    <dt>Commit:</dt>
    <dd>abc123... <a href="https://github.com/user/repo/commit/abc123">View</a></dd>
    
    <dt>Time:</dt>
    <dd>2025-10-29 14:30 UTC</dd>
    
    <dt>Error:</dt>
    <dd><pre>Error details from Hugo build...</pre></dd>
    
    <dt>Full Log:</dt>
    <dd><a href="https://github.com/user/repo/actions/runs/123">View on GitHub</a></dd>
  </dl>
</div>
```

**Generation**: Created by workflow script when Hugo build fails

---

## 6. GitHub Actions Cache Data

**Purpose**: Store Hugo build artifacts for faster rebuilds

**Storage**: GitHub Actions cache service (separate from repository)

**Cache Keys**:

```yaml
Primary: hugo-{ref_name}-{run_id}
Fallback: hugo-{ref_name}-
         hugo-
```

**Cached Paths**:

- `${{ runner.temp }}/hugo_cache/` - Hugo resource cache
- Includes:
  - Processed images (WebP conversions, resizing)
  - JS/CSS bundles
  - Template execution cache

**Lifecycle**:

- Created/updated on successful builds
- Restored before build begins
- Automatically evicted after 7 days of no access (GitHub Actions policy)
- Size limit: 10 GB per repository (GitHub Actions policy)

---

## Entity Relationships

```
GitHub Branch (1) -----> (0..1) Preview Metadata
                   |
                   |-----> (0..1) Deployed Site Directory
                   |
                   |-----> (0..*) Workflow Runs

Preview Index (1) -----> (0..*) Preview Metadata
                   |
                   |-----> (1) Preview List JSON

Workflow Run (1) -----> (0..1) Build Cache
              |
              |-----> (1) Deployment Artifact
```

---

## Data Flow

1. **Developer pushes commit** →
2. **GitHub Actions triggered** →
3. **Restore build cache** →
4. **Hugo builds site** →
5. **Generate preview metadata** →
6. **Deploy to gh-pages** →
7. **Regenerate preview index** →
8. **Save build cache** →
9. **User accesses preview URL**

---

## Validation Rules

1. **Branch Names**:
   - Must be valid Git branch names
   - Sanitized for URL safety (alphanumeric, hyphens only)
   - Max length: 100 characters

2. **Commit SHAs**:
   - Must be valid 40-character hex strings
   - Validated by Git

3. **Timestamps**:
   - ISO 8601 format required
   - UTC timezone

4. **Build Status**:
   - Enum: only "success" or "error"
   - If "error", error_message must be non-null

5. **Preview URLs**:
   - Must follow pattern: `/preview/{sanitized-branch-name}/`
   - No spaces, special characters

---

## Summary

While this is primarily an infrastructure feature, it defines:

- **Preview Metadata**: JSON structure for tracking deployment info
- **Directory Structure**: Organized layout on gh-pages branch
- **Preview Index**: Aggregated list of all active previews
- **Error Pages**: Structured failure information display
- **Cache Data**: Hugo build artifact storage

All structures are designed for static storage (JSON files, HTML) without requiring databases or backends, maintaining alignment with the project's static-first philosophy.
