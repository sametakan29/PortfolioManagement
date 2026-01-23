/**
 * KAP (Kamuyu Aydınlatma Platformu) Sayfası
 * 
 * Bu sayfa Borsa İstanbul'a kayıtlı şirketlerin KAP bildirimlerini gösterecek.
 * 
 * NOT: API entegrasyonu henüz tamamlanmadı.
 * Backend'de KAP API yapılandırılması bekleniyor.
 * 
 * Planlanan Özellikler:
 * - Şirket listesi ve arama
 * - Şirket bildirimleri
 * - Şirket detay bilgileri
 * 
 * API: Henüz tanımlanmadı
 */

import { Container, Typography, Paper, Alert, Box } from '@mui/material'
import { Construction, Announcement } from '@mui/icons-material'

export default function Kap() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                KAP Bildirimleri
            </Typography>

            {/* Geliştirme Uyarısı */}
            <Alert severity="info" sx={{ mb: 3 }}>
                KAP API entegrasyonu henüz tamamlanmadı. Backend yapılandırması bekleniyor.
            </Alert>

            {/* Placeholder İçerik */}
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Construction color="primary" fontSize="large" />
                    <Announcement color="primary" fontSize="large" />
                    <Typography variant="h6">
                        Yakında Aktif Olacak
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    Kamuyu Aydınlatma Platformu verileri bu sayfada yer alacaktır.
                    Backend API entegrasyonu tamamlandığında aşağıdaki özellikler kullanılabilir olacak:
                </Typography>
                <Box component="ul" sx={{ mt: 2, color: 'text.secondary' }}>
                    <li>BIST'e kayıtlı şirketler listesi</li>
                    <li>Şirket arama fonksiyonu</li>
                    <li>Özel durum açıklamaları</li>
                    <li>Finansal tablo bildirimleri</li>
                    <li>Genel kurul duyuruları</li>
                    <li>Şirket detay bilgileri</li>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        <strong>Yapılandırma:</strong> KAP API'yi etkinleştirmek için application.yml dosyasına
                        KAP API ayarlarını ekleyin.
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    )
}
