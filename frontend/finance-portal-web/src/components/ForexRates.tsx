import { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress } from '@mui/material'
import { forexApi, ForexRate } from '../services/api'

export default function ForexRates() {
    const [forexRates, setForexRates] = useState<Record<string, ForexRate>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadForexRates()
    }, [])

    const loadForexRates = async () => {
        try {
            const response = await forexApi.getForexRates()
            setForexRates(response.data)
        } catch (error) {
            console.error('Döviz kurları yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    // Top 10 döviz kurunu al - sıralı şekilde
    const top10Currencies = ['USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY', 'SAR', 'RUB', 'KWD']
    const topForexRates = top10Currencies
        .filter(code => forexRates[code])
        .map(code => forexRates[code])

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Döviz Kurları (Canlı)
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : topForexRates.length > 0 ? (
                <Grid container spacing={2}>
                    {topForexRates.map((rate) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={rate.code}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom fontSize="0.875rem">
                                        {rate.name}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {rate.code}/TRY
                                    </Typography>
                                    <Box mt={1}>
                                        <Typography variant="body2" color="primary">
                                            Alış: ₺{rate.buyRate.toFixed(4)}
                                        </Typography>
                                        <Typography variant="body2" color="error">
                                            Satış: ₺{rate.sellRate.toFixed(4)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Ortalama: ₺{rate.rate.toFixed(4)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Döviz kuru bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
