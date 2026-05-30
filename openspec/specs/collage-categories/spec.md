## Purpose

Defines the collage builder category grid, browser-side category editing, local image selection, and primary builder actions.

## Requirements

### Requirement: Default category grid

The app SHALL display a 3 by 3 grid of nine categories when the user opens the website.

#### Scenario: First page load shows default categories

- **WHEN** a user opens the website without custom category configuration
- **THEN** the app displays animal, place, flower, personality, season, hobby, color, drink, and food as the nine category labels

#### Scenario: Grid keeps three columns on desktop

- **WHEN** the app is viewed on a desktop-sized viewport
- **THEN** the category chooser is presented as three columns and three rows

#### Scenario: Grid remains usable on mobile

- **WHEN** the app is viewed on a mobile-sized viewport
- **THEN** all nine categories remain visible or reachable without horizontal scrolling

### Requirement: Configurable categories

The app SHALL define default categories through configuration, SHALL allow users to edit category labels in the browser, and SHALL fall back to the default nine categories when no custom configuration is provided.

#### Scenario: Custom category configuration is provided

- **WHEN** the app is built or started with a custom nine-category configuration
- **THEN** the grid displays the configured category names instead of the defaults

#### Scenario: Invalid category count is configured

- **WHEN** the app receives a configuration that does not contain exactly nine category names
- **THEN** the app uses the default category list and does not render a broken grid

#### Scenario: User edits a category label

- **WHEN** the user changes a category label in the grid
- **THEN** the edited label is used in previews, showcase mode, generated image metadata, and GIF generation requests

#### Scenario: User returns after editing labels and selecting images

- **WHEN** the user reloads or reopens the app after editing labels and selecting images
- **THEN** the app restores the edited category labels from localStorage and selected image previews from IndexedDB

### Requirement: Local image selection

The app SHALL allow the user to choose an image file from their device for each category.

#### Scenario: User selects an image for a category

- **WHEN** the user chooses a valid image file for a category
- **THEN** the app shows a preview for that category and marks the category as selected

#### Scenario: User replaces a selected image

- **WHEN** the user chooses another valid image file for a category that already has an image
- **THEN** the app replaces the previous preview with the new image

#### Scenario: User removes a selected image

- **WHEN** the user removes the image for a category
- **THEN** the app clears that category preview, removes the persisted image for that category from IndexedDB, and marks the category as needing an image

#### Scenario: User chooses an unsupported file type

- **WHEN** the user chooses a file that is not an accepted image type
- **THEN** the app rejects the file and shows a clear validation message

### Requirement: Primary actions

The app SHALL display three primary actions at the bottom of the collage builder: present the collage, download an image, and generate a GIF.

#### Scenario: Actions are visible after page load

- **WHEN** the user opens the website
- **THEN** the present, download image, and generate GIF actions are visible at the bottom of the builder

#### Scenario: Actions communicate missing images

- **WHEN** the user invokes a media action before selecting every required image
- **THEN** the app prevents incomplete generation and explains which images are missing

#### Scenario: Actions are disabled until complete

- **WHEN** fewer than nine category images are selected
- **THEN** the present, download image, and generate GIF actions are disabled

#### Scenario: Actions are enabled when complete

- **WHEN** all nine category images are selected
- **THEN** the present, download image, and generate GIF actions are enabled
