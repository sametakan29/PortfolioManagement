import { Container, Typography } from '@mui/material'
import FundInfo from '../components/FundInfo'

export default function Funds() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Fonlar
            </Typography>
            <FundInfo />
        </Container>
    )
}
