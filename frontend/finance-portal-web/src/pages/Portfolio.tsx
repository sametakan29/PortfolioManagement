import { Container, Typography, Paper } from '@mui/material'

export default function Portfolio() {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 4 }}>
                Portfolio Management
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="body1">
                    Portfolio details and transaction approval workflow will be displayed here.
                </Typography>
            </Paper>
        </Container>
    )
}
