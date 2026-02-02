/**
 * API Servis Modülü
 * 
 * Bu modül, backend API ile iletişim kurmak için kullanılan tüm HTTP istemci
 * fonksiyonlarını içerir. Axios kullanılarak merkezi bir API istemcisi oluşturulmuştur.
 * 
 * Özellikler:
 * - JWT token ile otomatik yetkilendirme (Bearer token)
 * - 401 hatalarında otomatik token temizleme
 * - Döviz, hisse, tahvil, VIOP, fon ve haber API'leri
 * 
 * Kullanım: İlgili API fonksiyonlarını import ederek kullanın
 * Örnek: import { newsApi, forexApi } from './api'
 */

import axios from 'axios'

/**
 * Merkezi Axios istemcisi
 * - Base URL: Environment değişkeninden veya '/api' prefix'i
 * - Content-Type: JSON
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Request Interceptor
 * Her HTTP isteğine otomatik olarak JWT token ekler.
 * Token localStorage'dan 'access_token' key'i ile alınır.
 */
apiClient.interceptors.request.use(
    (config) => {
        // LocalStorage'dan JWT token'ı al
        const token = localStorage.getItem('access_token')
        if (token) {
            // Authorization header'ına Bearer token ekle
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Response Interceptor
 * HTTP yanıtlarını işler ve hata durumlarını yönetir.
 * 401 Unauthorized hatası durumunda token otomatik temizlenir.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 hatası: Oturum süresi dolmuş veya geçersiz token
        if (error.response?.status === 401) {
            // Token'ı localStorage'dan temizle
            localStorage.removeItem('access_token')
            // NOT: Login sayfası entegre edildiğinde yönlendirme eklenecek
            console.warn('401 Unauthorized - Token temizlendi')
        }
        return Promise.reject(error)
    }
)

// News API Types
export interface NewsCategory {
    name: string
    displayName: string
}

export interface NewsDto {
    id: number
    title: string
    content: string
    summary: string
    source: string
    sourceUrl: string
    imageUrl: string
    category: string
    publishedDate: string
    createdDate: string
}

export interface NewsPage {
    content: NewsDto[]
    totalElements: number
    totalPages: number
    size: number
    number: number
}

export interface NewsCreateDto {
    title: string
    content: string
    summary: string
    source: string
    sourceUrl?: string
    imageUrl?: string
    category: string
    publishedDate: string
}

// News API Functions
export const newsApi = {
    getAllNews: (page: number = 0, size: number = 20) =>
        apiClient.get<NewsPage>(`/news?page=${page}&size=${size}`),

    getNewsById: (id: number) =>
        apiClient.get<NewsDto>(`/news/${id}`),

    getNewsByCategory: (category: string, page: number = 0, size: number = 20) =>
        apiClient.get<NewsPage>(`/news/category/${category}?page=${page}&size=${size}`),

    searchNews: (keyword: string, page: number = 0, size: number = 20) =>
        apiClient.get<NewsPage>(`/news/search?keyword=${keyword}&page=${page}&size=${size}`),

    getRecentNews: (days: number = 7) =>
        apiClient.get<NewsDto[]>(`/news/recent?days=${days}`),

    getCategories: () =>
        apiClient.get<string[]>(`/news/categories`),

    createNews: (data: NewsCreateDto) =>
        apiClient.post<NewsDto>(`/news`, data),

    updateNews: (id: number, data: NewsCreateDto) =>
        apiClient.put<NewsDto>(`/news/${id}`, data),

    deleteNews: (id: number) =>
        apiClient.delete(`/news/${id}`),
}

// Forex API Types
export interface ForexRate {
    code: string
    name: string
    rate: number
    buyRate: number
    sellRate: number
    timestamp: string
}

export interface ExchangeRateApiResponse {
    result: string
    documentation: string
    terms_of_use: string
    time_last_update_unix: number
    time_last_update_utc: string
    time_next_update_unix: number
    time_next_update_utc: string
    base_code: string
    conversion_rates: Record<string, number>
}

// Stock API Types
export interface StockData {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap: number
    timestamp: string
}

// Bond API Types
export interface BondData {
    symbol: string
    name: string
    type: string
    price: number
    yield: number
    couponRate: number
    maturityDate: string
    timestamp: string
}

// VIOP API Types
export interface ViopData {
    symbol: string
    name: string
    type: string
    price: number
    change: number
    changePercent: number
    volume: number
    openInterest: number
    expiryDate: string
    timestamp: string
}

// Fund API Types
export interface FundData {
    code: string
    name: string
    type: string
    price: number
    change: number
    changePercent: number
    totalAssets: number
    yearReturn: number
    timestamp: string
}

// Forex API Functions
const EXCHANGE_RATE_API_KEY = '75fc64dc8d2bb1b09f1c0da0'
const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6'

export const forexApi = {
    getForexRates: async () => {
        try {
            const response = await axios.get<ExchangeRateApiResponse>(
                `${EXCHANGE_RATE_BASE_URL}/${EXCHANGE_RATE_API_KEY}/latest/TRY`
            )

            if (response.data.result === 'success') {
                const forexRates: Record<string, ForexRate> = {}

                const knownNames: Record<string, string> = {
                    'USD': 'Amerikan Doları',
                    'EUR': 'Euro',
                    'GBP': 'İngiliz Sterlini',
                    'CHF': 'İsviçre Frangı',
                    'CAD': 'Kanada Doları',
                    'AUD': 'Avustralya Doları',
                    'JPY': 'Japon Yeni',
                    'SAR': 'Suudi Arabistan Riyali',
                    'RUB': 'Rus Rublesi',
                    'KWD': 'Kuveyt Dinarı'
                }

                Object.entries(response.data.conversion_rates).forEach(([code, rate]) => {
                    if (!rate) return
                    // TRY bazlı olduğu için ters çeviriyoruz (1 USD = X TRY)
                    const tryRate = 1 / rate
                    forexRates[code] = {
                        code,
                        name: knownNames[code] ?? code,
                        rate: tryRate,
                        buyRate: tryRate * 0.998, // %0.2 spread ile alış
                        sellRate: tryRate * 1.002, // %0.2 spread ile satış
                        timestamp: response.data.time_last_update_utc
                    }
                })

                return { data: forexRates }
            }
            throw new Error('API response failed')
        } catch (error) {
            console.error('Forex rates fetch error:', error)
            throw error
        }
    },
}

// Stock API Functions
export const stockApi = {
    getStocks: (symbols?: string[]) =>
        apiClient.get<Record<string, StockData>>('/stocks', {
            params: symbols ? { symbols } : undefined
        }),
    getStock: (symbol: string) =>
        apiClient.get<StockData>(`/stocks/${symbol}`),
}

// Bond API Functions
export const bondApi = {
    getBonds: () =>
        apiClient.get<BondData[]>('/bonds'),
}

// VIOP API Functions
export const viopApi = {
    getViopInstruments: () =>
        apiClient.get<ViopData[]>('/viop'),
}

// Fund API Functions
export const fundApi = {
    getFunds: () =>
        apiClient.get<FundData[]>('/funds'),
}
