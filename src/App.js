import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpForm from "./components/common/SignUpForm";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { useSelector } from "react-redux";
import ForgotPassword from "./components/ForgotPassword";
import EmployeeRegistrationForm from "./components/EmployeeRegistrationForm";
import JobForm from "./components/Requirements/JobForm";
import  Dashboard  from "./components/Dashboard";

import Timesheet from './components/Timesheet'

function App() {
  const { roles } = useSelector((state) => state.auth);

  // console.log("User roles:", roles);
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/job" element={<JobForm />} />
        <Route path="/emp" element={<EmployeeRegistrationForm />} />


        {/* Protected Routes based on roles */}
        <Route
          path="/Admin"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Employee"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SuperAdmin"
          element={
            <ProtectedRoute role="SUPERADMIN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to Login */}
        <Route path="/" element={<SignUpForm />} />
        {/* <Route path="/addUser" element={<AddUser />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/timesheet" element={<Timesheet />} />
      </Routes>
    </Router>
  );
}

export default App;
