// src/routes/AppRoutes.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../modules/auth/pages/LoginPage";

// <-- THÊM 2 DÒNG NÀY (Hãy sửa lại đường dẫn thư mục cho đúng với dự án của bạn nhé)
import CartPage from "../modules/auth/pages/CartPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import HomePage from "../modules/auth/pages/HomePage";
import ProductDetailPage from "../modules/auth/pages/ProductDetailPage";
import ProfilePage from "../modules/auth/pages/ProfilePage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ResetPassworPage from "../modules/auth/pages/ResetPassworPage";
import SearchPage from "../modules/auth/pages/SearchPage";
import CheckoutPage from "../modules/auth/pages/CheckoutPage";


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
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/product-detail/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/checkout" element={<CheckoutPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;