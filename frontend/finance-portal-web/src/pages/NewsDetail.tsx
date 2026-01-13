import React, { useState, useEffect } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Stack,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useParams, useNavigate } from 'react-router-dom'
import { newsApi, NewsDto } from '../services/api'

const categoryLabels: { [key: string]: string } = {
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

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [news, setNews] = useState<NewsDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadNewsDetail()
    }, [id])

    const loadNewsDetail = async () => {
        try {
            setLoading(true)
            setError(null)

            if (!id) {
                throw new Error('Haber ID bulunamadı')
            }

            const response = await newsApi.getNewsById(parseInt(id))
            setNews(response.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Haber yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
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

    const handleBack = () => {
        navigate('/news')
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 3 }}
            >
                Haberlere Dön
            </Button>

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

            {/* News Detail */}
            {!loading && news && (
                <Card sx={{ boxShadow: 3 }}>
                    {news.imageUrl && (
                        <CardMedia
                            component="img"
                            height="400"
                            image={news.imageUrl}
                            alt={news.title}
                            sx={{ objectFit: 'cover' }}
                        />
                    )}
                    <CardContent sx={{ p: 4 }}>
                        {/* Category */}
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={categoryLabels[news.category] || news.category}
                                color={categoryColors[news.category] || 'default'}
                                size="medium"
                            />
                        </Box>

                        {/* Title */}
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            {news.title}
                        </Typography>

                        {/* Meta Information */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                <strong>Kaynak:</strong> {news.source}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Tarih:</strong> {formatDate(news.publishedDate)}
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        {/* Summary */}
                        {news.summary && (
                            <Box
                                sx={{
                                    backgroundColor: 'grey.100',
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Özet
                                </Typography>
                                <Typography variant="body1">
                                    {news.summary}
                                </Typography>
                            </Box>
                        )}

                        {/* Content */}
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap',
                                mb: 3,
                            }}
                        >
                            {news.content}
                        </Typography>

                        {/* Source Link */}
                        {news.sourceUrl && (
                            <Box sx={{ mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    endIcon={<OpenInNewIcon />}
                                    href={news.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Kaynak Habere Git
                                </Button>
                            </Box>
                        )}

                        {/* Footer */}
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="caption" color="text.secondary">
                            Sistem kayıt tarihi: {formatDate(news.createdDate)}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    )
}

export default NewsDetail
