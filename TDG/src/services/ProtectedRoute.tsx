import type React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";



function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to={"/login"} replace />
}

{/*<Route path="/admin" element={
    <ProtectedRoute>
        <AdminDashboardPage />
    </ProtectedRoute>
} />*/}

export default ProtectedRoute;