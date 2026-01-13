import { Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material'

export default function Dashboard() {
    return (/*typography=her şey text */
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 4 }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Portfolio Value
                            </Typography>
                            <Typography variant="h5" component="div">
                                $125,430.50
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Active Positions
                            </Typography>
                            <Typography variant="h5" component="div">
                                12
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending Approvals
                            </Typography>
                            <Typography variant="h5" component="div">
                                3
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            No recent transactions.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
