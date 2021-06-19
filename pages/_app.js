import { Provider } from 'mobx-react'
import { useStore } from '../store'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './styles.css'

export default function App ({ Component, pageProps }) {
  const store = useStore(pageProps.initialState)

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
