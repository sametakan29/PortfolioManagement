import React, { useState, useEffect } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Chip,
    Pagination,
    TextField,
    InputAdornment,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { newsApi, NewsDto, NewsPage } from '../services/api'

const categoryLabels: { [key: string]: string } = {//mappingtir-merkezi yöntm-temiz arayüz
    GENERAL_ECONOMY: 'Genel Ekonomi',
    STOCK_MARKET: 'Hisse Senedi',
    FOREX: 'Döviz',
    BOND: 'Tahvil',
    CRYPTO: 'Kripto Para',
    COMMODITY: 'Emtia',
    BANKING: 'Bankacılık',
    INSURANCE: 'Sigorta',
    OTHER: 'Diğer',
}

const categoryColors: { [key: string]: any } = {
    GENERAL_ECONOMY: 'primary',
    STOCK_MARKET: 'success',
    FOREX: 'warning',
    BOND: 'info',
    CRYPTO: 'secondary',
    COMMODITY: 'error',
    BANKING: 'default',
    INSURANCE: 'default',
    OTHER: 'default',
}

const News: React.FC = () => {
    const navigate = useNavigate()
    const [newsData, setNewsData] = useState<NewsPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
    const [categories, setCategories] = useState<string[]>([])

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        loadNews()
    }, [page, selectedCategory])

    const loadCategories = async () => {
        try {
            const response = await newsApi.getCategories()
            setCategories(response.data)
        } catch (err) {
            console.error('Kategoriler yüklenemedi:', err)
        }
    }

    const loadNews = async () => {
        try {
            setLoading(true)
            setError(null)

            let response
            if (searchKeyword) {
                response = await newsApi.searchNews(searchKeyword, page, 20)
            } else if (selectedCategory && selectedCategory !== 'ALL') {
                response = await newsApi.getNewsByCategory(selectedCategory, page, 20)
            } else {
                response = await newsApi.getAllNews(page, 20)
            }

            setNewsData(response.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Haberler yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setPage(0)
        loadNews()
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setSearchKeyword('')
        setPage(0)
    }

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleNewsClick = (id: number) => {
        navigate(`/news/${id}`)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                Finans Haberleri
            </Typography>

            {/* Search and Filter Section */}
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Haber ara..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Kategori</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Kategori"
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            <MenuItem value="ALL">Tümü</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {categoryLabels[category] || category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {/* News Grid */}
            {!loading && newsData && (
                <>
                    <Grid container spacing={3}>
                        {newsData.content.map((news: NewsDto) => (
                            <Grid item xs={12} sm={6} md={4} key={news.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => handleNewsClick(news.id)}
                                >
                                    {news.imageUrl && (
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={news.imageUrl}
                                            alt={news.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Chip
                                                label={categoryLabels[news.category] || news.category}
                                                color={categoryColors[news.category] || 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="h2"
                                            sx={{
                                                fontWeight: 'bold',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {news.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {news.summary || news.content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {news.source} • {formatDate(news.publishedDate)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {newsData.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={newsData.totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}

                    {/* No Results */}
                    {newsData.content.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                Haber bulunamadı
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Container>
    )
}

export default News
