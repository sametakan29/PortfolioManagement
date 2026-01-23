import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    Skeleton,
    TableSortLabel,
    TextField,
    InputAdornment,
} from '@mui/material'
import { Search as SearchIcon, TrendingUp, TrendingDown } from '@mui/icons-material'
import { useState, useMemo } from 'react'

export interface Column<T> {
    id: keyof T | string
    label: string
    minWidth?: number
    align?: 'left' | 'center' | 'right'
    format?: (value: any, row: T) => React.ReactNode
    sortable?: boolean
}

interface FinancialTableProps<T> {
    columns: Column<T>[]
    data: T[]
    loading?: boolean
    title?: string
    subtitle?: string
    searchable?: boolean
    searchPlaceholder?: string
    searchKey?: keyof T
    emptyMessage?: string
    maxHeight?: number | string
    stickyHeader?: boolean
}

// Helper to get nested value from object
const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export default function FinancialTable<T extends Record<string, any>>({
    columns,
    data,
    loading = false,
    title,
    subtitle,
    searchable = false,
    searchPlaceholder = 'Ara...',
    searchKey,
    emptyMessage = 'Veri bulunamadı',
    maxHeight = 600,
    stickyHeader = true,
}: FinancialTableProps<T>) {
    const [orderBy, setOrderBy] = useState<string>('')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')

    const handleSort = (columnId: string) => {
        const isAsc = orderBy === columnId && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(columnId)
    }

    const filteredAndSortedData = useMemo(() => {
        let result = [...data]

        // Filter by search term
        if (searchTerm && searchKey) {
            result = result.filter(row => {
                const value = getNestedValue(row, searchKey as string)
                return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            })
        }

        // Sort
        if (orderBy) {
            result.sort((a, b) => {
                const aValue = getNestedValue(a, orderBy)
                const bValue = getNestedValue(b, orderBy)

                if (aValue === null || aValue === undefined) return 1
                if (bValue === null || bValue === undefined) return -1

                let comparison = 0
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue
                } else {
                    comparison = aValue.toString().localeCompare(bValue.toString())
                }

                return order === 'asc' ? comparison : -comparison
            })
        }

        return result
    }, [data, searchTerm, searchKey, orderBy, order])

    // Loading skeleton
    if (loading) {
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {title && (
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Skeleton width={200} height={32} />
                        {subtitle && <Skeleton width={150} height={20} />}
                    </Box>
                )}
                <TableContainer sx={{ maxHeight }}>
                    <Table stickyHeader={stickyHeader}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id as string}>
                                        <Skeleton width={80} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((row) => (
                                <TableRow key={row}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id as string}>
                                            <Skeleton width={100} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {/* Header */}
            {(title || searchable) && (
                <Box sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box>
                        {title && (
                            <Typography variant="h6" component="div">
                                {title}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {searchable && (
                        <TextField
                            size="small"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 200 }}
                        />
                    )}
                </Box>
            )}

            {/* Table */}
            <TableContainer sx={{ maxHeight }}>
                <Table stickyHeader={stickyHeader} size="medium">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id as string}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.sortable !== false ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleSort(column.id as string)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedData.map((row, index) => (
                                <TableRow hover key={index}>
                                    {columns.map((column) => {
                                        const value = getNestedValue(row, column.id as string)
                                        return (
                                            <TableCell key={column.id as string} align={column.align || 'left'}>
                                                {column.format ? column.format(value, row) : value}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

// =========================================
// Helper Components for Common Formatters
// =========================================

interface PriceChangeProps {
    value: number
    percentage?: number
    showIcon?: boolean
}

export function PriceChange({ value, percentage, showIcon = true }: PriceChangeProps) {
    const isPositive = value >= 0
    const color = isPositive ? 'success.main' : 'error.main'
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color }}>
            {showIcon && <Icon fontSize="small" />}
            <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
                {isPositive ? '+' : ''}{value.toFixed(2)}
                {percentage !== undefined && ` (${isPositive ? '+' : ''}${percentage.toFixed(2)}%)`}
            </Typography>
        </Box>
    )
}

interface StatusChipProps {
    positive: boolean
    positiveLabel?: string
    negativeLabel?: string
}

export function StatusChip({ positive, positiveLabel = 'Yükseliş', negativeLabel = 'Düşüş' }: StatusChipProps) {
    return (
        <Chip
            label={positive ? positiveLabel : negativeLabel}
            size="small"
            color={positive ? 'success' : 'error'}
            variant="outlined"
        />
    )
}

// Format number with locale
export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

// Format currency
export function formatCurrency(value: number, currency: string = 'TRY'): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 2): string {
    return `%${value.toFixed(decimals)}`
}

// Format volume
export function formatVolume(value: number): string {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)} Milyar`
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)} Milyon`
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(2)} Bin`
    }
    return value.toFixed(0)
}
