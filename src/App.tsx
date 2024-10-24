import React from 'react'
import { useRoutes } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import routes from './routes'
import { Provider } from 'react-redux'
import { store } from './Store/Store'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import './utils.css'
import { AppProvider } from './Services/ContextApi/AppContext'
import { FormDataProvider } from './Services/ContextApi/FormDataContext'
import { PrimeReactProvider } from 'primereact/api'
const queryClient = new QueryClient()
const App: React.FC = () => {
  const allPages = useRoutes(routes)
  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Poppins', sans-serif",
    },
  }

  return (
    <>
      <Provider store={store}>
        <PrimeReactProvider value={{ cssTransition: true }}>
          <QueryClientProvider client={queryClient}>
            <AppProvider>
              <FormDataProvider>
                <Toaster toastOptions={toasterOptions} />
                {allPages}
                <ToastContainer hideProgressBar autoClose={2000} position="top-right" />
              </FormDataProvider>
            </AppProvider>
          </QueryClientProvider>
        </PrimeReactProvider>
      </Provider>
    </>
  )
}
export default App
