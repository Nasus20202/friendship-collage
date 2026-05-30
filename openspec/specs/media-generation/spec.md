## Purpose

Defines local browser image and GIF generation behavior, including media privacy constraints.

## Requirements

### Requirement: Browser-generated collage image

The app SHALL generate a combined PNG collage image in the browser when the user selects the download image action.

#### Scenario: User downloads generated image

- **WHEN** the user has selected valid images for all categories and selects the download image action
- **THEN** the app renders and downloads `friendship-collage.png` without uploading selected images

#### Scenario: Browser returns image metadata

- **WHEN** the browser generates the PNG collage
- **THEN** the response includes the PNG content type and `friendship-collage.png` filename for browser download

#### Scenario: Browser rejects incomplete generated image payload

- **WHEN** the user attempts image generation without all required category images
- **THEN** the app prevents generation and does not produce a partial image

### Requirement: Generated image layout

The generated collage image SHALL include all nine categories and selected images in a visually coherent combined composition.

#### Scenario: Combined image contains all categories

- **WHEN** the browser renders a collage image
- **THEN** the output includes each category label and its corresponding selected image exactly once

#### Scenario: Generated image handles varied source aspect ratios

- **WHEN** selected images have different aspect ratios
- **THEN** the output fits or frames them consistently without distorting or cropping the images

### Requirement: Browser-generated GIF

The app SHALL provide an animated GIF generation flow using browser-rendered frames and browser-side GIF encoding.

#### Scenario: User requests generated GIF

- **WHEN** the user has selected valid images for all categories and selects the generate GIF action
- **THEN** the app renders frames containing the selected images and category labels, encodes a GIF locally, and downloads it without uploading selected images

#### Scenario: GIF uses category sequence

- **WHEN** the GIF is generated
- **THEN** the GIF presents each selected image and category label in the configured category order

#### Scenario: GIF uses readable text and pacing

- **WHEN** the browser encodes the generated GIF
- **THEN** frames use browser-rendered antialiased labels and a two-second delay per category frame

#### Scenario: GIF generation fails

- **WHEN** GIF generation cannot complete
- **THEN** the app shows a clear failure message and allows the user to retry without reselecting images

### Requirement: Media privacy and validation

The system SHALL validate generated-media inputs and SHALL not upload or retain user-selected images outside browser storage.

#### Scenario: Invalid media file is uploaded

- **WHEN** the user attempts generation with missing or invalid selected media
- **THEN** the app rejects the request with a clear validation error

#### Scenario: Media generation completes

- **WHEN** the browser finishes generating the requested output
- **THEN** temporary canvas and frame data is discarded without server-side storage
