/**
 * Döviz Kurları Komponenti
 * 
 * Bu komponent döviz kurlarını kart görünümünde listeler.
 * Veriler useForexRates hook'u ile API'den çekilir (5 dk cache).
 * 
 * Gösterilen Kurlar:
 * USD, EUR, GBP, CHF, CAD, AUD, JPY, SAR, RUB, KWD
 * 
 * Her kur için alış, satış ve ortalama fiyat gösterilir.
 */

import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material'
import { useForexRates } from '../hooks/useFinanceData'

export default function ForexRates() {
    const { data: forexRates, isLoading, error } = useForexRates()

    // Top 10 döviz kurunu al - sıralı şekilde
    const top10Currencies = ['USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY', 'SAR', 'RUB', 'KWD']
    const topForexRates = forexRates
        ? top10Currencies
            .filter(code => forexRates[code])
            .map(code => forexRates[code])
        : []

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Döviz Kurları (Canlı - Cache: 5dk)
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Döviz kurları yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.
                </Alert>
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
