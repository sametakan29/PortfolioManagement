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
            staleTime: 3 * 60 * 1000, // 3 dakika - Backend cache'den kısa(yanılma payını azaltmak için)
            gcTime: 10 * 60 * 1000, //kullanılmayan verinin ram tut süres(kullanıcı cıktıysa 10 dk daha dursun geri donerse hızlı)
            refetchOnWindowFocus: false, //kull sekm geri donerse oto yenileme yapma
            refetchOnMount: false, //montelenmis sayfalari surekli cikarip takma cacheden gelsinler(sayfaya ileri-geri yaprsa)
            refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde refetch yapma
            retry: 1, // Hata durumunda 1 kez tekrar dene
        },
    },
})
//ana iskeleti olusturalim
ReactDOM.createRoot(document.getElementById('root')!).render(//reac roota yerlessin
    //hataları erken yakalamak icin gelistirme esnasında kullanılır
    //client=>tanstack cache tum uygulamaya veriliyor
    //browserouter=>react router icin(/login falan burad cozulur)
    //themeprov:ui icin,cssbasel:tarayıcı farkl sıfırlar temel css
    //devtools:hangi query cach,ne zaman refrs,hata var mi debug araci
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
