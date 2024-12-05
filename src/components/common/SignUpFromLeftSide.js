import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AnimatedText from "./AnimatedText";
import React from "react";
import logo from "../../assets/1692036821878.jpg";

const SignUpFromLeftSide = () => {
  const theme = useTheme();
  
  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(246, 245, 245, 0.8)",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Top Moving Wave - Disable animation on mobile */}
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200%",
            height: "auto",
            zIndex: -1,
            animation: "moveWave 6s linear infinite", // Apply animation on larger screens
            "@media (max-width:600px)": {
              width: "300%", // Adjust width for mobile screens
              animation: "none", // Disable animation on mobile
            },
          }}
        >
          <path
            fill='#BFECFF'
            d="M0,48C48,64,96,80,144,85.3C192,91,240,85,288,69.3C336,53,384,27,432,32C480,37,528,75,576,80C624,85,672,59,720,53.3C768,48,816,64,864,80C912,96,960,112,1008,106.7C1056,101,1104,75,1152,64C1200,53,1248,59,1296,64C1344,69,1392,75,1416,80L1440,85L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
          />
        </Box>

        <Box sx={{ mb: 2, maxWidth: "100%", width: "auto" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain", // Ensures logo fits well
              width: "80%", // Default width for larger devices
              "@media (max-width:600px)": {
                width: "30%", // Smaller width on mobile devices
              },
              "@media (max-width:900px)": {
                width: "70%", // Medium width on tablets
              },
            }}
          />
        </Box>
        
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            color: theme.palette.text.main,
            fontSize: "3rem", // Ensures it's large on bigger screens
            "@media (max-width:600px)": {
              fontSize: "2rem", // Smaller on mobile
            },
          }}
        >
          Dataquad.inc
        </Typography>
        
        <AnimatedText />

        {/* Bottom Moving Wave */}
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "auto",
            transform: "rotate(180deg) scaleX(-1)",
            zIndex: -1,
            animation: "moveWave 6s linear infinite",
            "@media (max-width:600px)": {
              width: "300%", // Adjust width for mobile screens
            },
          }}
        >
          <path
            fill='#BFECFF'
            d="M0,48C48,64,96,80,144,85.3C192,91,240,85,288,69.3C336,53,384,27,432,32C480,37,528,75,576,80C624,85,672,59,720,53.3C768,48,816,64,864,80C912,96,960,112,1008,106.7C1056,101,1104,75,1152,64C1200,53,1248,59,1296,64C1344,69,1392,75,1416,80L1440,85L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
          />
        </Box> 
      </Grid>
    </Grid>
  );
};

export default SignUpFromLeftSide;
