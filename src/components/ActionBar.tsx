type ActionBarProps = {
  disabled: boolean
  isGenerating: boolean
  onGenerateGif: () => void
  onGenerateImage: () => void
  onPresent: () => void
}

export function ActionBar({
  disabled,
  isGenerating,
  onGenerateGif,
  onGenerateImage,
  onPresent,
}: ActionBarProps) {
  return (
    <nav className="action-bar" aria-label="Collage actions">
      <button
        className="primary-button"
        disabled={disabled}
        onClick={onPresent}
      >
        Present the collage
      </button>
      <button
        className="secondary-button"
        disabled={disabled || isGenerating}
        onClick={onGenerateImage}
      >
        Download an image
      </button>
      <button
        className="secondary-button"
        disabled={disabled || isGenerating}
        onClick={onGenerateGif}
      >
        Generate a GIF
      </button>
    </nav>
  )
}
