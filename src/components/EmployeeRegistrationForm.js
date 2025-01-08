// import React, { useState } from 'react';
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Alert,
//   Container,
// } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { submitEmployeeData, resetState } from '../redux/features/employeeSliceexample';

// const EmployeeRegistrationForm = () => {
//   const dispatch = useDispatch();
//   const { loading, success, apiErrors, userData } = useSelector((state) => state.employee);

//   const [formData, setFormData] = useState({
//     userId: 'DQIND', // Start with "DQIND"
//     userName: '',
//     email: '',
//     personalEmail: '',
//     phoneNumber: '',
//     joiningDate: '',
//     dateOfBirth: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [validationErrors, setValidationErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Clear validation error on change
//     setValidationErrors({ ...validationErrors, [name]: '' });
//   };

//   const validateField = (name, value) => {
//     let error = '';

//     if (name === 'userId' && !/^DQIND[0-9A-Z]+$/.test(value)) {
//       error = 'User ID must start with "DQIND" followed by alphanumeric characters.';
//     }

//     if (name === 'email' && !value.includes('dataqinc.com')) {
//       error = 'Email must include "dataqinc.com"';
//     }

//     if (name === 'dateOfBirth' && new Date(value) >= new Date()) {
//       error = 'Date of Birth must be in the past.';
//     }

//     if (name === 'password' && value.length < 8) {
//       error = 'Password must be at least 8 characters long.';
//     }

//     setValidationErrors({ ...validationErrors, [name]: error });
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     validateField(name, value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Final validation
//     const errors = {};
//     Object.keys(formData).forEach((field) => {
//       validateField(field, formData[field]);
//       if (validationErrors[field]) {
//         errors[field] = validationErrors[field];
//       }
//     });

//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors);
//       return;
//     }

//     dispatch(submitEmployeeData(formData));
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: '#f9f9f9' }}>
//         <Typography variant="h5" gutterBottom align="center">
//           Employee Registration
//         </Typography>

//         {success && (
//           <Alert severity="success">
//             Registration Successful! User ID: {userData.userId}, Email: {userData.email}
//           </Alert>
//         )}
//         {apiErrors.message && <Alert severity="error">{apiErrors.message}</Alert>}

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="User ID"
//             name="userId"
//             value={formData.userId}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={!!validationErrors.userId || !!apiErrors.userId}
//             helperText={validationErrors.userId || apiErrors.userId}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="User Name"
//             name="userName"
//             value={formData.userName}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Work Email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={!!validationErrors.email || !!apiErrors.email}
//             helperText={validationErrors.email || apiErrors.email}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Personal Email"
//             name="personalEmail"
//             value={formData.personalEmail}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Phone Number"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             error={!!apiErrors.phoneNumber}
//             helperText={apiErrors.phoneNumber}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Joining Date"
//             name="joiningDate"
//             type="date"
//             value={formData.joiningDate}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Date of Birth"
//             name="dateOfBirth"
//             type="date"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={!!validationErrors.dateOfBirth}
//             helperText={validationErrors.dateOfBirth}
//             InputLabelProps={{ shrink: true }}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={!!validationErrors.password}
//             helperText={validationErrors.password}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Confirm Password"
//             name="confirmPassword"
//             type="password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//             disabled={loading}
//           >
//             {loading ? 'Submitting...' : 'Register'}
//           </Button>
//         </form>
//       </Box>
//     </Container>
//   );
// };

// export default EmployeeRegistrationForm;
