import { describe, expect, it } from 'vitest'
import { createCategories } from './categories'
import {
  getShowcaseCategory,
  initialShowcaseStep,
  nextShowcaseStep,
} from './showcase'

describe('showcase steps', () => {
  it('starts on the first category name', () => {
    expect(initialShowcaseStep()).toEqual({ categoryIndex: 0, phase: 'name' })
  })

  it('advances from category name to image', () => {
    expect(nextShowcaseStep({ categoryIndex: 0, phase: 'name' }, 9)).toEqual({
      categoryIndex: 0,
      phase: 'image',
    })
  })

  it('advances from image to next category name', () => {
    expect(nextShowcaseStep({ categoryIndex: 0, phase: 'image' }, 9)).toEqual({
      categoryIndex: 1,
      phase: 'name',
    })
  })

  it('loops to the first category after the final image', () => {
    expect(nextShowcaseStep({ categoryIndex: 8, phase: 'image' }, 9)).toEqual({
      categoryIndex: 0,
      phase: 'name',
    })
  })

  it('returns the category for the active step', () => {
    const categories = createCategories()

    expect(
      getShowcaseCategory(categories, { categoryIndex: 3, phase: 'name' }).name,
    ).toBe('personality')
  })
})
