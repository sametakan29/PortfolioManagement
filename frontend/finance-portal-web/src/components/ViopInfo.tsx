import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Chip, Alert } from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import { useViopData } from '../hooks/useFinanceData'
//import type { ViopData } from '../services/api'

export default function ViopInfo() {
    const { data: viops = [], isLoading, error } = useViopData()

    const getViopTypeLabel = (type: string) => {
        switch (type) {
            case 'FUTURE': return 'Vadeli İşlem'
            case 'OPTION_CALL': return 'Alım Opsiyonu'
            case 'OPTION_PUT': return 'Satım Opsiyonu'
            default: return type
        }
    }

    const getViopTypeColor = (type: string): "success" | "info" | "warning" => {
        switch (type) {
            case 'FUTURE': return 'info'
            case 'OPTION_CALL': return 'success'
            case 'OPTION_PUT': return 'warning'
            default: return 'info'
        }
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                VIOP Enstrümanları (Cache: 5dk)
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    VIOP enstrümanları yüklenirken hata oluştu.
                </Alert>
            ) : viops.length > 0 ? (
                <Grid container spacing={2}>
                    {viops.map((viop, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" component="div">
                                            {viop.symbol}
                                        </Typography>
                                        <Chip
                                            icon={viop.changePercent >= 0 ? <TrendingUp /> : <TrendingDown />}
                                            label={`${viop.changePercent >= 0 ? '+' : ''}${viop.changePercent.toFixed(2)}%`}
                                            color={viop.changePercent >= 0 ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </Box>
                                    <Chip
                                        label={getViopTypeLabel(viop.type)}
                                        color={getViopTypeColor(viop.type)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography color="textSecondary" fontSize="0.875rem" noWrap>
                                        {viop.name}
                                    </Typography>
                                    <Box mt={1}>
                                        <Typography variant="h6" color="primary">
                                            ₺{viop.price.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Hacim: {(viop.volume / 1000).toFixed(1)}K
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Açık Pozisyon: {(viop.openInterest / 1000).toFixed(1)}K
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                            Vade: {viop.expiryDate}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    VIOP enstrümanı bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
