---
id: "PHR-0001"
title: "Fix Uvicorn ASGI App Loading Error"
stage: "red"
date_iso: "2026-02-08"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "master"
user: "unknown"
command: "manual"
labels: ["backend", "fastapi", "uvicorn", "asgi", "debugging"]
links_spec: null
links_ticket: null
links_adr: null
links_pr: null
files_yaml:
  - "backend/app/main.py"
tests_yaml:
  - "none"
---

# Fix Uvicorn ASGI App Loading Error

## Context
User encountered an ASGI app loading error when running uvicorn with the command `uv run -m uvicorn main:app --reload`. The error occurred because the main.py file was located in a subdirectory (`backend/app/main.py`) rather than in the root backend directory.

## Problem
The user ran: `uv run -m uvicorn main:app --reload` from the backend directory, but received an error "Error loading ASGI app. Could not find the app".

## Solution
Identified that the FastAPI app is defined in `backend/app/main.py`, not `backend/main.py`. The correct command should be:
`uv run -m uvicorn app.main:app --reload`

This tells uvicorn to look for the `main` module inside the `app` package and access the `app` variable within that module.

## Outcome Impact
Fixed the ASGI app loading error by correcting the module path in the uvicorn command.

## Files Summary
- backend/app/main.py - FastAPI application definition that was correctly configured

## Next Prompts
None needed - issue resolved.

## Reflection Note
The issue was a common path confusion when the main application file is in a subdirectory rather than the current working directory.

## Failure Modes Observed
None - successful diagnosis and resolution.

## Next Experiment to Improve Prompt Quality
N/A