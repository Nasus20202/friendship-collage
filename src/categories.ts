export type Category = {
  id: string
  name: string
}

export const defaultCategoryNames = [
  'animal',
  'place',
  'flower',
  'personality',
  'season',
  'hobby',
  'color',
  'drink',
  'food',
] as const

export const acceptedImageTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const

export function createCategories(
  names: readonly string[] = defaultCategoryNames,
): Category[] {
  const cleanNames = names.map((name) => name.trim()).filter(Boolean)
  const categoryNames =
    cleanNames.length === 9 ? cleanNames : [...defaultCategoryNames]

  return categoryNames.map((name, index) => ({
    id: `category-${index}`,
    name,
  }))
}

export function isAcceptedImage(file: File): boolean {
  return acceptedImageTypes.includes(
    file.type as (typeof acceptedImageTypes)[number],
  )
}

export function missingCategoryNames(
  categories: readonly Category[],
  selectedIds: ReadonlySet<string>,
): string[] {
  return categories
    .filter((category) => !selectedIds.has(category.id))
    .map((category) => category.name)
}
