import { Container, Typography, Grid, Card, CardContent } from '@mui/material'

export default function Dashboard() {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 4 }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Toplam Portföy Değeri
                            </Typography>
                            <Typography variant="h5" component="div">
                                ₺125,430.50
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Aktif Pozisyonlar
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
                                Bekleyen İşlemler
                            </Typography>
                            <Typography variant="h5" component="div">
                                3
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}
