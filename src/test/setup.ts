import '@testing-library/jest-dom/vitest'

if (!globalThis.localStorage && globalThis.window?.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: globalThis.window.localStorage,
  })
}

if (!globalThis.localStorage) {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    },
  })
}

if (!globalThis.indexedDB) {
  const stores = new Map<string, Map<IDBValidKey, unknown>>()

  Object.defineProperty(globalThis, 'indexedDB', {
    value: {
      deleteDatabase(name: string) {
        const request = createRequest(undefined)
        queueMicrotask(() => {
          stores.delete(name)
          request.dispatch('success')
        })
        return request
      },
      open(name: string) {
        const request = createRequest<IDBDatabase | undefined>(undefined)
        queueMicrotask(() => {
          const store = stores.get(name) ?? new Map<IDBValidKey, unknown>()
          const db = createDb(store)
          if (!stores.has(name)) {
            stores.set(name, store)
            request.result = db
            request.dispatch('upgradeneeded')
          }
          request.result = db
          request.dispatch('success')
        })
        return request
      },
    },
  })
}

function createDb(storeValues: Map<IDBValidKey, unknown>): IDBDatabase {
  return {
    close: () => undefined,
    createObjectStore: () => createStore(storeValues),
    objectStoreNames: {
      contains: () => true,
    },
    transaction: () => {
      const transaction = createTransaction()
      queueMicrotask(() => completeTransaction(transaction))
      return {
        ...transaction,
        objectStore: () => createStore(storeValues),
      }
    },
  } as unknown as IDBDatabase

  function completeTransaction(transaction: TestTransaction) {
    queueMicrotask(() => transaction.dispatch('complete'))
  }
}

type TestTransaction = IDBTransaction & {
  dispatch: (type: string) => void
}

function createStore(values: Map<IDBValidKey, unknown>): IDBObjectStore {
  return {
    delete: (key: IDBValidKey) => {
      values.delete(key)
      return createRequest(undefined)
    },
    get: (key: IDBValidKey) => {
      const request = createRequest(values.get(key))
      queueMicrotask(() => request.dispatch('success'))
      return request
    },
    getAll: () => {
      const request = createRequest(Array.from(values.values()))
      queueMicrotask(() => request.dispatch('success'))
      return request
    },
    put: (value: { categoryId: IDBValidKey }) => {
      values.set(value.categoryId, value)
      return createRequest(value.categoryId)
    },
  } as unknown as IDBObjectStore
}

function createTransaction(): TestTransaction {
  const listeners = new Map<string, Array<() => void>>()
  return {
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      const callback =
        typeof listener === 'function'
          ? listener
          : listener.handleEvent.bind(listener)
      listeners.set(type, [
        ...(listeners.get(type) ?? []),
        callback as () => void,
      ])
    },
    dispatch: (type: string) => {
      for (const listener of listeners.get(type) ?? []) listener()
    },
    error: null,
  } as TestTransaction
}

function createRequest<T>(initialResult: T): IDBRequest<T> & {
  dispatch: (type: string) => void
  result: T
} {
  const listeners = new Map<string, Array<() => void>>()
  return {
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      const callback =
        typeof listener === 'function'
          ? listener
          : listener.handleEvent.bind(listener)
      listeners.set(type, [
        ...(listeners.get(type) ?? []),
        callback as () => void,
      ])
    },
    dispatch: (type: string) => {
      for (const listener of listeners.get(type) ?? []) listener()
    },
    error: null,
    result: initialResult,
  } as IDBRequest<T> & { dispatch: (type: string) => void; result: T }
}
