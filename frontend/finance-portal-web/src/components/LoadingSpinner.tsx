import { Box, CircularProgress, Typography, Paper } from '@mui/material'

interface LoadingSpinnerProps {
    message?: string
    fullPage?: boolean
    size?: number
}

export default function LoadingSpinner({
    message = 'Yükleniyor...',
    fullPage = false,
    size = 40
}: LoadingSpinnerProps) {
    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 4,
            }}
        >
            <CircularProgress size={size} />
            {message && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    )

    if (fullPage) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                }}
            >
                {content}
            </Box>
        )
    }

    return content
}

interface LoadingOverlayProps {
    loading: boolean
    children: React.ReactNode
    message?: string
}

export function LoadingOverlay({ loading, children, message = 'Yükleniyor...' }: LoadingOverlayProps) {
    return (
        <Box sx={{ position: 'relative' }}>
            {children}
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 'inherit',
                        zIndex: 10,
                    }}
                >
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress />
                        <Typography variant="body2">{message}</Typography>
                    </Paper>
                </Box>
            )}
        </Box>
    )
}

interface ErrorMessageProps {
    message?: string
    onRetry?: () => void
}

export function ErrorMessage({
    message = 'Bir hata oluştu. Lütfen tekrar deneyin.',
    onRetry
}: ErrorMessageProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 4,
                textAlign: 'center',
            }}
        >
            <Typography variant="h6" color="error">
                Hata
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
            {onRetry && (
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={onRetry}
                >
                    Tekrar Dene
                </Typography>
            )}
        </Box>
    )
}
