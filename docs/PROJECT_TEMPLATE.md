# Project Documentation Template

Copy this structure to any project. Delete files you don't need.

## File Structure

```
project.com/
├── CLAUDE.md              ← Claude reads this automatically
├── .claude/               ← Claude's auto-memory (don't touch)
├── docs/                  ← ALL human documentation
│   ├── OVERVIEW.md        ← What, who, why, current status
│   ├── ARCHITECTURE.md    ← Tech stack, DB, servers, APIs
│   ├── DEPLOYMENT.md      ← How to deploy, paths, cron, systemd
│   ├── PLAN.md            ← Current work, next steps, blockers
│   └── SEO.md             ← Keywords, sitemap (if applicable)
├── steps/                 ← ARCHIVE old docs here, don't add new ones
├── backend/
├── frontend/
└── ...
```

## Rules

1. **CLAUDE.md** = SHORT (under 100 lines). Overview + key rules only. Points to docs/ for details.
2. **docs/OVERVIEW.md** = "Explain this project in 5 minutes" — what it is, tech, status, links.
3. **docs/PLAN.md** = What you're doing NOW. Update this every session. Checklist format.
4. **docs/ARCHITECTURE.md** = Deep reference. Database tables, API endpoints, server config.
5. **docs/DEPLOYMENT.md** = How to get it running. Server paths, systemd, cron, deploy steps.
6. **docs/SEO.md** = Only if the project has a public website. Keywords, analytics, sitemap.
7. **steps/** = Legacy. Don't add new files here. Move relevant content to docs/ over time.

## CLAUDE.md Template

```markdown
# Project Name

One-line description of what this project does.

## Tech Stack
- Frontend: [framework] (port XXXX)
- Backend: [framework] (port XXXX)
- Database: [type] (database name)
- Server: [OS], [web server]

## Key Rules
- [Any critical rules for this project]
- [SSH/deploy gotchas]
- [Design constraints]

## Documentation
All docs in `docs/` folder:
- `docs/OVERVIEW.md` — project overview and status
- `docs/ARCHITECTURE.md` — tech stack, APIs, database
- `docs/DEPLOYMENT.md` — deploy process, server paths
- `docs/PLAN.md` — current priorities
```

## docs/OVERVIEW.md Template

```markdown
# [Project Name]

**Domain:** example.com
**Owner:** Alex Kargin
**Status:** [Live / Development / Archived]
**Last Updated:** YYYY-MM-DD

## What This Is
[2-3 sentences explaining the project]

## Tech Stack
| Component | Technology | Port |
|-----------|-----------|------|
| Frontend  | ...       | ...  |
| Backend   | ...       | ...  |
| Database  | ...       | ...  |

## Current Status
[What's working, what's not, what's next]

## Key Links
- Production URL: https://...
- Server path: /usr/local/www/...
```

## docs/PLAN.md Template

```markdown
# Current Plan

**Last Updated:** YYYY-MM-DD

## Status: [One-line summary]

### Completed
- [x] Thing that's done
- [x] Another done thing

### In Progress
- [ ] Current work item
- [ ] Another current item

### Next Steps
- [ ] Future work
- [ ] More future work

### Blocked
- [ ] Blocked item — reason why
```

## docs/ARCHITECTURE.md Template

```markdown
# Architecture

**Last Updated:** YYYY-MM-DD

## Server Layout
[Where things run, what ports, what connects to what]

## Database Tables
[Key tables with column descriptions]

## API Endpoints
[List of endpoints with brief descriptions]

## External Integrations
[Third-party services, APIs, other projects this connects to]

## Key Directories
[File tree showing where important code lives]
```

## docs/DEPLOYMENT.md Template

```markdown
# Deployment

**Last Updated:** YYYY-MM-DD
**Server:** [hostname]
**SSH:** `ssh [hostname]`

## Server Paths
[Where files live on the server]

## Services
[systemd service names, how to restart]

## Deploy Process
[Step-by-step deploy commands]

## Cron Jobs
[List of cron entries]

## Database Migrations
[How to run migrations]
```

## Migration Guide (from steps/ to docs/)

For each existing project:

1. Create `docs/` folder
2. Create `CLAUDE.md` at project root (if missing)
3. Read through `steps/` files
4. Move relevant content into the correct docs/ file:
   - PRD, Product_Vision, MVP → docs/OVERVIEW.md
   - Architecture, schema, API docs → docs/ARCHITECTURE.md
   - Deploy guides, server setup → docs/DEPLOYMENT.md
   - Current plan, ideas, next steps → docs/PLAN.md
   - SEO setup → docs/SEO.md
5. Keep `steps/` as archive — don't delete, just stop adding to it
