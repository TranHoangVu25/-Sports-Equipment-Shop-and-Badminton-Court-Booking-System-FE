import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  Bot,
  Percent,
  Settings,
  Infinity as InfinityIcon,
  LogOut,
  User,
  X
} from "lucide-react";

export const MainLayout = ({ children }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuClass = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-lg cursor-pointer transition
      ${
        isActive
          ? "bg-yellow-100 text-yellow-600 font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`;

  const iconClass = (isActive) =>
    `mr-3 ${isActive ? "text-yellow-600" : "text-gray-500"}`;

  const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây (ví dụ: xóa token, redirect)
    console.log("Đã đăng xuất");
    setShowLogoutConfirm(false);
    // window.location.href = "/login"; // Ví dụ chuyển hướng
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-16">
      {/* Top Header - Fixed Top Full Width */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b px-8 flex items-center justify-between z-30">
        {/* Tiêu đề bên trái (Logo & Branding) */}
        <div className="flex items-center space-x-3">
            <InfinityIcon className="text-yellow-600 w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-orange-400 to-yellow-600 bg-clip-text text-transparent">
              Chiikawa Admin
            </span>
        </div>

        {/* Khu vực bên phải: Ảnh, Tên, Đăng xuất */}
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm">
                    <User size={20} />
                </div>
                <span className="font-medium text-gray-700">Admin</span>
            </div>
            <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
                <LogOut size={18} className="mr-2" />
                <span>Đăng xuất</span>
            </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Thu hẹp từ w-64 xuống w-48 */}
        <aside className="w-48 bg-white shadow-lg fixed left-0 top-16 bottom-0 z-20 overflow-y-auto border-r border-gray-100">
          {/* Menu Items */}
          <nav className="p-4 space-y-1">
            <NavLink to="/dashboard/main" className={menuClass}>
              {({ isActive }) => (
                <>
                  <LayoutGrid size={20} className={iconClass(isActive)} />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/products" className={menuClass}>
              {({ isActive }) => (
                <>
                  <Package size={20} className={iconClass(isActive)} />
                  <span>Products</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/orders" className={menuClass}>
              {({ isActive }) => (
                <>
                  <ShoppingCart size={20} className={iconClass(isActive)} />
                  <span>Orders</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/users" className={menuClass}>
              {({ isActive }) => (
                <>
                  <Users size={20} className={iconClass(isActive)} />
                  <span>Customers</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/chatbot" className={menuClass}>
              {({ isActive }) => (
                <>
                  <Bot size={20} className={iconClass(isActive)} />
                  <span>Chatbot</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/promotions" className={menuClass}>
              {({ isActive }) => (
                <>
                  <Percent size={20} className={iconClass(isActive)} />
                  <span>Promotions</span>
                </>
              )}
            </NavLink>

          </nav>
        </aside>

        {/* Main Content Wrapper - Điều chỉnh margin-left từ ml-64 xuống ml-48 */}
        <main className="flex-1 ml-48 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Đăng xuất?</h3>
              <p className="text-gray-500 mb-6">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
              </p>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[100px]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors min-w-[100px]"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};