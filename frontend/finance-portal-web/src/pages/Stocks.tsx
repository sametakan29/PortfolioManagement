import {
    Container,
    Typography,
    Grid,
} from '@mui/material'
import ForexRates from '../components/ForexRates'
import StockInfo from '../components/StockInfo'
import BondInfo from '../components/BondInfo'
import ViopInfo from '../components/ViopInfo'
import FundInfo from '../components/FundInfo'

export default function Stocks() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Finans Verileri
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ForexRates />
                </Grid>
                <Grid item xs={12}>
                    <StockInfo />
                </Grid>
                <Grid item xs={12}>
                    <BondInfo />
                </Grid>
                <Grid item xs={12}>
                    <ViopInfo />
                </Grid>
                <Grid item xs={12}>
                    <FundInfo />
                </Grid>
            </Grid>
        </Container>
    )
}
