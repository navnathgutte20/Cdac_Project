import { createTheme } from '@mui/material/styles'

// ---------------------------------------------------------------------------
// FarmaFriend design tokens
// Palette:  fern (primary) · saffron (accent) · ink (text) · paper (bg)
// Type:     Fraunces (display, used sparingly) · Plus Jakarta Sans (UI/body)
//           IBM Plex Mono (prices, order IDs, tracking numbers)
// ---------------------------------------------------------------------------

export const tokens = {
  fern: '#0B6E4F',
  fernDark: '#084F39',
  fernLight: '#E4F1EA',
  saffron: '#E8A33D',
  saffronDark: '#C6822A',
  ink: '#16241F',
  inkMuted: '#5B6B63',
  paper: '#F3F6F4',
  surface: '#FFFFFF',
  border: '#E1E8E3',
  danger: '#C0392B',
  info: '#1C7C8C',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.fern, dark: tokens.fernDark, light: tokens.fernLight, contrastText: '#FFFFFF' },
    secondary: { main: tokens.saffron, dark: tokens.saffronDark, contrastText: tokens.ink },
    error: { main: tokens.danger },
    info: { main: tokens.info },
    success: { main: '#2F7D52' },
    warning: { main: tokens.saffron },
    background: { default: tokens.paper, paper: tokens.surface },
    text: { primary: tokens.ink, secondary: tokens.inkMuted },
    divider: tokens.border,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h2: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h3: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h4: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600 },
    h5: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0.2 },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.875rem' },
    overline: { letterSpacing: 1.4, fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.paper },
        '::selection': { backgroundColor: tokens.saffron, color: tokens.ink },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20, boxShadow: 'none' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 6px 16px rgba(11,110,79,0.22)' } },
        sizeLarge: { paddingTop: 10, paddingBottom: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 14 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${tokens.border}`,
          boxShadow: '0 1px 2px rgba(22,36,31,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: tokens.inkMuted,
          backgroundColor: tokens.paper,
          borderBottom: `1px solid ${tokens.border}`,
        },
        body: { borderBottom: `1px solid ${tokens.border}` },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: `1px solid ${tokens.border}` },
      },
    },
  },
})

export default theme
