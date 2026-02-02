import {
    Container,
    Typography,
} from '@mui/material'
import StockInfo from '../components/StockInfo'

export default function Stocks() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Hisseler
            </Typography>
            <StockInfo />
        </Container>
    )
}
