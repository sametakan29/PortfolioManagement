/**
 * Tahvil & Bono Sayfası
 * 
 * Bu sayfa devlet tahvilleri ve eurobond verilerini gösterecek.
 * 
 * NOT: API entegrasyonu henüz tamamlanmadı.
 * Backend'de bond API yapılandırılması bekleniyor.
 * 
 * Planlanan Özellikler:
 * - 2Y, 5Y, 10Y vade tahvilleri
 * - Eurobond listesi
 * - Getiri eğrisi
 * 
 * API: bondApi.getBonds() -> /api/bonds
 */

import { Container, Typography, Paper, Alert, Box } from '@mui/material'
import { Construction, AccountBalance } from '@mui/icons-material'

export default function Bonds() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Tahvil & Bono
            </Typography>

            {/* Geliştirme Uyarısı */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Tahvil API entegrasyonu henüz tamamlanmadı. Backend yapılandırması bekleniyor.
            </Alert>

            {/* Placeholder İçerik */}
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Construction color="primary" fontSize="large" />
                    <AccountBalance color="primary" fontSize="large" />
                    <Typography variant="h6">
                        Yakında Aktif Olacak
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    Tahvil ve bono verileri bu sayfada yer alacaktır.
                    Backend API entegrasyonu tamamlandığında aşağıdaki özellikler kullanılabilir olacak:
                </Typography>
                <Box component="ul" sx={{ mt: 2, color: 'text.secondary' }}>
                    <li>Devlet tahvilleri (2Y, 5Y, 10Y vadeler)</li>
                    <li>Getiri oranları ve değişimleri</li>
                    <li>Eurobond listesi (USD, EUR bazlı)</li>
                    <li>Getiri eğrisi grafiği</li>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        <strong>Yapılandırma:</strong> Bond API'yi etkinleştirmek için application.yml dosyasında
                        <code> finance.api.bond </code> ayarlarını yapın.
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    )
}
