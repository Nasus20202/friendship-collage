## ADDED Requirements

### Requirement: Worker-generated collage image

The app SHALL generate a combined collage image through a Cloudflare Worker endpoint when the user selects the download image action.

#### Scenario: User downloads generated image

- **WHEN** the user has selected valid images for all categories and selects the download image action
- **THEN** the app sends the category images to the Worker and downloads the generated combined image returned by the Worker

#### Scenario: Worker returns image metadata

- **WHEN** the Worker successfully generates a combined image
- **THEN** the response includes an image content type and a filename suitable for browser download

#### Scenario: Worker rejects incomplete image payload

- **WHEN** the Worker receives a generation request without all required category images
- **THEN** the Worker returns a validation error and does not produce a partial image

### Requirement: Generated image layout

The generated collage image SHALL include all nine categories and selected images in a visually coherent combined composition.

#### Scenario: Combined image contains all categories

- **WHEN** the Worker generates a collage image
- **THEN** the output includes each category label and its corresponding selected image exactly once

#### Scenario: Generated image handles varied source aspect ratios

- **WHEN** selected images have different aspect ratios
- **THEN** the output fits or frames them consistently without distorting or cropping the images

### Requirement: Worker-backed GIF generation

The app SHALL provide a Worker-backed animated GIF generation flow using browser-rendered RGBA frames and Worker-side GIF encoding.

#### Scenario: User requests generated GIF

- **WHEN** the user has selected valid images for all categories and selects the generate GIF action
- **THEN** the app renders frames containing the selected images and category labels, sends those frames to a Worker endpoint, and downloads the generated GIF returned by the Worker

#### Scenario: GIF uses category sequence

- **WHEN** the GIF is generated
- **THEN** the GIF presents each selected image and category label in the configured category order

#### Scenario: GIF uses readable text and pacing

- **WHEN** the Worker encodes the generated GIF
- **THEN** frames use browser-rendered antialiased labels and a two-second delay per category frame

#### Scenario: GIF generation fails

- **WHEN** GIF generation cannot complete
- **THEN** the app shows a clear failure message and allows the user to retry without reselecting images

### Requirement: Media privacy and validation

The system SHALL validate generated-media inputs and SHALL not retain user-uploaded images longer than required for the requested generation flow.

#### Scenario: Invalid media file is uploaded

- **WHEN** the Worker receives a file that is not an accepted image type
- **THEN** the Worker rejects the request with a clear validation error

#### Scenario: Media generation completes

- **WHEN** the Worker finishes generating the requested output
- **THEN** temporary uploaded image or frame data is discarded without persistent server-side storage
