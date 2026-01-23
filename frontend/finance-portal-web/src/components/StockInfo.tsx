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

import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Chip, Alert } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { useStocks } from '../hooks/useFinanceData'
//import type { StockData } from '../services/api'

export default function StockInfo() {
    const { data: stocks, isLoading, error } = useStocks()

    const stockList = stocks ? Object.entries(stocks).map(([key, value]) => ({ key, ...value })) : []

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Hisse Senetleri (Cache: 5dk)
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Hisse senetleri yüklenirken hata oluştu.
                </Alert>
            ) : stockList.length > 0 ? (
                <Grid container spacing={2}>
                    {stockList.map((stock) => (
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
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Hisse senedi bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
