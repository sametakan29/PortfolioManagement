import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import theme from './theme'
import './index.css'

// React Query client yapılandırması
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 dakika - Backend cache ile uyumlu
            gcTime: 10 * 60 * 1000, // 10 dakika - eski adı cacheTime
            refetchOnWindowFocus: false, // Pencere focus'unda otomatik refetch yapma
            refetchOnMount: false, // Component mount'unda refetch yapma (cache kullan)
            refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde refetch yapma
            retry: 1, // Hata durumunda 1 kez tekrar dene
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
)
