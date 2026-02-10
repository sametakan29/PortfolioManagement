import { Box, Typography, Chip, Collapse } from '@mui/material'
import {
    AccessTime as ClockIcon,
    TrendingUp as TrendingUpIcon,
    NightsStay as NightIcon,
    WbSunny as SunIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Gavel as GavelIcon,
} from '@mui/icons-material'
import { useMarketStatus } from '../hooks/useFinanceData'

/**
 * Seans koduna göre ikon belirler
 */
function getSessionIcon(session: string) {
    switch (session) {
        case 'CONTINUOUS_TRADING':
            return <TrendingUpIcon sx={{ fontSize: 20 }} />
        case 'OPENING_AUCTION':
        case 'OPENING_MATCH':
            return <SunIcon sx={{ fontSize: 20 }} />
        case 'CLOSING_AUCTION':
            return <VisibilityOffIcon sx={{ fontSize: 20 }} />
        case 'CLOSING_MATCH':
        case 'CLOSING_TRADES':
            return <GavelIcon sx={{ fontSize: 20 }} />
        case 'CLOSING_BREAK':
            return <VisibilityIcon sx={{ fontSize: 20 }} />
        case 'PRE_MARKET':
            return <ClockIcon sx={{ fontSize: 20 }} />
        case 'CLOSED':
        default:
            return <NightIcon sx={{ fontSize: 20 }} />
    }
}

/**
 * Seans koduna göre renk teması belirler
 */
function getSessionColors(session: string) {
    switch (session) {
        case 'CONTINUOUS_TRADING':
            return { bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', text: '#2e7d32', chip: 'success' as const }
        case 'OPENING_AUCTION':
        case 'OPENING_MATCH':
            return { bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', text: '#e65100', chip: 'warning' as const }
        case 'CLOSING_AUCTION':
        case 'CLOSING_MATCH':
        case 'CLOSING_TRADES':
        case 'CLOSING_BREAK':
            return { bg: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', text: '#c62828', chip: 'error' as const }
        case 'PRE_MARKET':
            return { bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', text: '#1565c0', chip: 'info' as const }
        case 'CLOSED':
        default:
            return { bg: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)', text: '#616161', chip: 'default' as const }
    }
}

/**
 * BIST Piyasa Durumu Banner Bileşeni
 * 
 * Layout'un üstünde görünür ve mevcut seans bilgisini gösterir.
 * Backend'den /api/market/status endpoint'inden veri alır.
 */
export default function MarketStatusBanner() {
    const { data: status, isLoading } = useMarketStatus()

    if (isLoading || !status) return null

    const colors = getSessionColors(status.session)
    const icon = getSessionIcon(status.session)

    return (
        <Collapse in={true}>
            <Box
                sx={{
                    background: colors.bg,
                    borderBottom: `2px solid ${colors.text}20`,
                    px: { xs: 2, sm: 3 },
                    py: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                }}
            >
                <Chip
                    icon={icon}
                    label={status.isOpen ? 'Açık' : 'Kapalı'}
                    color={colors.chip}
                    size="small"
                    variant="filled"
                    sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                />
                <Typography
                    variant="subtitle2"
                    sx={{ color: colors.text, fontWeight: 700 }}
                >
                    {status.title}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ color: colors.text, opacity: 0.85, flex: 1 }}
                >
                    {status.description}
                </Typography>
            </Box>
        </Collapse>
    )
}
