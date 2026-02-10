/**
 * Finans Verileri React Query Hook'ları
 * 
 * Bu modül, tüm finans verilerini API'den çekmek için kullanılan
 * React Query hook'larını içerir.
 * 
 * Cache Stratejisi:
 * - Döviz: 3 dk cache, 2 dk background refetch (Backend: 5dk)
 * - Hisse: 7 dk cache, 5 dk refetch (Backend: 10dk)
 * - Tahvil/Fon: 50 dk cache (Backend: 60dk)
 * - VIOP: 7 dk cache (Backend: 10dk)
 * - Haberler: 2 dk cache (sık güncellenir)
 * - Kategoriler: 1 saat cache (nadiren değişir)
 * 
 * Kullanım Örneği:
 * const { data, isLoading, error } = useForexRates()
 * 
 * @module useFinanceData
 */

import { useQuery } from '@tanstack/react-query'
import { forexApi, stockApi, bondApi, viopApi, fundApi, newsApi } from '../services/api'
import type { ForexRate, StockData, StockDetailData, BondData, ViopData, FundData, NewsPage } from '../services/api'

/**
 * Döviz kurları hook'u
 * Backend'de her 5 dakikada bir güncelleniyor
 * Frontend'de 3 dakika cache'leniyor, 2 dakikada bir background'da yenileniyor
 */
export const useForexRates = () => {
    return useQuery<Record<string, ForexRate>>({
        queryKey: ['forexRates'],
        queryFn: async () => {
            const response = await forexApi.getForexRates()
            return response.data
        },
        staleTime: 3 * 60 * 1000, // 3 dakika - backend cache'den kısa (5dk)
        refetchInterval: 2 * 60 * 1000, // 2 dakikada bir background'da yenile
    })
}

/**
 * Hisse senetleri hook'u
 * Backend'de her 10 dakikada bir güncelleniyor
 * Frontend'de 7 dakika cache, 5 dakikada bir background refetch
 */
export const useStocks = (symbols?: string[]) => {
    return useQuery<Record<string, StockData>>({
        queryKey: ['stocks', symbols],
        queryFn: async () => {
            const response = await stockApi.getStocks(symbols)
            return response.data
        },
        staleTime: 7 * 60 * 1000, // 7 dakika - backend cache'den kısa (10dk)
        refetchInterval: 5 * 60 * 1000, // 5 dakikada bir yenile
    })
}

/**
 * Tekil hisse hook'u
 */
export const useStock = (symbol: string) => {
    return useQuery<StockData>({
        queryKey: ['stock', symbol],
        queryFn: async () => {
            const response = await stockApi.getStock(symbol)
            return response.data
        },
        staleTime: 7 * 60 * 1000, // 7 dakika - backend cache'den kısa (10dk)
        refetchInterval: 5 * 60 * 1000,
        enabled: !!symbol, // symbol varsa çalış
    })
}

/**
 * Hisse detay hook'u
 * Detaylı metrikler ve grafik verileri için
 */
export const useStockDetail = (symbol: string) => {
    return useQuery<StockDetailData>({
        queryKey: ['stockDetail', symbol],
        queryFn: async () => {
            const response = await stockApi.getStockDetails(symbol)
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 dakika
        refetchInterval: 5 * 60 * 1000,
        enabled: !!symbol, // symbol varsa çalış
    })
}

/**
 * Tahvil verileri hook'u
 * Backend'de her saat başı güncelleniyor
 * Frontend'de 50 dakika cache, 45 dakikada bir refetch
 */
export const useBonds = () => {
    return useQuery<BondData[]>({
        queryKey: ['bonds'],
        queryFn: async () => {
            const response = await bondApi.getBonds()
            return response.data
        },
        staleTime: 50 * 60 * 1000, // 50 dakika - backend cache'den kısa (60dk)
        refetchInterval: 45 * 60 * 1000, // 45 dakika
    })
}

/**
 * VIOP verileri hook'u
 * Backend'de her 10 dakikada bir güncelleniyor
 */
export const useViopData = () => {
    return useQuery<ViopData[]>({
        queryKey: ['viop'],
        queryFn: async () => {
            const response = await viopApi.getViopInstruments()
            return response.data
        },
        staleTime: 7 * 60 * 1000, // 7 dakika - backend cache'den kısa (10dk)
        refetchInterval: 5 * 60 * 1000,
    })
}

/**
 * Fon verileri hook'u
 * Backend'de her saat başı güncelleniyor
 */
export const useFunds = () => {
    return useQuery<FundData[]>({
        queryKey: ['funds'],
        queryFn: async () => {
            const response = await fundApi.getFunds()
            return response.data
        },
        staleTime: 50 * 60 * 1000, // 50 dakika - backend cache'den kısa (60dk)
        refetchInterval: 45 * 60 * 1000, // 45 dakika
    })
}

/**
 * Haberler hook'u - Paginated
 * Backend'de RSS her 30 dakikada bir çekiliyor
 * Frontend'de 2 dakika cache (haberler daha sık değişebilir)
 */
export const useNews = (page: number = 0, size: number = 20) => {
    return useQuery<NewsPage>({
        queryKey: ['news', page, size],
        queryFn: async () => {
            const response = await newsApi.getAllNews(page, size)
            return response.data
        },
        staleTime: 2 * 60 * 1000, // 2 dakika
        refetchInterval: 5 * 60 * 1000, // 5 dakikada bir kontrol et
    })
}

/**
 * Kategoriye göre haberler
 */
export const useNewsByCategory = (category: string, page: number = 0, size: number = 20) => {
    return useQuery<NewsPage>({
        queryKey: ['news', 'category', category, page, size],
        queryFn: async () => {
            const response = await newsApi.getNewsByCategory(category, page, size)
            return response.data
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
        enabled: !!category && category !== 'ALL', // Kategori geçerliyse çalış
    })
}

/**
 * Haber arama
 */
export const useSearchNews = (keyword: string, page: number = 0, size: number = 20) => {
    return useQuery<NewsPage>({
        queryKey: ['news', 'search', keyword, page, size],
        queryFn: async () => {
            const response = await newsApi.searchNews(keyword, page, size)
            return response.data
        },
        staleTime: 1 * 60 * 1000, // Arama sonuçları 1 dakika
        enabled: keyword.length > 0, // Keyword varsa çalış
    })
}

/**
 * Kategoriler listesi
 */
export const useNewsCategories = () => {
    return useQuery<string[]>({
        queryKey: ['newsCategories'],
        queryFn: async () => {
            const response = await newsApi.getCategories()
            return response.data
        },
        staleTime: 60 * 60 * 1000, // Kategoriler nadiren değişir - 1 saat
    })
}

/**
 * Tekil haber detayı
 */
export const useNewsDetail = (id: number) => {
    return useQuery({
        queryKey: ['news', id],
        queryFn: async () => {
            const response = await newsApi.getNewsById(id)
            return response.data
        },
        staleTime: 10 * 60 * 1000, // 10 dakika
        enabled: !!id && id > 0,
    })
}
