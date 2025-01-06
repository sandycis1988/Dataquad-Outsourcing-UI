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
    "0px 12px 24px rgba(0,0,0,0.3)", // Shadow 4
    "0px 15px 30px rgba(0,0,0,0.4)", // Shadow 5
    "0px 20px 40px rgba(0,0,0,0.5)", // Shadow 6
    "0px 25px 50px rgba(0,0,0,0.6)", // Shadow 7
    "0px 30px 60px rgba(0,0,0,0.7)", // Shadow 8
    "0px 35px 70px rgba(0,0,0,0.8)", // Shadow 9
    "0px 40px 80px rgba(0,0,0,0.9)", // Shadow 10
    "0px 45px 90px rgba(0,0,0,1)", // Shadow 11
    "0px 50px 100px rgba(0,0,0,1.1)", // Shadow 12
    "0px 55px 110px rgba(0,0,0,1.2)", // Shadow 13
    "0px 60px 120px rgba(0,0,0,1.3)", // Shadow 14
    "0px 65px 130px rgba(0,0,0,1.4)", // Shadow 15
    "0px 70px 140px rgba(0,0,0,1.5)", // Shadow 16
    "0px 75px 150px rgba(0,0,0,1.6)", // Shadow 17
    "0px 80px 160px rgba(0,0,0,1.7)", // Shadow 18
    "0px 85px 170px rgba(0,0,0,1.8)", // Shadow 19
    "0px 90px 180px rgba(0,0,0,1.9)", // Shadow 20
    "0px 95px 190px rgba(0,0,0,2)", // Shadow 21
    "0px 100px 200px rgba(0,0,0,2.1)", // Shadow 22
    "0px 105px 210px rgba(0,0,0,2.2)", // Shadow 23
    "0px 110px 220px rgba(0,0,0,2.3)", // Shadow 24
  ],
});

export default theme;
