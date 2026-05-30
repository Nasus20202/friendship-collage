import { useState } from 'react'
import type { Category } from '../categories'
import { createCollageImageBlob } from '../collageImage'
import { createAnimatedGifBlob } from '../gifFrames'
import { downloadBlob } from '../media'
import type { SelectionMap } from '../media'

type StatusSetter = (
  message: string,
  type: 'info' | 'error' | 'success',
) => void

export function useMediaGeneration(onStatus: StatusSetter) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function generateMedia(
    kind: 'image' | 'gif',
    categories: readonly Category[],
    selections: SelectionMap,
  ) {
    setIsGenerating(true)
    onStatus(
      kind === 'image' ? 'Generating collage image...' : 'Generating GIF...',
      'info',
    )

    try {
      const blob =
        kind === 'image'
          ? await createCollageImageBlob(categories, selections)
          : await createAnimatedGifBlob(categories, selections)
      downloadBlob(
        blob,
        kind === 'image' ? 'friendship-collage.png' : 'friendship-collage.gif',
      )
      onStatus(
        kind === 'image' ? 'Collage image downloaded.' : 'GIF downloaded.',
        'success',
      )
    } catch (error) {
      onStatus(
        error instanceof Error ? error.message : 'Generation failed.',
        'error',
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return { generateMedia, isGenerating }
}
