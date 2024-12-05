import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './components/common/SignUpForm';
import ProtectedRoute from './components/ProtectedRoute';
// import Dashboard from './components/Dashboard';
import DashboardPage from './pages/DashboardPage';
import { useSelector}  from 'react-redux';
// import SignIn from './components/common/SignIn';



function App() {

  
  
  const { roles } = useSelector((state) => state.auth);

  console.log("User roles:", roles);
  return (
    <Router>
    <Routes>
      <Route path='/dashboard' element={<DashboardPage />}/>
      
      
      {/* Protected Routes based on roles */}
      <Route
        path="/Admin"
        element={
          <ProtectedRoute role="ADMIN">
            {/* <DashboardPage /> */}
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
    </Routes>
  </Router>
  );
}

export default App;
