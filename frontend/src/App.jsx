import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthPage from "./components/auth/AuthPage";
import Layout from "./components/layout/Layout";
import GeneratorPage from "./components/pages/GeneratorPage";
import ABPage from "./components/pages/ABPage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import HistoryPage from "./components/pages/HistoryPage";
import SavedPage from "./components/pages/SavedPage";
import { GuidePage, ProfilePage } from "./components/pages/GuidePage";
import { savedAPI } from "./services/api";

function AppRoutes() {
  const [saved, setSaved] = useState([]);

  // Load saved lines on mount
  useEffect(() => {
    savedAPI.getAll()
      .then(res => setSaved(res.data.lines || []))
      .catch(() => {});
  }, []);

  const handleSave = async (item) => {
    try {
      const res = await savedAPI.save(item);
      setSaved(p => [res.data.line, ...p]);
    } catch (err) {
      // 409 = already saved, ignore silently
      if (err.response?.status !== 409) console.error(err);
    }
  };

  return (
    <Layout savedCount={saved.length}>
      <Routes>
        <Route path="/"          element={<GeneratorPage onSave={handleSave} saved={saved} />} />
        <Route path="/ab"        element={<ABPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/history"   element={<HistoryPage />} />
        <Route path="/saved"     element={<SavedPage saved={saved} setSaved={setSaved} />} />
        <Route path="/guide"     element={<GuidePage />} />
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppRoutes />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}