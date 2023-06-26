import { QueryClient, QueryClientProvider } from 'react-query'
import { IsSsrMobileContext } from "../utils/useIsMobile";

import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './styles.css'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
        <Component {...pageProps} />
      </IsSsrMobileContext.Provider>
    </QueryClientProvider>
  )
}
