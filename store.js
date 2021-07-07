import { useMemo } from 'react'
import { types, applySnapshot } from 'mobx-state-tree'
import { createContext } from 'react'
import { action, decorate, observable, computed } from 'mobx'

let store

const Book = types.model({
  id: types.string,
  name: types.string,
  chapters: types.array(types.integer)
})

const Bible = types.model({
  id: types.string,
  abbreviation: types.string,
  name: types.string,
  books: types.array(Book)
})

const TopicTitle = types.model({
  _id: types.string,
  title: types.string,
  order: types.integer
})

const TopicTag = types.model({
  tagName: types.string,
  topicName: types.string,
  id: types.string
})

const Store = types
  .model({
    user: types.optional(types.string, ''),
    token: types.optional(types.string, ''),
    bibles: types.array(Bible),
    topicTitles: types.array(TopicTitle),
    topicTags: types.array(TopicTag)
  })
  .actions(self => {
    function setUser (_user) {
      self.user = _user
    }
    function setToken (_token) {
      self.token = _token
    }
    function setBibles (_bibles) {
      self.bibles = _bibles
    }
    function setTopicTitles (_topicTitles) {
      self.topicTitles = _topicTitles
    }
    function setTopicTags (_topicTags) {
      self.topicTags = _topicTags
    }

    return { setUser, setToken, setBibles, setTopicTitles, setTopicTags }
  })

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

  return createContext(observable(store))
}

export function useStore (initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
