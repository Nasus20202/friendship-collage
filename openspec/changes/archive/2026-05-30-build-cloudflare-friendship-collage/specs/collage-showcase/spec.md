## ADDED Requirements

### Requirement: Showcase mode entry

The app SHALL provide a showcase mode from the present action.

#### Scenario: User starts showcase mode

- **WHEN** the user selects the present action
- **THEN** the app enters showcase mode and starts with the first configured category

#### Scenario: Showcase starts with category name

- **WHEN** showcase mode begins for a category
- **THEN** the category name is shown before the category image is shown

### Requirement: Step-by-step reveal

Showcase mode SHALL advance one step at a time, alternating between category name and category image for each category.

#### Scenario: User advances from category name to image

- **WHEN** the current showcase step is a category name and the user presses next
- **THEN** the app shows the selected image for that category

#### Scenario: User advances with keyboard

- **WHEN** the current showcase step is visible and the user presses Space or Enter
- **THEN** the app advances to the next showcase step

#### Scenario: User advances from image to next category

- **WHEN** the current showcase step is a category image and the user presses next
- **THEN** the app shows the next category name

#### Scenario: User reaches the final image

- **WHEN** the user advances past the image for the ninth category
- **THEN** the app returns to the first category name or offers a clear way to restart the showcase loop

### Requirement: Animated transitions

Showcase mode SHALL use visually polished animated transitions between steps while preserving accessibility.

#### Scenario: Step changes use animation

- **WHEN** the user advances to the next showcase step
- **THEN** the outgoing and incoming content transition with an intentional animation

#### Scenario: Reduced motion is requested

- **WHEN** the user's device requests reduced motion
- **THEN** the app reduces or removes nonessential transition animation

#### Scenario: Showcase preserves image aspect ratio

- **WHEN** the current showcase step displays a selected image
- **THEN** the full image is visible without distortion or cropping

### Requirement: Showcase exit

The app SHALL allow the user to leave showcase mode and return to the collage builder without losing selected images.

#### Scenario: User exits showcase mode

- **WHEN** the user activates the exit control in showcase mode
- **THEN** the app returns to the builder with all selected images still present
