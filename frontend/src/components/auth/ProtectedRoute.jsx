import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Spinner } from "../ui";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        color: theme.textMuted, fontSize: 14, fontFamily: "inherit",
      }}>
        <Spinner size={22} /> Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}