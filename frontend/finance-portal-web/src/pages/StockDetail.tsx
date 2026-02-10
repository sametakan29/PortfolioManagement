import { useEffect } from 'react'
import { 
    Container, 
    Typography, 
    Paper, 
    Box, 
    Button, 
    Chip,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from '@mui/material'
import { 
    ArrowBack, 
    ShowChart, 
    TrendingUp, 
    TrendingDown,
    Timeline,
    Assessment,
    AccessTime
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useStockDetail } from '../hooks/useFinanceData'

export default function StockDetail() {
    const navigate = useNavigate()
    const { symbol } = useParams()
    const { data: stockDetail, isLoading, error } = useStockDetail(symbol?.toLowerCase() || '')

    useEffect(() => {
        if (symbol) {
            document.title = `${symbol.toUpperCase()} - Portfolio Management`
        }
    }, [symbol])

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={60} />
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Geri
                </Button>
                <Alert severity="error">
                    Hisse detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </Alert>
            </Container>
        )
    }

    if (!stockDetail) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Geri
                </Button>
                <Alert severity="warning">
                    Hisse bilgisi bulunamadı.
                </Alert>
            </Container>
        )
    }

    const isPositive = stockDetail.changePercent >= 0

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Geri
            </Button>

            {/* Header Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <ShowChart color="primary" fontSize="large" />
                            <Typography variant="h4" fontWeight={700}>
                                {stockDetail.symbol.toUpperCase()}
                            </Typography>
                        </Box>
                        <Typography variant="h6" color="text.secondary">
                            {stockDetail.name}
                        </Typography>
                    </Box>
                    
                    <Box textAlign={{ xs: 'left', md: 'right' }}>
                        <Typography variant="h3" fontWeight={700} color="primary">
                            ₺{stockDetail.price.toFixed(2)}
                        </Typography>
                        <Chip
                            icon={isPositive ? <TrendingUp /> : <TrendingDown />}
                            label={`${isPositive ? '+' : ''}${stockDetail.changePercent.toFixed(2)}% (₺${stockDetail.change.toFixed(2)})`}
                            color={isPositive ? 'success' : 'error'}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Stack>

                <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                        Son güncelleme: {new Date(stockDetail.timestamp).toLocaleString('tr-TR')}
                    </Typography>
                </Box>
            </Paper>

            {/* Key Metrics Grid */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Açılış
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                                ₺{stockDetail.open.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Önceki Kapanış
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                                ₺{stockDetail.previousClose.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Gün Yüksek
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="success.main">
                                ₺{stockDetail.high.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                Gün Düşük
                            </Typography>
                            <Typography variant="h6" fontWeight={600} color="error.main">
                                ₺{stockDetail.low.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Additional Metrics */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Hacim Bilgileri
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    İşlem Hacmi
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {(stockDetail.volume / 1000000).toFixed(2)}M
                                </Typography>
                            </Grid>
                            {stockDetail.averageVolume && (
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Ortalama Hacim
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {(stockDetail.averageVolume / 1000000).toFixed(2)}M
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                    Piyasa Değeri
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    ₺{(stockDetail.marketCap / 1000000000).toFixed(2)}B
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Değerleme Metrikleri
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            {stockDetail.peRatio && (
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        F/K Oranı
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {stockDetail.peRatio.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                            {stockDetail.eps && (
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Hisse Başı Kazanç
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        ₺{stockDetail.eps.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                            {stockDetail.dividendYield && (
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Temettü Verimi
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {stockDetail.dividendYield.toFixed(2)}%
                                    </Typography>
                                </Grid>
                            )}
                            {stockDetail.beta && (
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Beta
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {stockDetail.beta.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Price Range */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Timeline color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                Gün İçi Aralık
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            {stockDetail.dayRange}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Assessment color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                52 Hafta Aralık
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            {stockDetail.yearRange}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Sector and Industry */}
            {(stockDetail.sector || stockDetail.industry) && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Şirket Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {stockDetail.sector && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Sektör
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {stockDetail.sector}
                                </Typography>
                            </Grid>
                        )}
                        {stockDetail.industry && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Endüstri
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {stockDetail.industry}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Chart Placeholder with Lazy Loading */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Fiyat Grafiği
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="300px"
                    sx={{ 
                        backgroundColor: 'action.hover',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'divider'
                    }}
                >
                    <Box textAlign="center">
                        <CircularProgress size={40} sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Grafik yükleniyor...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            (Backend entegrasyonu tamamlandığında grafik burada görünecek)
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* News Section Placeholder */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    İlgili Haberler ve KAP Bildirimleri
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                    sx={{ 
                        backgroundColor: 'action.hover',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Haberler backend entegrasyonu ile birlikte eklenecek
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}
