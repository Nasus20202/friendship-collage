import type { Category } from './categories'
import type { SelectionMap } from './media'
import { GIFEncoder, applyPalette, quantize } from 'gifenc'

const frameWidth = 720
const frameHeight = 480

export async function createAnimatedGifBlob(
  categories: readonly Category[],
  selections: SelectionMap,
): Promise<Blob> {
  const frames = await Promise.all(
    categories.map(async (category) => {
      const selected = selections[category.id]
      if (!selected) throw new Error(`Missing image for ${category.name}.`)
      return new Uint8Array(
        await renderGifFrame(category.name, selected.previewUrl),
      )
    }),
  )
  const gif = GIFEncoder()

  for (const frame of frames) {
    const palette = quantize(frame, 256, { format: 'rgb444' })
    const indexed = applyPalette(frame, palette, 'rgb444')
    gif.writeFrame(indexed, frameWidth, frameHeight, {
      palette,
      delay: 2000,
      repeat: 0,
    })
  }

  gif.finish()
  const bytes = gif.bytes()
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' })
}

async function renderGifFrame(
  categoryName: string,
  imageUrl: string,
): Promise<Uint8ClampedArray> {
  const canvas = document.createElement('canvas')
  canvas.width = frameWidth
  canvas.height = frameHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare GIF canvas.')

  const image = await loadImage(imageUrl)
  drawBackground(context)
  drawContainedImage(context, image)
  drawLabel(context, categoryName)

  return context.getImageData(0, 0, frameWidth, frameHeight).data
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(new Error('Could not load selected image for GIF generation.'))
    image.src = src
  })
}

function drawBackground(context: CanvasRenderingContext2D): void {
  const gradient = context.createLinearGradient(0, 0, frameWidth, frameHeight)
  gradient.addColorStop(0, '#fff8ec')
  gradient.addColorStop(1, '#f3d9ba')
  context.fillStyle = gradient
  context.fillRect(0, 0, frameWidth, frameHeight)
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
): void {
  const target = {
    x: 52,
    y: 42,
    width: frameWidth - 104,
    height: frameHeight - 124,
  }
  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = target.width / target.height
  const drawWidth =
    sourceRatio > targetRatio ? target.width : target.height * sourceRatio
  const drawHeight =
    sourceRatio > targetRatio ? target.width / sourceRatio : target.height
  const drawX = target.x + (target.width - drawWidth) / 2
  const drawY = target.y + (target.height - drawHeight) / 2

  context.save()
  roundedRect(context, target.x, target.y, target.width, target.height, 36)
  context.clip()
  context.fillStyle = 'rgba(255, 248, 236, 0.78)'
  context.fillRect(target.x, target.y, target.width, target.height)
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  context.restore()
}

function drawLabel(
  context: CanvasRenderingContext2D,
  categoryName: string,
): void {
  context.save()
  context.shadowColor = 'rgba(39, 25, 21, 0.28)'
  context.shadowBlur = 18
  context.fillStyle = 'rgba(39, 25, 21, 0.78)'
  roundedRect(context, 42, frameHeight - 92, frameWidth - 84, 58, 24)
  context.fill()
  context.shadowBlur = 0
  context.fillStyle = '#fff8ec'
  context.font = '700 34px Georgia, serif'
  context.textBaseline = 'middle'
  context.fillText(categoryName, 72, frameHeight - 63, frameWidth - 144)
  context.restore()
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}
