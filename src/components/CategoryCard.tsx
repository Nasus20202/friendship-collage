import type { Category } from '../categories'
import type { SelectedImage } from '../media'

type CategoryCardProps = {
  category: Category
  index: number
  onImageChange: (categoryId: string, fileList: FileList | null) => void
  onRename: (categoryId: string, name: string) => void
  onRemoveImage: (categoryId: string) => void
  selected?: SelectedImage
}

export function CategoryCard({
  category,
  index,
  onImageChange,
  onRename,
  onRemoveImage,
  selected,
}: CategoryCardProps) {
  return (
    <article className="category-card">
      <div className="category-card__topline">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{selected ? 'Selected' : 'Needed'}</strong>
      </div>
      <label className="category-name-field">
        <span>Category name</span>
        <input
          aria-label={`Edit category ${index + 1} name`}
          value={category.name}
          onChange={(event) => onRename(category.id, event.currentTarget.value)}
        />
      </label>
      <div className="image-actions">
        <label className="image-picker">
          <input
            aria-label={`Choose image for ${category.name}`}
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            type="file"
            onChange={(event) =>
              onImageChange(category.id, event.currentTarget.files)
            }
          />
          <span>{selected ? 'Replace image' : 'Choose image'}</span>
        </label>
        {selected ? (
          <button
            className="remove-image-button"
            onClick={() => onRemoveImage(category.id)}
            type="button"
          >
            Remove image
          </button>
        ) : null}
      </div>
      {selected ? (
        <div className="category-card__preview-wrap">
          <img
            className="category-card__preview"
            src={selected.previewUrl}
            alt={`${category.name} preview`}
          />
        </div>
      ) : (
        <div className="category-card__empty">Drop in a memory</div>
      )}
    </article>
  )
}
