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

import { Container, Typography } from '@mui/material'
import ViopInfo from '../components/ViopInfo'

export default function Viop() {
    return (
        <Container maxWidth="lg">
            {/* Sayfa Başlığı */}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                VİOP
            </Typography>
            <ViopInfo />
        </Container>
    )
}
