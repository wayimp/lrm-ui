import { QueryClient, QueryClientProvider } from 'react-query'

import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './styles.css'

const queryClient = new QueryClient()

export default function App ({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
