import { describe, expect, it, vi } from 'vitest'
import { createCategories } from './categories'
import { createAnimatedGifBlob } from './gifFrames'
import type { SelectionMap } from './media'

describe('GIF frame rendering', () => {
  it('builds frame payloads with real RGBA data', async () => {
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
      if (tagName === 'canvas')
        return fakeCanvas() as unknown as HTMLCanvasElement
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

    const blob = await createAnimatedGifBlob(categories, selections)

    expect(blob.type).toBe('image/gif')
    expect(blob.size).toBeGreaterThan(100)
    expect(context.drawImage).toHaveBeenCalledWith(
      expect.any(Object),
      182,
      42,
      356,
      356,
    )
  })
})

const context = canvasContext()

function fakeCanvas() {
  return {
    height: 0,
    width: 0,
    getContext: () => context,
  }
}

function canvasContext() {
  return {
    arcTo: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    clip: vi.fn(),
    closePath: vi.fn(),
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
    drawImage: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    getImageData: () => ({
      data: new Uint8ClampedArray(720 * 480 * 4).fill(120),
    }),
    moveTo: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
  }
}
