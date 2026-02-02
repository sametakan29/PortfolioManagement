/**
 * Hisse Senedi Bilgileri Komponenti
 * 
 * Bu komponent hisse senetlerini kart görünümünde listeler.
 * Veriler useStocks hook'u ile API'den çekilir (5 dk cache).
 * 
 * Her hisse için gösterilen bilgiler:
 * - Sembol ve şirket adı
 * - Güncel fiyat
 * - Yüzdelik değişim (renk kodlu)
 * - İşlem hacmi
 */

import { useMemo, useState } from 'react'
import {
    Paper,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Box,
    CircularProgress,
    Chip,
    Alert,
    TextField,
    InputAdornment,
    Button,
    Stack,
} from '@mui/material'
import { TrendingUp, TrendingDown, Search, ExpandMore } from '@mui/icons-material'
import { useStocks } from '../hooks/useFinanceData'
import { useNavigate } from 'react-router-dom'
//import type { StockData } from '../services/api'

export default function StockInfo() {
    const { data: stocks, isLoading, error } = useStocks()
    const [searchTerm, setSearchTerm] = useState('')
    const [visibleCount, setVisibleCount] = useState(20)
    const navigate = useNavigate()

    const stockList = stocks ? Object.entries(stocks).map(([key, value]) => ({ key, ...value })) : []
    const filteredStocks = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return stockList
        return stockList.filter((stock) => {
            const symbolMatch = stock.symbol?.toLowerCase().includes(term)
            const nameMatch = stock.name?.toLowerCase().includes(term)
            return symbolMatch || nameMatch
        })
    }, [stockList, searchTerm])

    const visibleStocks = filteredStocks.slice(0, visibleCount)
    const hasMore = filteredStocks.length > visibleCount
    const canScrollTop = visibleStocks.length > 0

    return (
        <Paper sx={{ p: 3 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Hisse Senetleri (Cache: 5dk)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gösterilen: {visibleStocks.length} / {filteredStocks.length}
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Hisse ara (ör. THYAO, ASELS...)"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setVisibleCount(20)
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        maxWidth: { md: 380 },
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                    }}
                />
            </Stack>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Hisse senetleri yüklenirken hata oluştu.
                </Alert>
            ) : filteredStocks.length > 0 ? (
                <>
                    <Grid container spacing={2}>
                        {visibleStocks.map((stock) => (
                        <Grid item xs={12} key={stock.key}>
                            <Card
                                variant="outlined"
                                sx={{
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                                        borderColor: 'rgba(27, 77, 255, 0.4)',
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                                    sx={{ height: '100%' }}
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
                                                {stock.symbol}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Fiyat
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    ₺{stock.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Hacim
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {(stock.volume / 1000000).toFixed(2)}M
                                                </Typography>
                                            </Box>
                                            {stock.changePercent !== undefined && (
                                                <Chip
                                                    icon={stock.changePercent >= 0 ? <TrendingUp /> : <TrendingDown />}
                                                    label={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                                                    color={stock.changePercent >= 0 ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="caption" color="text.secondary">
                                            Detaylar için tıkla
                                        </Typography>
                                    </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                    {(hasMore || canScrollTop) && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {hasMore && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => setVisibleCount((prev) => prev + 20)}
                                        endIcon={<ExpandMore />}
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
                </>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Hisse senedi bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
