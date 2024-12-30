import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpForm from "./components/common/SignUpForm";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { useSelector } from "react-redux";

import JobForm from "./components/Requirements/JobForm";
import LeaveApplication from "./components/LeaveApplication";




function App() {
  const { roles } = useSelector((state) => state.auth);

  // console.log("User roles:", roles);
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage/>} />
        



        {/* Protected Routes based on roles */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="EMPLOYEE">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="SUPERADMIN">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to Login */}
        <Route path="/" element={<SignUpForm />} />
        <Route path="/jobform" element={<JobForm />} />
        <Route path="/leave" element={<LeaveApplication />} />

      
      </Routes>
    </Router>
  );
}

export default App;
