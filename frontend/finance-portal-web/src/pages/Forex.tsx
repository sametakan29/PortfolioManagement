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

import {
    Container,
    Typography,
    Grid,
    Box,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material'
import { CurrencyExchange } from '@mui/icons-material'
import StatCard from '../components/StatCard'
import FinancialTable, { Column, formatCurrency } from '../components/FinancialTable'
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

    // Döviz verilerini tablo formatına dönüştür
    const forexList: ForexTableData[] = forexRates
        ? Object.values(forexRates).map(rate => ({
            ...rate,
            flag: currencyInfo[rate.code]?.flag || '💱'
        }))
        : []

    // Ana kurları al
    const usd = forexRates?.['USD']
    const eur = forexRates?.['EUR']
    const gbp = forexRates?.['GBP']
    const chf = forexRates?.['CHF']

    // Tablo sütunları
    const columns: Column<ForexTableData>[] = [
        {
            id: 'code',
            label: 'Döviz',
            minWidth: 200,
            format: (value, row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{row.flag}</Typography>
                    <Box>
                        <Typography variant="body2" fontWeight={600}>{value}/TRY</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.name}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'rate',
            label: 'Kur',
            minWidth: 120,
            align: 'right',
            format: (value) => (
                <Typography fontWeight={700}>
                    {formatCurrency(value)}
                </Typography>
            )
        },
        {
            id: 'buyRate',
            label: 'Alış',
            minWidth: 120,
            align: 'right',
            format: (value) => (
                <Typography color="success.main">
                    {formatCurrency(value)}
                </Typography>
            )
        },
        {
            id: 'sellRate',
            label: 'Satış',
            minWidth: 120,
            align: 'right',
            format: (value) => (
                <Typography color="error.main">
                    {formatCurrency(value)}
                </Typography>
            )
        },
        {
            id: 'timestamp',
            label: 'Güncelleme',
            minWidth: 150,
            align: 'center',
            format: (value) => value ? new Date(value).toLocaleString('tr-TR') : '-'
        },
    ]

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

            {/* Döviz Tablosu */}
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
                ) : (
                    <FinancialTable
                        columns={columns}
                        data={forexList}
                        loading={isLoading}
                        emptyMessage="Döviz verisi bulunamadı"
                    />
                )}
            </Paper>
        </Container>
    )
}
