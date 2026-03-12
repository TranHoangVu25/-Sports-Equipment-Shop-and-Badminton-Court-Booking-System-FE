// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../modules/auth/pages/LoginPage";
import MainLayout from "../layout/MainLayout"; // Import MainLayout bạn đã tạo

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* route mặc định có Header & Footer */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          } 
        />

        {/* route login có Header & Footer */}
        <Route 
          path="/login" 
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;