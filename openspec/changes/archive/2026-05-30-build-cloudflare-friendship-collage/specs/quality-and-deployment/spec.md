## ADDED Requirements

### Requirement: Unit and Worker tests

The project SHALL include Vitest coverage for frontend logic and Worker API behavior.

#### Scenario: Unit tests are run

- **WHEN** the developer runs the unit test command
- **THEN** Vitest executes tests for category configuration, selection state, browser storage persistence, GIF frame payloads, validation, and showcase step logic

#### Scenario: Worker tests are run

- **WHEN** the developer runs Worker tests
- **THEN** Vitest exercises media-generation endpoint success, GIF frame encoding, GIF delay, and validation failure cases

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
- **THEN** ESLint checks application, Worker, and test source files without errors

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

### Requirement: Cloudflare deployment configuration

The project SHALL include Cloudflare deployment configuration for `friendship-collage.nasus.dev`.

#### Scenario: Deployment configuration is inspected

- **WHEN** a developer reviews the Cloudflare configuration
- **THEN** it identifies the Worker entrypoint, static asset directory, compatibility date, and target domain route or custom domain

#### Scenario: Deployment command is run with access

- **WHEN** the developer has valid Cloudflare credentials and runs the deployment command
- **THEN** the app deploys to `friendship-collage.nasus.dev`
