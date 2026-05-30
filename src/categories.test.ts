import { describe, expect, it } from 'vitest'
import {
  createCategories,
  defaultCategoryNames,
  isAcceptedImage,
  missingCategoryNames,
} from './categories'

describe('category configuration', () => {
  it('uses the default nine categories', () => {
    expect(createCategories().map((category) => category.name)).toEqual([
      ...defaultCategoryNames,
    ])
  })

  it('uses custom names when exactly nine are provided', () => {
    const names = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ]

    expect(createCategories(names).map((category) => category.name)).toEqual(
      names,
    )
  })

  it('falls back to defaults when the category count is invalid', () => {
    expect(
      createCategories(['animal']).map((category) => category.name),
    ).toEqual([...defaultCategoryNames])
  })
})

describe('image validation', () => {
  it('accepts configured image MIME types', () => {
    expect(
      isAcceptedImage(
        new File(['image'], 'photo.webp', { type: 'image/webp' }),
      ),
    ).toBe(true)
  })

  it('rejects unsupported file types', () => {
    expect(
      isAcceptedImage(new File(['text'], 'note.txt', { type: 'text/plain' })),
    ).toBe(false)
  })

  it('reports missing category names', () => {
    const categories = createCategories()
    const selectedIds = new Set(
      categories.slice(0, 2).map((category) => category.id),
    )

    expect(missingCategoryNames(categories, selectedIds)).toEqual(
      defaultCategoryNames.slice(2),
    )
  })
})
