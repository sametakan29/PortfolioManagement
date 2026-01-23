/**
 * Kripto Para Sayfası
 * 
 * Bu sayfa kripto para verilerini gösterecek.
 * 
 * NOT: API entegrasyonu henüz tamamlanmadı.
 * Backend'de crypto API yapılandırılması bekleniyor.
 * 
 * Planlanan Özellikler:
 * - Bitcoin, Ethereum ve diğer kripto paralar
 * - TRY bazlı fiyatlar
 * - 24 saatlik değişim ve hacim
 * 
 * API: Henüz tanımlanmadı
 */

import { Container, Typography, Paper, Alert, Box } from '@mui/material'
import { Construction, CurrencyBitcoin } from '@mui/icons-material'

export default function Crypto() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Kripto Paralar
            </Typography>

            {/* Geliştirme Uyarısı */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Kripto para API entegrasyonu henüz tamamlanmadı. Backend yapılandırması bekleniyor.
            </Alert>

            {/* Placeholder İçerik */}
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Construction color="primary" fontSize="large" />
                    <CurrencyBitcoin color="warning" fontSize="large" />
                    <Typography variant="h6">
                        Yakında Aktif Olacak
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    Kripto para verileri bu sayfada yer alacaktır.
                    Backend API entegrasyonu tamamlandığında aşağıdaki özellikler kullanılabilir olacak:
                </Typography>
                <Box component="ul" sx={{ mt: 2, color: 'text.secondary' }}>
                    <li>Bitcoin (BTC), Ethereum (ETH) ve diğer kripto paralar</li>
                    <li>TRY bazlı anlık fiyatlar</li>
                    <li>24 saatlik değişim yüzdeleri</li>
                    <li>İşlem hacmi verileri</li>
                    <li>Trend göstergeleri</li>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        <strong>Yapılandırma:</strong> Kripto API'yi etkinleştirmek için application.yml dosyasına
                        crypto API ayarlarını ekleyin.
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    )
}
