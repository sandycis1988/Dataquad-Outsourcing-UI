import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e0f7fa', // Light cyan (from your provided color)
    },
    secondary: {
      main: '#fff', // White (you can keep this or change to a different color if needed)
    },
    background: {
      default: '#f9f9f9', // Light gray background (from your provided color)
      paper: '#fff',      // White for paper/card background
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded buttons
        },
      },
    },
  },
});

export default theme;
