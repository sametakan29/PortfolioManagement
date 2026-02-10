import { useState } from 'react'
import { Box } from '@mui/material'
import { ShowChart } from '@mui/icons-material'

/**
 * BIST Hisse İkon Bileşeni
 * 
 * GitHub'daki codixus/marketicons repo'sundaki SVG logolarını
 * jsdelivr CDN üzerinden yükler. Logo bulunamazsa fallback ikon gösterir.
 * 
 * Kaynak: https://github.com/codixus/marketicons
 * CDN: https://cdn.jsdelivr.net/gh/codixus/marketicons@main/packages/bist/svg/{SEMBOL}.svg
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/codixus/marketicons@main/packages/bist/svg'

interface BistIconProps {
    name: string
    size?: number
    style?: React.CSSProperties
}

export default function BistIcon({ name, size = 32, style }: BistIconProps) {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return (
            <Box
                sx={{
                    width: size,
                    height: size,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    flexShrink: 0,
                    ...style,
                }}
            >
                <ShowChart sx={{ fontSize: size * 0.6, color: 'text.secondary' }} />
            </Box>
        )
    }

    return (
        <img
            src={`${CDN_BASE}/${name.toUpperCase()}.svg`}
            alt={`${name} logo`}
            width={size}
            height={size}
            onError={() => setHasError(true)}
            style={{
                objectFit: 'contain',
                flexShrink: 0,
                ...style,
            }}
        />
    )
}
