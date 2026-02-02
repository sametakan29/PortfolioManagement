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

import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box, CircularProgress, Alert, Chip, Stack } from '@mui/material'
import { TrendingUp, CurrencyExchange, Newspaper, ShowChart, AccountBalance, CurrencyBitcoin } from '@mui/icons-material'
import { useForexRates, useNews } from '../hooks/useFinanceData'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
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

                {/* Haber Özet Kartı */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardActionArea onClick={() => navigate('/news')} sx={{ height: '100%' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Newspaper color="warning" />
                                    <Typography color="textSecondary" variant="body2">
                                        Son Haberler
                                    </Typography>
                                </Box>
                                {newsLoading ? (
                                    <CircularProgress size={24} />
                                ) : newsData?.content?.[0] ? (
                                    <>
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                            {newsData.content[0].title}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(newsData.content[0].publishedDate).toLocaleDateString('tr-TR')}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        Haber bulunamadı
                                    </Typography>
                                )}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>

            {/* Hızlı Erişim */}
            <Box sx={{ mt: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Hızlı Erişim</Typography>
                    <Chip label="Kısayollar" size="small" color="primary" variant="outlined" />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardActionArea onClick={() => navigate('/stocks')}>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <ShowChart color="primary" />
                                        <Typography fontWeight={600}>Hisseler</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Güncel hisseleri incele
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardActionArea onClick={() => navigate('/forex')}>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CurrencyExchange color="success" />
                                        <Typography fontWeight={600}>Döviz</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Anlık kurları takip et
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardActionArea onClick={() => navigate('/portfolio')}>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <AccountBalance color="info" />
                                        <Typography fontWeight={600}>Portföy</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Varlıklarını görüntüle
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardActionArea onClick={() => navigate('/crypto')}>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CurrencyBitcoin color="warning" />
                                        <Typography fontWeight={600}>Kripto</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Kripto piyasasına göz at
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

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
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)',
                                            borderColor: 'rgba(27, 77, 255, 0.4)',
                                        },
                                    }}
                                >
                                    <CardActionArea onClick={() => navigate(`/news/${news.id}`)}>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                {news.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                {news.source} • {new Date(news.publishedDate).toLocaleDateString('tr-TR')}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
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
