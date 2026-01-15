import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
} from '@mui/material'

export default function Stocks() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Finans Verileri
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                API entegrasyonu bekleniyor. Her kategori için ayrı API key ile veri çekilecek.
            </Typography>

            <Grid container spacing={3}>
                {/* Kur Bilgileri */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            💱 Kur Bilgileri
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            USD/TRY, EUR/TRY, GBP/TRY ve diğer döviz kurları
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                API Key bekleniyor...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Hisse Senedi Bilgileri */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📈 Hisse Senedi Bilgileri
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            BIST ve uluslararası hisse senedi verileri
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                API Key bekleniyor...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Tahvil / Bono Bilgileri */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📊 Tahvil / Bono Bilgileri
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Devlet tahvilleri ve bono verileri
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                API Key bekleniyor...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* VIOP Enstrümanları */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📉 VIOP Enstrümanları
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Vadeli işlem ve opsiyon piyasası verileri
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                API Key bekleniyor...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Fon Bilgileri */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            💰 Fon Bilgileri
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Yatırım fonları, BYF (ETF) ve emeklilik fonları
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                                API Key bekleniyor...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
