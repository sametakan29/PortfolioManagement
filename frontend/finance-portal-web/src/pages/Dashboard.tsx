/**
 * Dashboard Sayfası
 * 
 * Ana sayfa - Finans portalının genel durumunu gösteren özet bilgiler.
 * Tüm veriler API üzerinden çekilir, mockup veri kullanılmaz.
 * 
 * Gösterilen bilgiler:
 * - USD/TRY ve EUR/TRY döviz kurları
 * - Hisse senedi sayısı ve toplam haber sayısı
 * - Son haberler önizlemesi
 */

import { Container, Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material'
import { TrendingUp, CurrencyExchange, Newspaper } from '@mui/icons-material'
import { useForexRates, useNews } from '../hooks/useFinanceData'

export default function Dashboard() {
    // API'den döviz kurlarını çek (5 dakika cache)
    const { data: forexRates, isLoading: forexLoading, error: forexError } = useForexRates()

    // API'den haberleri çek (2 dakika cache)
    const { data: newsData, isLoading: newsLoading, error: newsError } = useNews(0, 5)

    // USD ve EUR kurlarını al
    const usdRate = forexRates?.['USD']
    const eurRate = forexRates?.['EUR']

    // Hata durumu
    const hasError = forexError || newsError

    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Dashboard
            </Typography>

            {/* Hata Durumu */}
            {hasError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Bazı veriler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.
                </Alert>
            )}

            {/* Özet Kartları */}
            <Grid container spacing={3}>
                {/* USD/TRY Kartı */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <CurrencyExchange color="success" />
                                <Typography color="textSecondary" variant="body2">
                                    USD/TRY
                                </Typography>
                            </Box>
                            {forexLoading ? (
                                <CircularProgress size={24} />
                            ) : usdRate ? (
                                <>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        ₺{usdRate.rate.toFixed(4)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {usdRate.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Veri yok
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* EUR/TRY Kartı */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <CurrencyExchange color="info" />
                                <Typography color="textSecondary" variant="body2">
                                    EUR/TRY
                                </Typography>
                            </Box>
                            {forexLoading ? (
                                <CircularProgress size={24} />
                            ) : eurRate ? (
                                <>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        ₺{eurRate.rate.toFixed(4)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {eurRate.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Veri yok
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Döviz Sayısı Kartı */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <TrendingUp color="primary" />
                                <Typography color="textSecondary" variant="body2">
                                    Takip Edilen Döviz
                                </Typography>
                            </Box>
                            {forexLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        {forexRates ? Object.keys(forexRates).length : 0}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Aktif döviz kuru
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Haber Sayısı Kartı */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Newspaper color="warning" />
                                <Typography color="textSecondary" variant="body2">
                                    Toplam Haber
                                </Typography>
                            </Box>
                            {newsLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        {newsData?.totalElements || 0}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Finans haberi
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Son Haberler Bölümü */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Son Haberler
                </Typography>
                {newsLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : newsData?.content && newsData.content.length > 0 ? (
                    <Grid container spacing={2}>
                        {newsData.content.slice(0, 4).map((news) => (
                            <Grid item xs={12} sm={6} key={news.id}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                            {news.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            {news.source} • {new Date(news.publishedDate).toLocaleDateString('tr-TR')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Henüz haber bulunmuyor.
                    </Typography>
                )}
            </Box>
        </Container>
    )
}
