import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token')
            window.location.href = '/login'
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
