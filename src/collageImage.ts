import type { Category } from './categories'
import type { SelectionMap } from './media'

const collageSize = 1800
const gap = 36
const padding = 72
const labelHeight = 92
const cellSize = (collageSize - padding * 2 - gap * 2) / 3

export async function createCollageImageBlob(
  categories: readonly Category[],
  selections: SelectionMap,
): Promise<Blob> {
  return renderCollageBlob(categories, selections)
}

async function renderCollageBlob(
  categories: readonly Category[],
  selections: SelectionMap,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = collageSize
  canvas.height = collageSize
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare collage canvas.')

  drawBackground(context)
  const images = await Promise.all(
    categories.map(async (category) => {
      const selected = selections[category.id]
      if (!selected) throw new Error(`Missing image for ${category.name}.`)
      return loadImage(selected.previewUrl)
    }),
  )

  for (const [index, category] of categories.entries()) {
    const column = index % 3
    const row = Math.floor(index / 3)
    const x = padding + column * (cellSize + gap)
    const y = padding + row * (cellSize + gap)
    drawCell(context, images[index], category.name, x, y)
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  )
  if (!blob) throw new Error('Could not render collage image.')
  return blob
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(new Error('Could not load selected image for image generation.'))
    image.src = src
  })
}

function drawBackground(context: CanvasRenderingContext2D): void {
  context.fillStyle = '#fff8ec'
  context.fillRect(0, 0, collageSize, collageSize)
  context.save()
  context.globalAlpha = 0.45
  context.fillStyle = '#ffc270'
  context.beginPath()
  context.arc(260, 210, 380, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 0.18
  context.fillStyle = '#d4542f'
  context.beginPath()
  context.arc(1540, 340, 330, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

function drawCell(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  label: string,
  x: number,
  y: number,
): void {
  context.save()
  roundedRect(context, x, y, cellSize, cellSize, 42)
  context.clip()
  context.fillStyle = '#ffe2d3'
  context.fillRect(x, y, cellSize, cellSize)
  drawContainedImage(context, image, x, y, cellSize, cellSize)
  context.fillStyle = 'rgba(39, 25, 21, 0.72)'
  roundedRect(context, x, y + cellSize - labelHeight, cellSize, labelHeight, 32)
  context.fill()
  context.fillStyle = '#fff8ec'
  context.font = '800 44px Inter, Arial, sans-serif'
  context.textBaseline = 'middle'
  context.fillText(label, x + 34, y + cellSize - 46, cellSize - 68)
  context.restore()
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = width / height
  const drawWidth = sourceRatio > targetRatio ? width : height * sourceRatio
  const drawHeight = sourceRatio > targetRatio ? width / sourceRatio : height
  const drawX = x + (width - drawWidth) / 2
  const drawY = y + (height - drawHeight) / 2
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
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
