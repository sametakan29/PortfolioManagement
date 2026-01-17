import { Paper, Typography, Grid, Card, CardContent, Box, CircularProgress, Chip, Alert } from '@mui/material'
import { useBonds } from '../hooks/useFinanceData'
import type { BondData } from '../services/api'

export default function BondInfo() {
    const { data: bonds = [], isLoading, error } = useBonds()

    const getBondTypeLabel = (type: string) => {
        switch (type) {
            case 'BOND': return 'Tahvil'
            case 'TREASURY_BILL': return 'Bono'
            default: return type
        }
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Tahvil / Bono Bilgileri (Cache: 30dk)
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Tahvil/Bono bilgileri yüklenirken hata oluştu.
                </Alert>
            ) : bonds.length > 0 ? (
                <Grid container spacing={2}>
                    {bonds.map((bond, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" component="div">
                                            {bond.symbol}
                                        </Typography>
                                        <Chip
                                            label={getBondTypeLabel(bond.type)}
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Typography color="textSecondary" fontSize="0.875rem" noWrap>
                                        {bond.name}
                                    </Typography>
                                    <Box mt={1}>
                                        <Typography variant="body2">
                                            Fiyat: <strong>₺{bond.price.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2" color="success.main">
                                            Getiri: %{bond.yield.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Kupon: %{bond.couponRate.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                            Vade: {bond.maturityDate}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    Tahvil/Bono bilgisi bulunamadı.
                </Typography>
            )}
        </Paper>
    )
}
