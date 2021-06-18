import { useMemo } from 'react'
import { types, applySnapshot } from 'mobx-state-tree'

let store

const Chapter = types.model({
  id: types.string,
  bibleId: types.string,
  bookId: types.string,
  number: types.string,
  position: types.number
})

const Book = types.model({
  id: types.string,
  bibleId: types.string,
  abbreviation: types.string,
  name: types.string,
  nameLong: types.string,
  chapters: types.array(Chapter)
})

const Bible = types.model({
  id: types.string,
  abbreviation: types.string,
  name: types.string,
  books: types.array(Book)
})

const Store = types
  .model({
    user: types.optional(types.string, ''),
    bibles: types.array(Bible)
  })
  .actions(self => ({
    setUser (_user) {
      self.user = _user
    },
    setBibles (_bibles) {
      self.bibles = _bibles
    }
  }))

export function initializeStore (snapshot = null) {
  const _store = store ?? Store.create({ lastUpdate: 0 })

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot)
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return store
}

export function useStore (initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
