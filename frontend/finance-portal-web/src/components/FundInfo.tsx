/**
 * Fon Bilgileri Komponenti
 * 
 * Bu komponent yatırım fonlarını kart görünümünde listeler.
 * Veriler useFunds hook'u ile API'den çekilir (30 dk cache).
 * 
 * Fon Türleri:
 * - MUTUAL_FUND: Yatırım Fonu
 * - ETF: Borsa Yatırım Fonu
 * - PENSION_FUND: Emeklilik Fonu
 * 
 * Her fon için: Fiyat, değişim, toplam varlık, yıllık getiri
 */

import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Chip, Alert } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { useFunds } from '../hooks/useFinanceData'
//import type { FundData } from '../services/api'

export default function FundInfo() {
    const { data: funds = [], isLoading, error } = useFunds()

    const getFundTypeLabel = (type: string) => {
        switch (type) {
            case 'MUTUAL_FUND': return 'Yatırım Fonu'
            case 'ETF': return 'Borsa Yatırım Fonu'
            case 'PENSION_FUND': return 'Emeklilik Fonu'
            default: return type
        }
    }

    const getFundTypeColor = (type: string): "primary" | "secondary" | "info" => {
        switch (type) {
            case 'MUTUAL_FUND': return 'primary'
            case 'ETF': return 'secondary'
            case 'PENSION_FUND': return 'info'
            default: return 'primary'
        }
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Fon Bilgileri (Cache: 30dk)
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Fon bilgileri yüklenirken hata oluştu.
                </Alert>
            ) : funds.length > 0 ? (
                <Grid container spacing={2}>
                    {funds.map((fund, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" component="div">
                                            {fund.code}
                                        </Typography>
                                        {fund.changePercent !== undefined && (
                                            <Chip
                                                icon={fund.changePercent >= 0 ? <TrendingUp /> : <TrendingDown />}
                                                label={`${fund.changePercent >= 0 ? '+' : ''}${fund.changePercent.toFixed(2)}%`}
                                                color={fund.changePercent >= 0 ? 'success' : 'error'}
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                    <Chip
                                        label={getFundTypeLabel(fund.type)}
                                        color={getFundTypeColor(fund.type)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography color="textSecondary" fontSize="0.875rem" noWrap>
                                        {fund.name}
                                    </Typography>
                                    <Box mt={1}>
                                        <Typography variant="h6" color="primary">
                                            ₺{fund.price.toFixed(4)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Toplam Varlık: ₺{(fund.totalAssets / 1000000).toFixed(2)}M
                                        </Typography>
                                        <Typography variant="body2" color={fund.yearReturn >= 0 ? 'success.main' : 'error.main'}>
                                            Yıllık Getiri: {fund.yearReturn >= 0 ? '+' : ''}{fund.yearReturn.toFixed(2)}%
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Fon bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
