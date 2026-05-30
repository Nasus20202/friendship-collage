## Purpose

Defines expected test coverage, quality checks, documentation, and static deployment configuration.

## Requirements

### Requirement: Unit tests

The project SHALL include Vitest coverage for frontend logic and local media generation behavior.

#### Scenario: Unit tests are run

- **WHEN** the developer runs the unit test command
- **THEN** Vitest executes tests for category configuration, selection state, browser storage persistence, GIF frame payloads, validation, and showcase step logic

### Requirement: End-to-end tests

The project SHALL include Playwright coverage for the main browser flows.

#### Scenario: Builder flow is tested

- **WHEN** Playwright runs the builder flow test
- **THEN** it verifies the default categories, image upload controls, previews, image removal, disabled actions, and bottom actions

#### Scenario: Showcase flow is tested

- **WHEN** Playwright runs the showcase test
- **THEN** it verifies category-name steps, image steps, next navigation, and exiting showcase mode

#### Scenario: Media actions are tested

- **WHEN** Playwright runs media action tests
- **THEN** it verifies image download behavior and GIF generation request behavior, including browser-rendered frame uploads, with controlled test fixtures

### Requirement: Linting and formatting

The project SHALL use ESLint and Prettier commands to enforce code quality and formatting.

#### Scenario: Lint command is run

- **WHEN** the developer runs the lint command
- **THEN** ESLint checks application and test source files without errors

#### Scenario: Format check command is run

- **WHEN** the developer runs the format check command
- **THEN** Prettier reports whether tracked source, configuration, and documentation files are formatted

### Requirement: Documentation

The project SHALL include `README.md` and `AGENTS.md` documentation for users and coding agents.

#### Scenario: User reads README

- **WHEN** a developer opens `README.md`
- **THEN** it explains setup, development, testing, build, media generation, and deployment commands

#### Scenario: Agent reads AGENTS guidance

- **WHEN** a coding agent opens `AGENTS.md`
- **THEN** it describes project conventions, verification commands, and implementation constraints

### Requirement: Static deployment configuration

The project SHALL include static deployment configuration for `friendship-collage.nasus.dev`.

#### Scenario: Deployment configuration is inspected

- **WHEN** a developer reviews the deployment configuration
- **THEN** it identifies the static asset build and target Cloudflare Pages project

#### Scenario: Deployment command is run with access

- **WHEN** the developer has valid Cloudflare credentials and runs the deployment command
- **THEN** the app deploys to `friendship-collage.nasus.dev`
