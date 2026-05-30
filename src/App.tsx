import { useState } from 'react'
import './App.css'
import { ActionBar } from './components/ActionBar'
import { CategoryGrid } from './components/CategoryGrid'
import { ShowcaseMode } from './components/ShowcaseMode'
import { useCollageState } from './hooks/useCollageState'
import { useMediaGeneration } from './hooks/useMediaGeneration'
import { initialShowcaseStep } from './showcase'
import type { ShowcaseStep } from './showcase'

type Status = {
  type: 'info' | 'error' | 'success'
  message: string
}

function App() {
  const [status, setStatus] = useState<Status | null>(null)
  const [showcaseStep, setShowcaseStep] = useState<ShowcaseStep | null>(null)
  const collage = useCollageState((message, type) =>
    setStatus({ message, type }),
  )
  const { generateMedia, isGenerating } = useMediaGeneration((message, type) =>
    setStatus({ message, type }),
  )

  function requireCompleteSelection() {
    if (collage.missing.length === 0) return true

    setStatus({
      type: 'error',
      message: `Select images for: ${collage.missing.join(', ')}.`,
    })
    return false
  }

  function presentCollage() {
    if (!requireCompleteSelection()) return
    setShowcaseStep(initialShowcaseStep())
    setStatus(null)
  }

  function generate(kind: 'image' | 'gif') {
    if (!requireCompleteSelection()) return
    void generateMedia(kind, collage.categories, collage.selections)
  }

  if (showcaseStep) {
    return (
      <ShowcaseMode
        categories={collage.categories}
        onExit={() => setShowcaseStep(null)}
        onStepChange={setShowcaseStep}
        selections={collage.selections}
        step={showcaseStep}
      />
    )
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <div>
          <h1>Friendship Collage</h1>
          <p>
            Pick one image for every category, then present it like a reveal,
            download a collage, or generate a GIF keepsake.
          </p>
        </div>
        <img
          className="app-logo"
          src="/logo.png"
          alt="Friendship Collage logo"
        />
      </section>

      <CategoryGrid
        categories={collage.categories}
        onImageChange={collage.selectImage}
        onRename={collage.renameCategory}
        onRemoveImage={collage.removeImage}
        selections={collage.selections}
      />

      {status ? (
        <p
          className={`status status--${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </p>
      ) : null}

      <ActionBar
        disabled={collage.missing.length > 0}
        isGenerating={isGenerating}
        onGenerateGif={() => generate('gif')}
        onGenerateImage={() => generate('image')}
        onPresent={presentCollage}
      />
    </main>
  )
}

export default App
