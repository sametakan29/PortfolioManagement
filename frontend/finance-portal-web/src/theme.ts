import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1B4DFF',
        },
        secondary: {
            main: '#00B894',
        },
        background: {
            default: '#F4F7FB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827',
            secondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.3px',
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    color: '#0F172A',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(27, 77, 255, 0.12)',
                        color: '#1B4DFF',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(27, 77, 255, 0.16)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
