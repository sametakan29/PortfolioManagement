import { ReactNode, useState } from 'react'
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip,
    Stack,
} from '@mui/material'
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    AccountBalance as PortfolioIcon,
    Article as NewsIcon,
    ShowChart as StocksIcon,
    CurrencyExchange as ForexIcon,
    AccountBalanceWallet as BondsIcon,
    CandlestickChart as ViopIcon,
    Savings as FundsIcon,
    CurrencyBitcoin as CryptoIcon,
    Assignment as KapIcon,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const drawerWidth = 240

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
        { text: 'Hisseler', icon: <StocksIcon />, path: '/stocks' },
        { text: 'Döviz Kurları', icon: <ForexIcon />, path: '/forex' },
        { text: 'Tahvil & Bono', icon: <BondsIcon />, path: '/bonds' },
        { text: 'VİOP', icon: <ViopIcon />, path: '/viop' },
        { text: 'Fonlar', icon: <FundsIcon />, path: '/funds' },
        { text: 'Kripto', icon: <CryptoIcon />, path: '/crypto' },
        { text: 'KAP', icon: <KapIcon />, path: '/kap' },
        { text: 'Haberler', icon: <NewsIcon />, path: '/news' },
    ]

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ px: 3 }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" noWrap component="div">
                        Toyota Borsa
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Finance Portal
                    </Typography>
                </Stack>
            </Toolbar>
            <Box sx={{ px: 3, pb: 2 }}>
                <Chip label="Canlı veri" color="success" size="small" />
            </Box>
            <Divider />
            <List sx={{ px: 2, py: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={isActive(item.path)}
                            sx={{ px: 2, py: 1.2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 600 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 'auto', px: 3, pb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                    © 2026 Toyota Borsa
                </Typography>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Stack spacing={0.2}>
                        <Typography variant="subtitle1" noWrap component="div" fontWeight={700}>
                            Toyota Borsa Finance Portal
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Piyasa ve portföy takibi
                        </Typography>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer /*mobilde geçici açılan sol yan menü */
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F6FF 100%)',
                            borderRight: '1px solid rgba(148, 163, 184, 0.2)',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer /*pcde kalıcı sol yan menü */
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F6FF 100%)',
                            borderRight: '1px solid rgba(148, 163, 184, 0.2)',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}/*burada render edilir kalıtımdan gelen*/
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}
