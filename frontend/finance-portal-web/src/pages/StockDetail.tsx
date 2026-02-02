import { Container, Typography, Paper, Box, Button, Chip } from '@mui/material'
import { ArrowBack, ShowChart } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'

export default function StockDetail() {
    const navigate = useNavigate()
    const { symbol } = useParams()

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Geri
            </Button>

            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <ShowChart color="primary" />
                    <Typography variant="h4" fontWeight={700}>
                        {symbol?.toUpperCase()} Detayları
                    </Typography>
                    <Chip label="Yakında" color="info" size="small" />
                </Box>

                <Typography variant="body1" color="text.secondary">
                    Bu sayfa seçilen hisse için detaylı metrikler, grafikler ve haber akışını gösterecek.
                    API key ve detay veri entegrasyonunu eklediğinde buraya bağlayabiliriz.
                </Typography>

                <Box mt={3}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Planlanan içerikler
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, color: 'text.secondary' }}>
                        <li>Gün içi fiyat grafiği (candlestick)</li>
                        <li>Hacim, volatilite, RSI/MACD</li>
                        <li>Temel analiz metrikleri</li>
                        <li>Haberler ve KAP bildirimleri</li>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}
