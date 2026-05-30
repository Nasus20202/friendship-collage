import { createCategories } from './categories'
import type { Category } from './categories'
import { dataUrlToFile } from './media'
import type { PersistedSelectionMap, SelectionMap } from './media'

const categoryStorageKey = 'friendship-collage:categories'
const legacySelectionStorageKey = 'friendship-collage:selections'
const dbName = 'friendship-collage'
const dbVersion = 1
const selectionStoreName = 'selections'

type SelectionRecord = {
  categoryId: string
  name: string
  type: string
  file: File
}

type LegacyPersistedSelectionMap = Record<
  string,
  | {
      name: string
      type: string
      dataUrl: string
    }
  | undefined
>

export function loadCategories(): Category[] {
  const stored = readJson<string[]>(categoryStorageKey)
  return createCategories(stored ?? undefined)
}

export function saveCategories(categories: readonly Category[]): void {
  localStorage.setItem(
    categoryStorageKey,
    JSON.stringify(categories.map((category) => category.name)),
  )
}

export async function loadSelections(
  categories: readonly Category[],
): Promise<SelectionMap> {
  const stored = await loadPersistedSelections()

  const selections: SelectionMap = {}
  for (const category of categories) {
    const selected = stored[category.id]
    if (selected) {
      selections[category.id] = {
        file: selected.file,
        previewUrl: URL.createObjectURL(selected.file),
      }
    }
  }

  return selections
}

export async function loadPersistedSelections(): Promise<PersistedSelectionMap> {
  const db = await openSelectionDb()
  let records = await requestToPromise<SelectionRecord[]>(
    db
      .transaction(selectionStoreName, 'readonly')
      .objectStore(selectionStoreName)
      .getAll(),
  )

  const legacySelections = readJson<LegacyPersistedSelectionMap>(
    legacySelectionStorageKey,
  )
  if (legacySelections) {
    if (records.length === 0) {
      records = Object.entries(legacySelections).flatMap(
        ([categoryId, selected]) => {
          if (!selected) return []
          return [
            {
              categoryId,
              file: dataUrlToFile(
                selected.dataUrl,
                selected.name,
                selected.type,
              ),
              name: selected.name,
              type: selected.type,
            },
          ]
        },
      )
      await saveSelectionRecords(db, records)
    }
    localStorage.removeItem(legacySelectionStorageKey)
  }

  db.close()

  return Object.fromEntries(
    records.map((record) => [
      record.categoryId,
      { file: record.file, name: record.name, type: record.type },
    ]),
  )
}

export async function saveSelection(
  categoryId: string,
  file: File,
): Promise<void> {
  const db = await openSelectionDb()
  await saveSelectionRecords(db, [
    { categoryId, file, name: file.name, type: file.type },
  ])
  db.close()
}

async function saveSelectionRecords(
  db: IDBDatabase,
  records: SelectionRecord[],
): Promise<void> {
  const transaction = db.transaction(selectionStoreName, 'readwrite')
  const store = transaction.objectStore(selectionStoreName)
  for (const record of records) {
    store.put(record)
  }
  await transactionToPromise(transaction)
}

export async function removeSelection(categoryId: string): Promise<void> {
  const db = await openSelectionDb()
  const transaction = db.transaction(selectionStoreName, 'readwrite')
  transaction.objectStore(selectionStoreName).delete(categoryId)
  await transactionToPromise(transaction)
  db.close()
}

function readJson<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

function openSelectionDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion)

    request.addEventListener('upgradeneeded', () => {
      const db = request.result
      if (!db.objectStoreNames.contains(selectionStoreName)) {
        db.createObjectStore(selectionStoreName, { keyPath: 'categoryId' })
      }
    })

    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Could not open image storage.'))
    })
  })
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => {
      reject(request.error ?? new Error('Could not read image storage.'))
    })
  })
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve())
    transaction.addEventListener('abort', () => {
      reject(transaction.error ?? new Error('Could not update image storage.'))
    })
    transaction.addEventListener('error', () => {
      reject(transaction.error ?? new Error('Could not update image storage.'))
    })
  })
}
