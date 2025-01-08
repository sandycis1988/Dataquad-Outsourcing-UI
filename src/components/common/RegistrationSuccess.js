import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const RegistrationSuccess = ({ message,email, userId  }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        maxWidth: 400,
        margin: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: "green", fontWeight: "bold", mb: 2 }}
      >
        {message || "Registration Successful!"}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>User Email</strong> {email}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>User ID:</strong> {userId}
      </Typography>
      
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={()=>navigate('/') }
        >
          Go to Login
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationSuccess;
