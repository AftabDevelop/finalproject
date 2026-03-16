import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import AIProblemTestCases from "./components/AIProblemTestCases";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import { checkAuth } from "./authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Home: unauth -> Landing, auth -> Homepage */}
      <Route
        path="/"
        element={isAuthenticated ? <Homepage /> : <LandingPage />}
      />

      {/* Onboarding (signup se pehle, auth required nahi) */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />

      {/* Leaderboard - only logged-in users */}
      <Route
        path="/leaderboard"
        element={
          isAuthenticated ? <LeaderboardPage /> : <Navigate to="/login" />
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/create"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/delete"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminDelete />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/update"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminUpdate />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Problem page */}
      <Route path="/problem/:problemId" element={<ProblemPage />} />

      {/* AI Test Case Generator – protected admin route */}
      <Route
        path="/admin/ai-testcases"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AIProblemTestCases />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
