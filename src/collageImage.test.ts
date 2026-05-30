import { describe, expect, it, vi } from 'vitest'
import { createCategories } from './categories'
import { createCollageImageBlob } from './collageImage'
import type { SelectionMap } from './media'

describe('collage image rendering', () => {
  it('builds a PNG payload from selected images', async () => {
    const categories = createCategories()
    const selections: SelectionMap = Object.fromEntries(
      categories.map((category) => [
        category.id,
        {
          file: new File(['image'], `${category.name}.png`, {
            type: 'image/png',
          }),
          previewUrl: `blob:${category.id}`,
        },
      ]),
    )
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return fakeCanvas() as unknown as HTMLCanvasElement
      }
      return document.createElement(tagName)
    })
    vi.stubGlobal(
      'Image',
      class {
        naturalHeight = 20
        naturalWidth = 20
        onerror: (() => void) | null = null
        onload: (() => void) | null = null

        set src(_value: string) {
          this.onload?.()
        }
      },
    )

    const image = await createCollageImageBlob(categories, selections)

    expect(image).toBeInstanceOf(Blob)
    expect(image.type).toBe('image/png')
    expect(context.drawImage).toHaveBeenCalledTimes(9)
  })
})

const context = {
  arc: vi.fn(),
  arcTo: vi.fn(),
  beginPath: vi.fn(),
  clip: vi.fn(),
  closePath: vi.fn(),
  drawImage: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  moveTo: vi.fn(),
  restore: vi.fn(),
  save: vi.fn(),
}

function fakeCanvas() {
  return {
    height: 0,
    width: 0,
    getContext: () => context,
    toBlob: (callback: BlobCallback) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    },
  }
}
