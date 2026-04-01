# dbt Analytics Engineering Certification — 1-Week Study Plan

**Last Updated:** 2026-03-31
**Exam:** dbt Analytics Engineering Certification
**Cost:** ~$200 (was free, check current price at https://www.getdbt.com/certifications/analytics-engineer)
**Format:** 65 questions, 90 minutes, ~63% to pass (multiple choice + multiple select)
**Register:** https://learn.getdbt.com

---

## Exam Domains (what they test)

| Domain | Weight | Your SQL knowledge helps? |
|--------|--------|--------------------------|
| dbt Models (ref, SQL models, Python models) | ~18% | Yes |
| Jinja & Macros | ~15% | New — must study |
| dbt Tests (schema, data, custom) | ~12% | Partially |
| Project Structure & Best Practices | ~12% | New — must study |
| Materializations (table, view, incremental, ephemeral) | ~10% | Partially |
| Sources & Documentation | ~10% | New — must study |
| Snapshots (SCD Type 2) | ~8% | New — must study |
| Seeds | ~5% | Easy |
| dbt Packages | ~5% | Easy |
| Deployment & Jobs | ~5% | Easy |

---

## 7-Day Plan

### Day 1 (Tuesday Apr 1): Setup + dbt Fundamentals Part 1
**Time: 3-4 hours**

1. Install dbt-core + dbt-postgres locally:
   ```bash
   pip install dbt-core dbt-postgres
   ```
2. Create a practice project connected to your existing PostgreSQL:
   ```bash
   dbt init dbt_practice
   ```
3. Configure `profiles.yml` to use your local PostgreSQL (database: legacytocloud)
4. Start **dbt Fundamentals** course on https://learn.getdbt.com (~5 hours total)
   - Complete sections: "What is dbt?", "Setting Up", "Models"
5. Create 2-3 models in your practice project using your `pipeline.articles` and `pipeline.raw_stock_prices` tables

**Key concepts to nail:**
- `dbt run`, `dbt build`, `dbt test`
- `ref()` function — how models reference each other
- `{{ config() }}` block
- Model file naming and directory structure

---

### Day 2 (Wednesday Apr 2): dbt Fundamentals Part 2 + Sources
**Time: 3-4 hours**

1. Finish **dbt Fundamentals** course (tests, documentation, deployment sections)
2. Read docs on Sources: https://docs.getdbt.com/docs/build/sources
3. Practice:
   - Create a `sources.yml` defining your PostgreSQL tables as dbt sources
   - Create models that use `{{ source('pipeline', 'articles') }}`
   - Add `freshness` checks to sources
   - Write `description` fields for tables and columns
4. Read docs on Documentation: https://docs.getdbt.com/docs/build/documentation
   - `dbt docs generate` and `dbt docs serve`
   - Doc blocks with `{% docs %}` tag

**Key concepts to nail:**
- sources.yml structure
- `{{ source() }}` vs `{{ ref() }}`
- source freshness (`loaded_at_field`, `warn_after`, `error_after`)
- documentation blocks and description fields

---

### Day 3 (Thursday Apr 3): Jinja & Macros (HARDEST PART)
**Time: 4 hours**

1. Complete **"Jinja, Macros, and Packages"** course on dbt Learn
2. Read: https://docs.getdbt.com/docs/build/jinja-macros
3. Practice writing:
   - `{% set %}` variables
   - `{% for %}` loops (e.g., generate UNION ALL across sources)
   - `{% if %}` conditionals (e.g., different logic for dev vs prod)
   - `{% macro %}` definitions and calling them
   - `{{ var() }}` project variables
4. Study the built-in Jinja context:
   - `target` (name, schema, type)
   - `this` (current model reference)
   - `run_started_at`
   - `env_var()`

**Practice exercise:** Write a macro that generates a `CASE WHEN` statement from a list, then use it in a model.

**Key concepts to nail:**
- Jinja whitespace control (`{%- -%}`)
- Macro arguments with defaults
- `{{ return() }}` in macros
- Calling macros from other macros
- `dbt_utils` package macros (surrogate_key, union_relations, etc.)

---

### Day 4 (Friday Apr 4): Materializations + Tests
**Time: 3-4 hours**

1. Read: https://docs.getdbt.com/docs/build/materializations
2. Understand ALL 4 materializations deeply:
   - **table** — drops and recreates every run
   - **view** — creates SQL view, always fresh
   - **incremental** — appends/merges new rows only (THE EXAM FAVORITE)
   - **ephemeral** — not created in DB, inlined as CTE
3. Practice writing an incremental model:
   ```sql
   {{ config(materialized='incremental', unique_key='id') }}
   SELECT * FROM {{ source('pipeline', 'articles') }}
   {% if is_incremental() %}
   WHERE created_at > (SELECT max(created_at) FROM {{ this }})
   {% endif %}
   ```
4. Study `is_incremental()` — when it returns true vs false
5. Study `--full-refresh` flag
6. Complete **"Advanced Testing"** course on dbt Learn
7. Practice:
   - Schema tests in YAML: `unique`, `not_null`, `accepted_values`, `relationships`
   - Custom data tests (SQL files in `tests/`)
   - Test severity: `warn` vs `error`

**Key concepts to nail:**
- When to use each materialization
- Incremental strategies: `append`, `merge`, `delete+insert`
- `unique_key` in incremental models
- `on_schema_change` config

---

### Day 5 (Saturday Apr 5): Snapshots, Seeds, Packages, Project Structure
**Time: 3-4 hours**

1. Read: https://docs.getdbt.com/docs/build/snapshots
   - Snapshot strategies: `timestamp` and `check`
   - SCD Type 2 — `dbt_valid_from`, `dbt_valid_to`, `dbt_updated_at`
   - Practice writing a snapshot on your articles table
2. Read: https://docs.getdbt.com/docs/build/seeds
   - CSV files in `seeds/` directory
   - `dbt seed` command
   - When to use seeds vs sources
3. Read: https://docs.getdbt.com/docs/build/packages
   - `packages.yml` file
   - `dbt deps` to install
   - Know the most popular packages: `dbt_utils`, `dbt_expectations`, `codegen`
4. Study **project structure best practices**: https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview
   - **staging/** — 1:1 with sources, rename/cast/clean
   - **intermediate/** — business logic transformations
   - **marts/** — final tables for analytics/reporting
   - Naming conventions: `stg_`, `int_`, `fct_`, `dim_`

**Key concepts to nail:**
- Difference between timestamp and check snapshot strategies
- What the snapshot meta-columns contain
- Seeds are for small, static reference data (not large datasets)
- The staging → intermediate → marts pattern

---

### Day 6 (Sunday Apr 6): Deployment + Full Review
**Time: 4-5 hours**

1. Read deployment docs:
   - `dbt run`, `dbt test`, `dbt build`, `dbt source freshness`
   - Job scheduling (dbt Cloud or cron for dbt Core)
   - Environments (dev vs prod schemas)
   - `target.name` and `target.schema` in Jinja
2. Study **hooks and operations**:
   - `pre-hook` and `post-hook` in model config
   - `on-run-start` and `on-run-end` in `dbt_project.yml`
3. Study **exposures** (downstream consumers of your models)
4. **Full review** — go through every topic in the exam guide:
   - Can you explain each concept in one sentence?
   - Can you write the YAML/SQL for each feature from memory?
5. Re-do all quiz questions from dbt Learn courses

**Make flashcards for:**
- All `dbt` CLI commands and what they do
- All config options for each materialization
- All test types and their YAML syntax
- Jinja built-in variables and functions

---

### Day 7 (Monday Apr 7): Practice + Take Exam
**Time: 2-3 hours study, then exam**

1. Morning: review flashcards and weak areas
2. Search for community practice questions:
   - GitHub: search "dbt certification practice"
   - Reddit: r/dataengineering has threads with tips
   - dbt Discourse: https://discourse.getdbt.com (search "certification")
3. Take the exam in the afternoon when fresh
4. You have 90 minutes for 65 questions = ~83 seconds per question
5. **Strategy:** answer easy ones fast, flag hard ones, come back

---

## Quick Reference Card (print this)

```
MATERIALIZATIONS:
  table       → DROP + CREATE TABLE AS (full refresh)
  view        → CREATE VIEW AS (always latest)
  incremental → INSERT/MERGE new rows (uses is_incremental())
  ephemeral   → CTE, never created in database

KEY FUNCTIONS:
  {{ ref('model_name') }}           → reference another model
  {{ source('source', 'table') }}   → reference a source table
  {{ config(materialized='...') }}  → set model config
  {{ this }}                        → current model relation
  {{ var('var_name') }}             → project variable
  {{ env_var('ENV_VAR') }}          → environment variable
  {{ target.name }}                 → current target (dev/prod)
  {{ is_incremental() }}            → true if incremental + not full refresh

TESTS (in schema.yml):
  - unique
  - not_null
  - accepted_values: { values: ['a', 'b'] }
  - relationships: { to: ref('other'), field: 'id' }

CLI COMMANDS:
  dbt run          → execute models
  dbt test         → run tests
  dbt build        → run + test (in DAG order)
  dbt seed         → load CSV seeds
  dbt snapshot     → run snapshots
  dbt deps         → install packages
  dbt docs generate → build docs
  dbt source freshness → check source freshness
  dbt run --select tag:daily → run tagged models
  dbt run --full-refresh → force full table rebuild

PROJECT STRUCTURE:
  models/
    staging/        → stg_source__table.sql (1:1 rename/cast)
    intermediate/   → int_*.sql (joins, business logic)
    marts/          → fct_*.sql, dim_*.sql (final output)
  tests/            → custom SQL data tests
  macros/           → reusable Jinja macros
  seeds/            → small CSV reference data
  snapshots/        → SCD Type 2 snapshots
```

---

## Resources

| Resource | URL | Priority |
|----------|-----|----------|
| dbt Learn (free courses) | https://learn.getdbt.com | Must do |
| dbt Documentation | https://docs.getdbt.com | Reference |
| Best Practices Guide | https://docs.getdbt.com/best-practices | Must read |
| Exam registration | https://www.getdbt.com/certifications/analytics-engineer | Register |
| dbt Discourse | https://discourse.getdbt.com | Tips/practice |
| dbt_utils package | https://hub.getdbt.com/dbt-labs/dbt_utils | Know key macros |

---

## Your Advantage

You already know SQL and PostgreSQL deeply. The exam is ~60% SQL/YAML knowledge and ~40% dbt-specific patterns. The hardest part for you will be **Jinja templating** (Day 3) — spend extra time there. Everything else maps to concepts you already understand.
