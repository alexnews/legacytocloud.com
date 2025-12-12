Product Requirements Document (PRD)

Project: LegacyToCloud.com

Version: MVP v1.0

Status: Build-ready

Owner: Product & Engineering

Target Launch: 4 weeks

⸻

1. Product Overview

1.1 Product Name

LegacyToCloud

1.2 Product Description

LegacyToCloud is a web-based migration assistant that helps companies analyze legacy MySQL or PostgreSQL databases and migrate them safely to modern targets — PostgreSQL or Snowflake — using automated schema analysis, migration planning, bulk loading, incremental synchronization, and data validation.

The product combines automation + proven migration playbooks to reduce risk, downtime, and uncertainty in database modernization projects.

⸻

2. Problem Statement

Companies want to modernize their databases but face:
	•	Poorly documented legacy schemas
	•	Incompatible data types and encodings
	•	Large data volumes (millions of rows)
	•	Fear of downtime and broken applications
	•	No clear migration plan or validation strategy

Existing tools are either:
	•	Too low-level (manual scripting)
	•	Too heavy/enterprise-only
	•	Focused on infrastructure, not data correctness

⸻

3. Goals & Non-Goals

3.1 Goals (MVP)
	•	Allow users to analyze MySQL/PostgreSQL schemas
	•	Generate a clear migration plan to:
	•	PostgreSQL
	•	Snowflake
	•	Support bulk initial load
	•	Support incremental sync using date_updated
	•	Provide basic validation & progress tracking
	•	Be usable by engineers without deep migration expertise

⸻

3.2 Non-Goals (Explicitly Out of Scope)

❌ Databricks / Delta Lake
❌ Kafka / Debezium CDC
❌ Real-time streaming
❌ Advanced transformations UI
❌ Full BI / analytics modeling
❌ Multi-region deployments
❌ Enterprise SSO

These are post-MVP features.

⸻

4. Target Users

Primary Users
	•	Data Engineers
	•	Backend Engineers
	•	DevOps / Platform Engineers

Secondary Users
	•	Technical Managers
	•	CTOs / Architects (read-only insights)

⸻

5. Supported Migration Paths (MVP)

Source DB	Target DB	Supported
MySQL	PostgreSQL	✅
MySQL	Snowflake	✅
PostgreSQL	Snowflake	✅


⸻

6. Core User Flows

6.1 Project Creation
	1.	User signs up / logs in
	2.	Creates a new project
	3.	Chooses migration type (e.g., MySQL → PostgreSQL)

⸻

6.2 Connection Setup

User provides:
	•	Source DB connection (MySQL or PostgreSQL)
	•	Target DB connection (PostgreSQL or Snowflake)
	•	Optional: S3 credentials for Snowflake staging

System:
	•	Tests connectivity
	•	Stores encrypted credentials

⸻

6.3 Schema Analysis

User clicks “Analyze Schema”

System:
	•	Extracts schema metadata
	•	Profiles tables
	•	Detects risks
	•	Generates compatibility report

Output:
	•	Table list
	•	Row counts
	•	Type mappings
	•	Warnings

⸻

6.4 Migration Plan Generation

User clicks “Generate Migration Plan”

System produces:
	•	Target DDL
	•	Type conversion rules
	•	Load strategy (bulk + incremental)
	•	Validation checklist

⸻

6.5 Data Migration

User starts migration:
	1.	Bulk initial load
	2.	Incremental sync (date_updated)
	3.	Validation checks
	4.	Status updates

⸻

7. Functional Requirements

7.1 Authentication
	•	Email + password
	•	Password reset
	•	Session management

⸻

7.2 Project Management
	•	Create / delete project
	•	Assign source & target
	•	View project status

⸻

7.3 Connection Management
	•	Add/edit/remove DB connections
	•	Validate credentials
	•	Mask sensitive fields in UI

⸻

7.4 Schema Analyzer

Must:
	•	List all tables & columns
	•	Detect primary keys
	•	Detect data types
	•	Detect collation / charset
	•	Estimate row counts
	•	Flag risks:
	•	No primary key
	•	Unsupported types
	•	Large tables

⸻

7.5 Migration Plan Generator

Must:
	•	Generate PostgreSQL DDL
	•	Generate Snowflake DDL
	•	Provide type mapping table
	•	Recommend:
	•	Indexes
	•	Partitioning (basic)
	•	Export as JSON & SQL

⸻

7.6 Bulk Load Engine

Must support:
	•	Chunked extraction
	•	Parallel processing
	•	COPY into PostgreSQL
	•	COPY INTO Snowflake
	•	Resume after failure

⸻

7.7 Incremental Sync Engine

MVP supports:
	•	date_updated watermark
	•	PK-based fallback
	•	Configurable batch size
	•	Idempotent upserts

⸻

7.8 Validation Engine

Must include:
	•	Row count comparison
	•	Aggregation checks
	•	Sample row comparison
	•	Validation status per table

⸻

7.9 Dashboard

Must show:
	•	Migration status
	•	Table-level progress
	•	Validation results
	•	Error logs

⸻

8. Non-Functional Requirements

8.1 Performance
	•	Support tables with 3M+ rows
	•	Chunk size configurable
	•	Background execution (async)

⸻

8.2 Reliability
	•	Retry failed jobs
	•	Resume partial migrations
	•	Idempotent operations

⸻

8.3 Security
	•	Encrypted credentials
	•	TLS connections
	•	No raw data stored permanently
	•	Minimal logging of sensitive values

⸻

8.4 Observability
	•	Job status tracking
	•	Error logs
	•	Execution timestamps

⸻

9. Technical Architecture

Backend
	•	FastAPI (Python)
	•	REST API
	•	Async workers

⸻

Orchestration
	•	Dagster
	•	Assets for:
	•	Analysis
	•	Load
	•	Sync
	•	Validation

⸻

Frontend
	•	Next.js / React
	•	Minimal UI
	•	Focus on clarity

⸻

Metadata Database
	•	PostgreSQL
	•	Tables:
	•	users
	•	projects
	•	connections
	•	schema_snapshots
	•	migration_runs
	•	tasks
	•	validations

⸻

Storage
	•	S3-compatible object storage
	•	Stores:
	•	CSV/Parquet extracts
	•	Schema reports
	•	Validation reports

⸻

10. MVP Timeline

Week 1
	•	Auth
	•	Projects
	•	Connections
	•	Schema Analyzer

Week 2
	•	Migration plan generator
	•	PostgreSQL DDL
	•	Snowflake DDL

Week 3
	•	Bulk load engine
	•	Incremental sync
	•	Validation engine

Week 4
	•	Dashboard
	•	Reports
	•	Landing pages
	•	Launch

⸻

11. Success Metrics

Product Metrics
	•	Schema analysis completes successfully
	•	Migration plan generated
	•	Migration finishes without manual intervention

Business Metrics
	•	Number of analyzed DBs
	•	Number of completed migrations
	•	Conversion from free → paid

⸻

12. Risks & Mitigations

Risk	Mitigation
Bad data quality	Early profiling & warnings
Large tables	Chunking & parallelism
User misconfiguration	Defaults + validation
Snowflake cost spikes	Conservative defaults


⸻

13. Pricing (MVP)
	•	Free
	•	Schema analysis
	•	Paid
	•	Migration plan export
	•	Data migration execution
	•	Consulting
	•	Custom pricing

⸻

14. Future Enhancements (Post-MVP)
	•	CDC (Debezium)
	•	Databricks support
	•	Advanced transformation editor
	•	Cost optimization analytics
	•	Enterprise SSO
	•	Role-based access

⸻

15. One-Line Product Definition

LegacyToCloud helps engineers analyze, plan, and safely migrate MySQL or PostgreSQL databases to PostgreSQL or Snowflake with minimal risk and downtime.
