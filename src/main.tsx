import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { store } from './store/index.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response?.status === 429) return false;
        return failureCount < 2;
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A27',
              color: '#F0F0FF',
              border: '1px solid #2A2A45',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6C63FF', secondary: '#F0F0FF' } },
            error: { iconTheme: { primary: '#FF6B9D', secondary: '#F0F0FF' } },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
