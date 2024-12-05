import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#091057", // Deep blue for primary elements
      contrastText: "#FFFFFF", // White text on primary
    },
    secondary: {
      main: "#73EC8B", // Bright green for secondary elements
      contrastText: "#000000", // Black text on secondary
    },
    accent: {
      main: "#4F75FF", // Vibrant blue for accents
    },
    error: {
      main: "#FF6B6B", // Soft red for errors
    },
    warning: {
      main: "#FFA726", // Orange for warnings
    },
    info: {
      main: "#29B6F6", // Light blue for information
    },
    success: {
      main: "#66BB6A", // Green for success states
    },
    background: {
      default: "#F5F8FA", // Light grey for the main background
      paper: "#FFFFFF", // Pure white for cards and paper components
    },
    text: {
      primary: "#091057", // Dark blue for primary text
      secondary: "#4F75FF", // Accent blue for secondary text
      disabled: "#9E9E9E", // Grey for disabled text
    },
    divider: "#E0E0E0", // Light grey for dividers
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Clean, modern font stack
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#091057",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#091057",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#091057",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#091057",
    },
    body1: {
      fontSize: "1rem",
      color: "#4F75FF",
    },
    body2: {
      fontSize: "0.9rem",
      color: "#091057",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    caption: {
      fontSize: "0.8rem",
      color: "#9E9E9E",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Softer corners
          padding: "8px 16px", // Spacing for better clickability
          fontWeight: 700, // Bold button text
          transition: "all 0.3s ease", // Smooth transitions
        },
        containedSkyblue: {
          backgroundColor: "#87CEEB", // Sky blue
          color: "#FFFFFF", // White text
          "&:hover": {
            backgroundColor: "#6AB6D7", // Darker sky blue on hover
          },
        },
        containedPrimary: {
          backgroundColor: "#091057",
          "&:hover": {
            backgroundColor: "#073b9b", // Deeper blue for hover
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Elevated hover effect
          },
        },
        containedSecondary: {
          backgroundColor: "#73EC8B",
          "&:hover": {
            backgroundColor: "#5dc377", // Darker green on hover
          },
        },
        outlined: {
          borderColor: "#091057",
          "&:hover": {
            borderColor: "#4F75FF",
            backgroundColor: "#E3F2FD",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#091057", // Bold label text
            fontWeight: "600",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#4F75FF",
              borderWidth: "2px", // Thicker border for a modern look
            },
            "&:hover fieldset": {
              borderColor: "#091057", // Focus blue on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#73EC8B", // Success green on focus
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderRadius: 16, // Smooth corners
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft card shadow
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#091057",
          color: "#FFFFFF",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.12)", // Light shadows for depth
    "0px 4px 6px rgba(0,0,0,0.1)",
    "0px 10px 15px rgba(0,0,0,0.2)",
  ],
});

export default theme;
