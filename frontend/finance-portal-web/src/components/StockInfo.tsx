import { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Chip } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { stockApi, StockData } from '../services/api'

export default function StockInfo() {
    const [stocks, setStocks] = useState<Record<string, StockData>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStocks()
    }, [])

    const loadStocks = async () => {
        try {
            const response = await stockApi.getStocks()
            setStocks(response.data)
        } catch (error) {
            console.error('Hisse senetleri yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const stockList = Object.entries(stocks).map(([key, value]) => ({ key, ...value }))

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Hisse Senetleri
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
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
