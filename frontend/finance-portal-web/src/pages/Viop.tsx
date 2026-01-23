/**
 * VİOP (Vadeli İşlem ve Opsiyon Piyasası) Sayfası
 * 
 * Bu sayfa Borsa İstanbul VİOP verilerini gösterecek.
 * 
 * NOT: API entegrasyonu henüz tamamlanmadı.
 * Backend'de viop API yapılandırılması bekleniyor.
 * 
 * Planlanan Özellikler:
 * - Endeks vadeli işlemler (BIST 30, BIST 100)
 * - Döviz vadeli işlemler (USD/TRY, EUR/TRY)
 * - Pay vadeli işlemler
 * 
 * API: viopApi.getViopInstruments() -> /api/viop
 */

import { Container, Typography, Paper, Alert, Box } from '@mui/material'
import { Construction, ShowChart } from '@mui/icons-material'

export default function Viop() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                VİOP
            </Typography>

            {/* Geliştirme Uyarısı */}
            <Alert severity="info" sx={{ mb: 3 }}>
                VİOP API entegrasyonu henüz tamamlanmadı. Backend yapılandırması bekleniyor.
            </Alert>

            {/* Placeholder İçerik */}
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Construction color="primary" fontSize="large" />
                    <ShowChart color="primary" fontSize="large" />
                    <Typography variant="h6">
                        Yakında Aktif Olacak
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    Vadeli işlem ve opsiyon piyasası verileri bu sayfada yer alacaktır.
                    Backend API entegrasyonu tamamlandığında aşağıdaki özellikler kullanılabilir olacak:
                </Typography>
                <Box component="ul" sx={{ mt: 2, color: 'text.secondary' }}>
                    <li>Endeks vadeli işlem sözleşmeleri (BIST 30, BIST 100)</li>
                    <li>Döviz vadeli işlem sözleşmeleri (USD/TRY, EUR/TRY)</li>
                    <li>Pay vadeli işlem sözleşmeleri</li>
                    <li>Hacim ve açık pozisyon verileri</li>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        <strong>Yapılandırma:</strong> VİOP API'yi etkinleştirmek için application.yml dosyasında
                        <code> finance.api.viop </code> ayarlarını yapın.
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    )
}
