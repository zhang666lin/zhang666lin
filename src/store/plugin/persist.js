import { createPersistedState } from 'pinia-plugin-persistedstate'

export function registerPiniaPersistPlugin(pinia) {
  const keyPrefix = import.meta.env.VITE_APP_TITLE
  pinia.use(
    createPersistedState({
      storage: localStorage,
      key: id => `${keyPrefix}__${id}`,
      serializer: {
        deserialize: value => {
          return JSON.parse(value)
        },
        serialize: value => {
          return JSON.stringify(value)
        },
      },
    }),
  )
}
