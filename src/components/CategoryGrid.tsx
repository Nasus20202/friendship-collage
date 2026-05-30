import type { Category } from '../categories'
import type { SelectionMap } from '../media'
import { CategoryCard } from './CategoryCard'

type CategoryGridProps = {
  categories: readonly Category[]
  onImageChange: (categoryId: string, fileList: FileList | null) => void
  onRename: (categoryId: string, name: string) => void
  onRemoveImage: (categoryId: string) => void
  selections: SelectionMap
}

export function CategoryGrid({
  categories,
  onImageChange,
  onRename,
  onRemoveImage,
  selections,
}: CategoryGridProps) {
  return (
    <section className="category-grid" aria-label="Collage categories">
      {categories.map((category, index) => (
        <CategoryCard
          category={category}
          index={index}
          key={category.id}
          onImageChange={onImageChange}
          onRename={onRename}
          onRemoveImage={onRemoveImage}
          selected={selections[category.id]}
        />
      ))}
    </section>
  )
}
