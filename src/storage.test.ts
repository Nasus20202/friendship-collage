import { beforeEach, describe, expect, it } from 'vitest'
import { createCategories } from './categories'
import {
  loadCategories,
  loadPersistedSelections,
  loadSelections,
  removeSelection,
  saveCategories,
  saveSelection,
} from './storage'

describe('browser storage persistence', () => {
  beforeEach(async () => {
    localStorage.clear()
    await deleteDb()
  })

  it('saves and loads edited category names', () => {
    const categories = createCategories()
    saveCategories([
      { ...categories[0], name: 'tiny beast' },
      ...categories.slice(1),
    ])

    expect(loadCategories()[0].name).toBe('tiny beast')
  })

  it('falls back to default categories when stored categories are invalid', () => {
    localStorage.setItem(
      'friendship-collage:categories',
      JSON.stringify(['one']),
    )

    expect(loadCategories()).toHaveLength(9)
    expect(loadCategories()[0].name).toBe('animal')
  })

  it('saves and loads selected image files from IndexedDB', async () => {
    const categories = createCategories()
    const file = new File(['<svg />'], 'animal.svg', { type: 'image/svg+xml' })

    await saveSelection(categories[0].id, file)

    const selections = await loadSelections(categories)

    expect((await loadPersistedSelections())[categories[0].id]?.name).toBe(
      'animal.svg',
    )
    expect(selections[categories[0].id]?.file.name).toBe('animal.svg')
    expect(selections[categories[0].id]?.previewUrl).toMatch(/^blob:/)
  })

  it('removes selected image files from IndexedDB', async () => {
    const categories = createCategories()
    const file = new File(['<svg />'], 'animal.svg', { type: 'image/svg+xml' })

    await saveSelection(categories[0].id, file)
    await removeSelection(categories[0].id)

    await expect(loadPersistedSelections()).resolves.toEqual({})
  })

  it('migrates legacy localStorage image data to IndexedDB', async () => {
    const categories = createCategories()
    localStorage.setItem(
      'friendship-collage:selections',
      JSON.stringify({
        [categories[0].id]: {
          name: 'animal.svg',
          type: 'image/svg+xml',
          dataUrl: 'data:image/svg+xml;base64,PHN2Zy8+',
        },
      }),
    )

    const persisted = await loadPersistedSelections()

    expect(persisted[categories[0].id]?.name).toBe('animal.svg')
    expect(localStorage.getItem('friendship-collage:selections')).toBeNull()
  })
})

function deleteDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('friendship-collage')
    request.addEventListener('success', () => resolve())
    request.addEventListener('blocked', () => resolve())
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Could not clear IndexedDB.'))
    })
  })
}
