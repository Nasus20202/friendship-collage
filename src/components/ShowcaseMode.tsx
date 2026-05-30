import { useEffect } from 'react'
import type { Category } from '../categories'
import type { SelectionMap } from '../media'
import { getShowcaseCategory, nextShowcaseStep } from '../showcase'
import type { ShowcaseStep } from '../showcase'

type ShowcaseModeProps = {
  categories: readonly Category[]
  onExit: () => void
  onStepChange: (step: ShowcaseStep) => void
  selections: SelectionMap
  step: ShowcaseStep
}

export function ShowcaseMode({
  categories,
  onExit,
  onStepChange,
  selections,
  step,
}: ShowcaseModeProps) {
  const category = getShowcaseCategory(categories, step)
  const selected = selections[category.id]
  const isImageStep = step.phase === 'image'

  function nextStep() {
    onStepChange(nextShowcaseStep(step, categories.length))
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onExit()
        return
      }

      if (event.key !== 'Enter' && event.key !== ' ') return
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('button')
      ) {
        return
      }

      event.preventDefault()
      nextStep()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <main className="showcase" aria-live="polite">
      <button className="ghost-button showcase__exit" onClick={onExit}>
        Exit showcase
      </button>
      <section className="showcase__stage" key={`${category.id}-${step.phase}`}>
        {isImageStep ? null : <p className="eyebrow">Friendship prompt</p>}
        {isImageStep ? (
          <img
            className="showcase__image"
            src={selected?.previewUrl}
            alt={`${category.name} selection`}
          />
        ) : (
          <h1>{category.name}</h1>
        )}
      </section>
      <button className="primary-button showcase__next" onClick={nextStep}>
        Next
      </button>
    </main>
  )
}
