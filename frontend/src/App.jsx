import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Remove BrowserRouter from here
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "./context/UserContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EditResume from "./components/EditResume";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Allow landing page access for everyone
  const currentPath = window.location.pathname;
  if (currentPath === "/") {
    return children;
  }

  // If user is logged in and trying to access login/signup, redirect to dashboard
  if (user && (currentPath === "/login" || currentPath === "/signup")) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div className="min-h-screen flex items-center justify-center p-6">
                  <Login />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <div className="min-h-screen flex items-center justify-center p-6">
                  <SignUp />
                </div>
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-resume/:resumeId"
            element={
              <ProtectedRoute>
                <EditResume />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
