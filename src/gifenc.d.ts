declare module 'gifenc' {
  export type GifPalette = number[]

  export function GIFEncoder(): {
    bytes(): Uint8Array
    finish(): void
    writeFrame(
      indexedFrame: Uint8Array,
      width: number,
      height: number,
      options: {
        delay?: number
        palette: GifPalette
        repeat?: number
      },
    ): void
  }

  export function applyPalette(
    frame: Uint8Array,
    palette: GifPalette,
    format?: string,
  ): Uint8Array

  export function quantize(
    frame: Uint8Array,
    maxColors: number,
    options?: { format?: string },
  ): GifPalette
}
