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
import { TrendingUp, TrendingDown, Search, ExpandMore, ExpandLess } from '@mui/icons-material'
import { useStocks } from '../hooks/useFinanceData'
//import type { StockData } from '../services/api'

export default function StockInfo() {
    const { data: stocks, isLoading, error } = useStocks()
    const [searchTerm, setSearchTerm] = useState('')
    const [showAll, setShowAll] = useState(false)

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

    const visibleStocks = showAll ? filteredStocks : filteredStocks.slice(0, 10)
    const hasMore = filteredStocks.length > 10

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
                        setShowAll(false)
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
                        <Grid item xs={12} sm={6} md={4} lg={3} key={stock.key}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" component="div">
                                            {stock.symbol}
                                        </Typography>
                                        {stock.changePercent !== undefined && (
                                            <Chip
                                                icon={stock.changePercent >= 0 ? <TrendingUp /> : <TrendingDown />}
                                                label={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                                                color={stock.changePercent >= 0 ? 'success' : 'error'}
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                    <Typography color="textSecondary" fontSize="0.875rem">
                                        {stock.name}
                                    </Typography>
                                    <Box mt={1}>
                                        <Typography variant="h6" color="primary">
                                            ₺{stock.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Hacim: {(stock.volume / 1000000).toFixed(2)}M
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                    {hasMore && (
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowAll((prev) => !prev)}
                                endIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                            >
                                {showAll ? 'Daha az göster' : 'Daha fazla göster'}
                            </Button>
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
