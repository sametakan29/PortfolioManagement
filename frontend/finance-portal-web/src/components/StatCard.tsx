import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material'
import { ReactNode } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    change?: number
    changePercent?: number
    icon?: ReactNode
    loading?: boolean
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export default function StatCard({
    title,
    value,
    subtitle,
    change,
    changePercent,
    icon,
    loading = false,
    color = 'primary',
}: StatCardProps) {
    const isPositive = change !== undefined ? change >= 0 : undefined
    const changeColor = isPositive === true ? 'success.main' : isPositive === false ? 'error.main' : 'text.secondary'
    const ChangeIcon = isPositive === true ? TrendingUp : isPositive === false ? TrendingDown : Remove

    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Skeleton width={100} height={20} />
                            <Skeleton width={150} height={40} sx={{ mt: 1 }} />
                            <Skeleton width={80} height={20} sx={{ mt: 1 }} />
                        </Box>
                        <Skeleton variant="circular" width={48} height={48} />
                    </Box>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                            {value}
                        </Typography>

                        {/* Change indicator */}
                        {change !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ChangeIcon fontSize="small" sx={{ color: changeColor }} />
                                <Typography variant="body2" sx={{ color: changeColor, fontWeight: 500 }}>
                                    {isPositive ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}
                                    {changePercent !== undefined && (
                                        <Typography component="span" variant="body2" sx={{ color: changeColor, ml: 0.5 }}>
                                            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        )}

                        {/* Subtitle */}
                        {subtitle && !change && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {/* Icon */}
                    {icon && (
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: `${color}.main`,
                                color: `${color}.contrastText`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

// Mini stat card for compact display
interface MiniStatCardProps {
    label: string
    value: string | number
    change?: number
    loading?: boolean
}

export function MiniStatCard({ label, value, change, loading = false }: MiniStatCardProps) {
    const isPositive = change !== undefined ? change >= 0 : undefined
    const changeColor = isPositive === true ? 'success.main' : isPositive === false ? 'error.main' : 'text.secondary'

    if (loading) {
        return (
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Skeleton width={60} height={16} />
                <Skeleton width={80} height={24} sx={{ mt: 0.5 }} />
            </Box>
        )
    }

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {value}
                </Typography>
                {change !== undefined && (
                    <Typography variant="caption" sx={{ color: changeColor, fontWeight: 500 }}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
