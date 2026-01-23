/**
 * Portföy Yönetimi Sayfası
 * 
 * Bu sayfa kullanıcının portföy bilgilerini ve işlem onay akışını gösterir.
 * 
 * NOT: Bu sayfa henüz geliştirilme aşamasındadır.
 * Backend API endpoint'leri hazır olduğunda aşağıdaki özellikler eklenecek:
 * - Portföy pozisyonları listesi
 * - Alım/Satım işlemleri
 * - İşlem geçmişi
 * - Onay bekleyen işlemler
 * 
 * API Entegrasyonu: portfolioApi (henüz tanımlanmadı)
 */

import { Container, Typography, Paper, Alert, Box } from '@mui/material'
import { Construction } from '@mui/icons-material'

export default function Portfolio() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Portföy Yönetimi
            </Typography>

            {/* Geliştirme Uyarısı */}
            <Alert severity="info" sx={{ mb: 3 }}>
                Bu sayfa aktif olarak geliştirilmektedir. Yakında portföy yönetimi özellikleri eklenecektir.
            </Alert>

            {/* Placeholder İçerik */}
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Construction color="primary" fontSize="large" />
                    <Typography variant="h6">
                        Yakında Aktif Olacak
                    </Typography>
                </Box>
                <Typography variant="body1" color="textSecondary">
                    Portföy yönetimi ve işlem onay akışı özellikleri bu sayfada yer alacaktır.
                    Backend API entegrasyonu tamamlandığında aşağıdaki özellikler kullanılabilir olacak:
                </Typography>
                <Box component="ul" sx={{ mt: 2, color: 'text.secondary' }}>
                    <li>Portföy pozisyonları ve değerleme</li>
                    <li>Anlık kar/zarar takibi</li>
                    <li>Alım ve satım işlemleri</li>
                    <li>İşlem geçmişi görüntüleme</li>
                    <li>Onay bekleyen işlemler listesi</li>
                </Box>
            </Paper>
        </Container>
    )
}
