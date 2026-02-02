/**
 * Döviz Kurları Sayfası
 * 
 * Bu sayfa döviz kurlarını ExchangeRate API üzerinden gösterir.
 * Veriler backend cache'i ile 5 dakikada bir güncellenir.
 * 
 * Özellikler:
 * - USD, EUR, GBP ve diğer ana döviz kurları
 * - Alış/Satış spread hesaplaması
 * 
 * API: useForexRates() hook'u -> /api/forex/rates
 */

import { useState } from 'react'
import {
    Container,
    Typography,
    Grid,
    Box,
    Paper,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Button,
    Stack,
} from '@mui/material'
import { CurrencyExchange } from '@mui/icons-material'
import StatCard from '../components/StatCard'
import { formatCurrency } from '../components/FinancialTable'
import { useForexRates } from '../hooks/useFinanceData'
import type { ForexRate } from '../services/api'

// Döviz bilgileri
const currencyInfo: Record<string, { name: string; flag: string }> = {
    'USD': { name: 'Amerikan Doları', flag: '🇺🇸' },
    'EUR': { name: 'Euro', flag: '🇪🇺' },
    'GBP': { name: 'İngiliz Sterlini', flag: '🇬🇧' },
    'CHF': { name: 'İsviçre Frangı', flag: '🇨🇭' },
    'JPY': { name: 'Japon Yeni', flag: '🇯🇵' },
    'CAD': { name: 'Kanada Doları', flag: '🇨🇦' },
    'AUD': { name: 'Avustralya Doları', flag: '🇦🇺' },
    'RUB': { name: 'Rus Rublesi', flag: '🇷🇺' },
    'SAR': { name: 'Suudi Riyali', flag: '🇸🇦' },
    'KWD': { name: 'Kuveyt Dinarı', flag: '🇰🇼' },
}

// Tablo için döviz verisi tipi
interface ForexTableData extends ForexRate {
    flag: string
}

export default function Forex() {
    // API'den döviz kurlarını çek (5 dakika cache)
    const { data: forexRates, isLoading, error } = useForexRates()
    const [visibleCount, setVisibleCount] = useState(20)

    // Döviz verilerini tablo formatına dönüştür
    const forexList: ForexTableData[] = forexRates
        ? Object.values(forexRates).map(rate => ({
            ...rate,
            flag: currencyInfo[rate.code]?.flag || ''
        }))
        : []

    const visibleList = forexList.slice(0, visibleCount)
    const hasMore = forexList.length > visibleCount
    const canScrollTop = visibleList.length > 0


    // Ana kurları al
    const usd = forexRates?.['USD']
    const eur = forexRates?.['EUR']
    const gbp = forexRates?.['GBP']
    const chf = forexRates?.['CHF']


    // Hata durumu
    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 4 }}>
                    Döviz kurları yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.
                </Alert>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg">
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Döviz Kurları
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Anlık döviz kurları (ExchangeRate API - 5 dakika cache)
                </Typography>
            </Box>

            {/* Özet Kartlar */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="USD/TRY"
                        value={usd ? formatCurrency(usd.rate) : '-'}
                        subtitle="Amerikan Doları"
                        icon={<Box sx={{ fontSize: 24 }}>🇺🇸</Box>}
                        loading={isLoading}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="EUR/TRY"
                        value={eur ? formatCurrency(eur.rate) : '-'}
                        subtitle="Euro"
                        icon={<Box sx={{ fontSize: 24 }}>🇪🇺</Box>}
                        loading={isLoading}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="GBP/TRY"
                        value={gbp ? formatCurrency(gbp.rate) : '-'}
                        subtitle="İngiliz Sterlini"
                        icon={<Box sx={{ fontSize: 24 }}>🇬🇧</Box>}
                        loading={isLoading}
                        color="error"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="CHF/TRY"
                        value={chf ? formatCurrency(chf.rate) : '-'}
                        subtitle="İsviçre Frangı"
                        icon={<Box sx={{ fontSize: 24 }}>🇨🇭</Box>}
                        loading={isLoading}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Döviz Listesi */}
            <Paper sx={{ width: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CurrencyExchange color="primary" />
                    <Typography variant="h6">
                        Tüm Döviz Kurları ({forexList.length})
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : forexList.length > 0 ? (
                    <Grid container spacing={2}>
                        {visibleList.map((rate) => (
                            <Grid item xs={12} key={rate.code}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)',
                                            borderColor: 'rgba(27, 77, 255, 0.4)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            display="flex"
                                            alignItems={{ xs: 'flex-start', md: 'center' }}
                                            justifyContent="space-between"
                                            gap={2}
                                            flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                                        >
                                            <Box minWidth={{ md: 220 }}>
                                                <Typography variant="h6" component="div">
                                                    {rate.flag ? `${rate.flag} ` : ''}{rate.code}/TRY
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {rate.name}
                                                </Typography>
                                            </Box>

                                            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Kur
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {formatCurrency(rate.rate)}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Alış
                                                    </Typography>
                                                    <Typography color="success.main" fontWeight={600}>
                                                        {formatCurrency(rate.buyRate)}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Satış
                                                    </Typography>
                                                    <Typography color="error.main" fontWeight={600}>
                                                        {formatCurrency(rate.sellRate)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="caption" color="text.secondary">
                                                {rate.timestamp ? new Date(rate.timestamp).toLocaleString('tr-TR') : '-'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Döviz verisi bulunamadı
                    </Typography>
                )}
            </Paper>

            {(hasMore || canScrollTop) && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        {hasMore && (
                            <Button
                                variant="outlined"
                                onClick={() => setVisibleCount((prev) => prev + 20)}
                            >
                                Daha fazla göster
                            </Button>
                        )}
                        {canScrollTop && (
                            <Button
                                variant="text"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                Başa dön
                            </Button>
                        )}
                    </Stack>
                </Box>
            )}
        </Container>
    )
}
