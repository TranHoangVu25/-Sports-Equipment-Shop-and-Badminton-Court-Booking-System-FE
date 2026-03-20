// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../modules/auth/pages/LoginPage";

// <-- THÊM 2 DÒNG NÀY (Hãy sửa lại đường dẫn thư mục cho đúng với dự án của bạn nhé)
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import HomePage from "../modules/auth/pages/HomePage";
import ProfilePage from "../modules/auth/pages/ProfilePage";
import ResetPassworPage from "../modules/auth/pages/ResetPassworPage";
import CartPage from "../modules/auth/pages/CartPage";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPassworPage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;