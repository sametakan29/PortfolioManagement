import {
    Container,
    Typography,
    Chip,
    Box,
} from '@mui/material'
import StockInfo from '../components/StockInfo'
import { useMarketStatus } from '../hooks/useFinanceData'

export default function Stocks() {
    const { data: marketStatus } = useMarketStatus()

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Hisse Senetleri
                </Typography>
                {marketStatus && (
                    <Chip
                        label={marketStatus.isOpen ? 'Piyasa Açık' : 'Piyasa Kapalı'}
                        color={marketStatus.isOpen ? 'success' : 'error'}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 700 }}
                    />
                )}
            </Box>
            {marketStatus && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {marketStatus.title} — {marketStatus.description}
                </Typography>
            )}
            <StockInfo />
        </Container>
    )
}
