import { Provider } from 'mobx-react'
import { useStore } from '../store'
import { QueryClient, QueryClientProvider } from 'react-query'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './styles.css'

const queryClient = new QueryClient()

export default function App ({ Component, pageProps }) {
  const store = useStore(pageProps.initialState)

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  )
}
