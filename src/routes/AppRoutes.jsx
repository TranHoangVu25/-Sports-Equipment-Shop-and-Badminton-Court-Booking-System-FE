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
import OrderDetailPage from "../modules/auth/pages/OrderDetailPage";
import CourtPage from "../modules/auth/pages/CourtPage";
import CourtDetailPage from "../modules/auth/pages/CourtDetailPage";
import CourtCheckoutPage from "../modules/auth/pages/CourtCheckoutPage";


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
        <Route path="/order-detail/:id" element={<MainLayout><OrderDetailPage /></MainLayout>} />
        <Route path="/courts" element={<CourtPage />} />
        <Route path="/court-detail/:id" element={<CourtDetailPage />} />
        <Route path="/court-checkout" element={<CourtCheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;