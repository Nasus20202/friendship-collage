import { useEffect, useRef, useState } from 'react'
import { isAcceptedImage, missingCategoryNames } from '../categories'
import { selectedIdSet } from '../media'
import type { SelectionMap } from '../media'
import {
  loadCategories,
  loadSelections,
  removeSelection,
  saveCategories,
  saveSelection,
} from '../storage'

function loadInitialState() {
  const categories = loadCategories()
  return {
    categories,
  }
}

export function useCollageState(
  onStatus: (message: string, type: 'error' | 'success') => void,
) {
  const [initialState] = useState(loadInitialState)
  const [categories, setCategories] = useState(initialState.categories)
  const [selections, setSelections] = useState<SelectionMap>({})
  const initialCategories = useRef(initialState.categories)
  const onStatusRef = useRef(onStatus)
  const previews = useRef(new Set<string>())
  const missing = missingCategoryNames(categories, selectedIdSet(selections))

  useEffect(() => {
    onStatusRef.current = onStatus
  }, [onStatus])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    const previewUrls = previews.current

    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url)
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const storedSelections = await loadSelections(initialCategories.current)
        if (cancelled) {
          revokeSelections(storedSelections)
          return
        }
        for (const selected of Object.values(storedSelections)) {
          if (selected) previews.current.add(selected.previewUrl)
        }
        setSelections(storedSelections)
      } catch {
        if (!cancelled) {
          onStatusRef.current('Saved images could not be loaded.', 'error')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  function renameCategory(categoryId: string, name: string) {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
      ),
    )
  }

  async function selectImage(categoryId: string, fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return

    if (!isAcceptedImage(file)) {
      onStatus(`${file.name} is not a supported image type.`, 'error')
      return
    }

    let saved = true
    try {
      await saveSelection(categoryId, file)
    } catch {
      saved = false
      onStatus(
        'Image selected, but it could not be saved for next time.',
        'error',
      )
    }

    const previewUrl = URL.createObjectURL(file)
    previews.current.add(previewUrl)
    setSelections((current) => {
      const previous = current[categoryId]
      if (previous) {
        if (previous.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previous.previewUrl)
        }
        previews.current.delete(previous.previewUrl)
      }

      return {
        ...current,
        [categoryId]: { file, previewUrl },
      }
    })
    if (saved) {
      onStatus('Image selected. You can replace it anytime.', 'success')
    }
  }

  function removeImage(categoryId: string) {
    void removeSelection(categoryId).catch(() => {
      onStatus(
        'Image removed, but saved storage could not be updated.',
        'error',
      )
    })

    setSelections((current) => {
      const previous = current[categoryId]
      if (previous?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previous.previewUrl)
      }
      if (previous) {
        previews.current.delete(previous.previewUrl)
      }

      return {
        ...current,
        [categoryId]: undefined,
      }
    })
    onStatus('Image removed.', 'success')
  }

  return {
    categories,
    missing,
    removeImage,
    renameCategory,
    selectImage,
    selections,
  }
}

function revokeSelections(selections: SelectionMap) {
  for (const selected of Object.values(selections)) {
    if (selected?.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selected.previewUrl)
    }
  }
}
