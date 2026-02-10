import { useState, useMemo } from 'react'
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Chip,
    Grid,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Skeleton,
    Divider,
} from '@mui/material'
import {
    ArrowBack,
    TrendingUp,
    TrendingDown,
    BarChart as BarChartIcon,
    AccessTime,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts'
import { useStock, useStockChart } from '../hooks/useFinanceData'
import BistIcon from '../components/BistIcon'
import type { ChartRange, ChartInterval, RangeOption } from '../services/api'

/**
 * Zaman aralığı seçenekleri
 * Her range için uygun interval eşleştirmesi
 */
const RANGE_OPTIONS: RangeOption[] = [
    { range: '1d', interval: '5m', label: '1 Gün' },
    { range: '5d', interval: '60m', label: '1 Hafta' },
    { range: '1mo', interval: '1d', label: '1 Ay' },
    { range: '3mo', interval: '1d', label: '3 Ay' },
    { range: '1y', interval: '1d', label: '1 Yıl' },
    { range: '5y', interval: '1wk', label: '5 Yıl' },
]

/**
 * Timestamp'ı belirtilen aralığa göre formatla
 */
const formatDate = (timestamp: number, range: ChartRange): string => {
    const date = new Date(timestamp * 1000)
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

    switch (range) {
        case '1d':
            // 14:35
            return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
        case '5d':
            // Pzt 10:00
            return `${days[date.getDay()]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
        case '1mo':
            // 15 Oca
            return `${date.getDate()} ${months[date.getMonth()]}`
        case '3mo':
            // Oca 2026
            return `${months[date.getMonth()]} ${date.getFullYear()}`
        case '1y':
            // Şub '25
            return `${months[date.getMonth()]} '${String(date.getFullYear()).slice(2)}`
        case '5y':
            // 2024 Q1
            const quarter = Math.floor(date.getMonth() / 3) + 1
            return `${date.getFullYear()} Q${quarter}`
        default:
            return `${date.getDate()} ${months[date.getMonth()]}`
    }
}

/**
 * Büyük sayıları kısalt
 */
const formatVolume = (vol: number): string => {
    if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(1)}B`
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
    return vol.toString()
}

/**
 * Custom tooltip içeriği
 */
const ChartTooltip = ({ active, payload, range }: any) => {
    if (!active || !payload || !payload.length) return null
    const data = payload[0]?.payload
    if (!data) return null

    return (
        <Paper
            elevation={8}
            sx={{
                p: 1.5,
                backgroundColor: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 180,
            }}
        >
            <Typography variant="caption" color="text.secondary" display="block">
                {formatDate(data.timestamp, range)}
            </Typography>
            <Divider sx={{ my: 0.5 }} />
            <Box display="flex" justifyContent="space-between" gap={2}>
                <Typography variant="caption">Açılış:</Typography>
                <Typography variant="caption" fontWeight={600}>₺{data.open?.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" gap={2}>
                <Typography variant="caption">Yüksek:</Typography>
                <Typography variant="caption" fontWeight={600} color="success.main">₺{data.high?.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" gap={2}>
                <Typography variant="caption">Düşük:</Typography>
                <Typography variant="caption" fontWeight={600} color="error.main">₺{data.low?.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" gap={2}>
                <Typography variant="caption">Kapanış:</Typography>
                <Typography variant="caption" fontWeight={600} color="primary.main">₺{data.close?.toFixed(2)}</Typography>
            </Box>
            {data.volume != null && (
                <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography variant="caption">Hacim:</Typography>
                    <Typography variant="caption" fontWeight={600}>{formatVolume(data.volume)}</Typography>
                </Box>
            )}
        </Paper>
    )
}

export default function StockDetail() {
    const navigate = useNavigate()
    const { symbol } = useParams<{ symbol: string }>()
    const upperSymbol = symbol?.toUpperCase() || ''

    const [selectedRange, setSelectedRange] = useState<ChartRange>('1mo')
    const [selectedInterval, setSelectedInterval] = useState<ChartInterval>('1d')

    // Veri hook'ları
    const { data: stock, isLoading: stockLoading } = useStock(upperSymbol)
    const { data: chartData, isLoading: chartLoading, error: chartError } = useStockChart(
        upperSymbol, selectedRange, selectedInterval
    )

    // Grafik verisi hesaplamaları
    const chartStats = useMemo(() => {
        if (!chartData?.data?.length) return null
        const points = chartData.data
        const closes = points.map(p => p.close).filter((c): c is number => c != null)
        const volumes = points.map(p => p.volume).filter((v): v is number => v != null)

        const first = closes[0]
        const last = closes[closes.length - 1]
        const change = last - first
        const changePercent = (change / first) * 100

        return {
            high: Math.max(...closes),
            low: Math.min(...closes),
            avgVolume: volumes.length ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0,
            change,
            changePercent,
            isUp: change >= 0,
        }
    }, [chartData])

    // Range değiştiğinde doğru interval'i seçsin
    const handleRangeChange = (_: React.MouseEvent<HTMLElement>, newRange: ChartRange | null) => {
        if (!newRange) return
        setSelectedRange(newRange)
        const option = RANGE_OPTIONS.find(o => o.range === newRange)
        if (option) setSelectedInterval(option.interval)
    }

    const isUp = stock ? stock.changePercent >= 0 : chartStats?.isUp ?? true
    const gradientColor = isUp ? '#00B894' : '#E74C3C'

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Geri butonu */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Geri
            </Button>

            {/* Başlık Alanı */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box
                    display="flex"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={2}
                >
                    <Box>
                        <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                            <BistIcon name={upperSymbol} size={48} style={{ borderRadius: 8, flexShrink: 0 }} />
                            <Typography variant="h4" fontWeight={700}>
                                {upperSymbol}
                            </Typography>
                            {chartData?.shortName && (
                                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                    {chartData.shortName}
                                </Typography>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            BIST · {chartData?.currency || 'TRY'} · Borsa İstanbul
                        </Typography>
                    </Box>

                    {/* Fiyat bilgisi */}
                    <Box textAlign={{ xs: 'left', md: 'right' }}>
                        {stockLoading ? (
                            <Skeleton width={140} height={48} />
                        ) : (
                            <>
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    ₺{(chartData?.regularMarketPrice || stock?.price || 0).toFixed(2)}
                                </Typography>
                                {stock && (
                                    <Chip
                                        icon={isUp ? <TrendingUp /> : <TrendingDown />}
                                        label={`${isUp ? '+' : ''}${stock.changePercent?.toFixed(2)}%`}
                                        color={isUp ? 'success' : 'error'}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Grafik Alanı */}
            <Paper sx={{ p: 3, mb: 3 }}>
                {/* Zaman aralığı seçimi */}
                <Box
                    display="flex"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    justifyContent="space-between"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={2}
                    mb={3}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="subtitle1" fontWeight={600}>
                            Fiyat Grafiği
                        </Typography>
                    </Box>

                    <ToggleButtonGroup
                        value={selectedRange}
                        exclusive
                        onChange={handleRangeChange}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 2,
                                py: 0.5,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                borderRadius: '8px !important',
                                border: '1px solid',
                                borderColor: 'divider',
                                mx: 0.3,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                },
                            },
                        }}
                    >
                        {RANGE_OPTIONS.map(opt => (
                            <ToggleButton key={opt.range} value={opt.range}>
                                {opt.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {/* Grafik */}
                {chartLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                        <CircularProgress size={48} />
                    </Box>
                ) : chartError ? (
                    <Alert severity="error" sx={{ my: 2 }}>
                        Grafik verisi yüklenirken hata oluştu. Lütfen tekrar deneyin.
                    </Alert>
                ) : chartData?.data?.length ? (
                    <Box>
                        {/* Fiyat Grafiği */}
                        <ResponsiveContainer width="100%" height={380}>
                            <AreaChart
                                data={chartData.data}
                                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={gradientColor} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(0,0,0,0.06)"
                                />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(ts) => formatDate(ts, selectedRange)}
                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                                    minTickGap={40}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `₺${v.toFixed(0)}`}
                                    width={65}
                                />
                                <Tooltip content={<ChartTooltip range={selectedRange} />} />
                                <Area
                                    type="monotone"
                                    dataKey="close"
                                    stroke={gradientColor}
                                    strokeWidth={2}
                                    fill="url(#colorPrice)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: gradientColor, strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        {/* Hacim Grafiği */}
                        <Box mt={1}>
                            <ResponsiveContainer width="100%" height={100}>
                                <BarChart
                                    data={chartData.data}
                                    margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                                >
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(ts) => formatDate(ts, selectedRange)}
                                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={60}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => formatVolume(v)}
                                        width={65}
                                    />
                                    <Bar
                                        dataKey="volume"
                                        fill="rgba(27, 77, 255, 0.25)"
                                        radius={[2, 2, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                ) : (
                    <Alert severity="info" sx={{ my: 2 }}>
                        Bu hisse için grafik verisi bulunamadı.
                    </Alert>
                )}
            </Paper>

            {/* İstatistik Kartları */}
            {(chartStats || stock) && (
                <Grid container spacing={2}>
                    {/* Dönem Değişimi */}
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Dönem Değişimi
                            </Typography>
                            {chartStats ? (
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color={chartStats.isUp ? 'success.main' : 'error.main'}
                                >
                                    {chartStats.isUp ? '+' : ''}{chartStats.changePercent.toFixed(2)}%
                                </Typography>
                            ) : (
                                <Skeleton width={80} height={32} sx={{ mx: 'auto' }} />
                            )}
                        </Paper>
                    </Grid>

                    {/* Dönem En Yüksek */}
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Dönem En Yüksek
                            </Typography>
                            {chartStats ? (
                                <Typography variant="h6" fontWeight={700} color="success.main">
                                    ₺{chartStats.high.toFixed(2)}
                                </Typography>
                            ) : (
                                <Skeleton width={80} height={32} sx={{ mx: 'auto' }} />
                            )}
                        </Paper>
                    </Grid>

                    {/* Dönem En Düşük */}
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Dönem En Düşük
                            </Typography>
                            {chartStats ? (
                                <Typography variant="h6" fontWeight={700} color="error.main">
                                    ₺{chartStats.low.toFixed(2)}
                                </Typography>
                            ) : (
                                <Skeleton width={80} height={32} sx={{ mx: 'auto' }} />
                            )}
                        </Paper>
                    </Grid>

                    {/* Ort. Hacim */}
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                <BarChartIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                    Ort. Hacim
                                </Typography>
                            </Box>
                            {chartStats ? (
                                <Typography variant="h6" fontWeight={700}>
                                    {formatVolume(chartStats.avgVolume)}
                                </Typography>
                            ) : (
                                <Skeleton width={80} height={32} sx={{ mx: 'auto' }} />
                            )}
                        </Paper>
                    </Grid>

                    {/* Mevcut hisse verisi kartları */}
                    {stock && (
                        <>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Güncel Fiyat
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                        ₺{stock.price?.toFixed(2)}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <Paper sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Günlük Değişim
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color={stock.changePercent >= 0 ? 'success.main' : 'error.main'}
                                    >
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={6} md={3}>
                                <Paper sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Hacim
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700}>
                                        {formatVolume(stock.volume || 0)}
                                    </Typography>
                                </Paper>
                            </Grid>

                            {chartData?.previousClose ? (
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Önceki Kapanış
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            ₺{chartData.previousClose.toFixed(2)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ) : null}
                        </>
                    )}
                </Grid>
            )}
        </Container>
    )
}
