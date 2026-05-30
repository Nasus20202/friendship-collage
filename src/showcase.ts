import type { Category } from './categories'

export type ShowcasePhase = 'name' | 'image'

export type ShowcaseStep = {
  categoryIndex: number
  phase: ShowcasePhase
}

export function initialShowcaseStep(): ShowcaseStep {
  return { categoryIndex: 0, phase: 'name' }
}

export function nextShowcaseStep(
  step: ShowcaseStep,
  categoryCount: number,
): ShowcaseStep {
  if (step.phase === 'name') {
    return { ...step, phase: 'image' }
  }

  return {
    categoryIndex: (step.categoryIndex + 1) % categoryCount,
    phase: 'name',
  }
}

export function getShowcaseCategory(
  categories: readonly Category[],
  step: ShowcaseStep,
): Category {
  return categories[step.categoryIndex] ?? categories[0]
}
