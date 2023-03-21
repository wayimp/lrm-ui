import { QueryClient, QueryClientProvider } from 'react-query'

import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './styles.css'

const queryClient = new QueryClient()

export default function App ({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
