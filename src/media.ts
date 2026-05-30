export type SelectedImage = {
  file: File
  previewUrl: string
}

export type SelectionMap = Record<string, SelectedImage | undefined>

export type PersistedSelectedImage = {
  name: string
  type: string
  file: File
}

export type PersistedSelectionMap = Record<
  string,
  PersistedSelectedImage | undefined
>

export function selectedIdSet(selections: SelectionMap): Set<string> {
  return new Set(
    Object.entries(selections)
      .filter(([, image]) => Boolean(image))
      .map(([id]) => id),
  )
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function dataUrlToFile(
  dataUrl: string,
  name: string,
  type: string,
): File {
  const [header, base64] = dataUrl.split(',')
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? type
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], name, { type: mimeType })
}
