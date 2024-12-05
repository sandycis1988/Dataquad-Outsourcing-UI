// src/components/SignIn.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../../redux/features/authSlice";
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Dispatch the loginAsync action with email and password
    dispatch(loginAsync({ email, password }))
      // .then((user) => {
        // // After successful login, navigate based on the user's role
        // if (user.roles.includes("ADMIN")) {
        //   navigate("/Admin");
        // } else if (user.roles.includes("EMPLOYEE")) {
        //   navigate("/Employee");
        // } else if (user.roles.includes("SUPERADMIN")) {
        //   navigate("/SuperAdmin");
        // }
        navigate('/SuperAdmin')
      // })
      // .catch((error) => {
      //   // Handle login error
      //   console.log("Login failed:", error);
      // });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Title */}
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign In
        </Typography>

        {/* Error message */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Email Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          {/* Password Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          
          {/* Submit Button */}
          <Box sx={{display:'flex', justifyContent:'space-evenly'}}>

            {/* Forgot Password Link */}
          <Link href="/forgot-password" variant="body2" sx={{ mt: 2 }}>
            Forgot Password?
          </Link>

            <Button
              type="submit"
              md={1}
              variant="contained"
              sx={{ mt: 3, mb: 2 ,ml:22}}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <CircularProgress size={24} />
              ) : (
                "Sign In"
              )}
            </Button>
            
          </Box>

          {/* Optionally show authentication success or error */}
          {isAuthenticated && (
            <Typography color="green">Login successful!</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
