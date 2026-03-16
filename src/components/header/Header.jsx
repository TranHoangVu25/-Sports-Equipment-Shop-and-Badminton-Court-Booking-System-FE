import {
  ChevronDown,
  Gamepad2,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 L40 60 L60 20 Z" fill="black" />
      <path d="M40 80 L60 40 L80 80 Z" fill="black" />
    </svg>
    <span className="font-extrabold text-2xl tracking-tighter !text-gray-900">VNB</span>
  </div>
);

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8085/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
  };

  return (
    <div className="!bg-white py-4 border-b border-gray-100 relative z-[1000]">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Logo />
        </div>
        
        {/* Liên hệ */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium !text-gray-700">
          <div className="flex items-center space-x-2">
            <Phone size={18} className="!text-[#eb5322]" />
            <span>HOTLINE: <span className="!text-[#eb5322]">0977508430</span></span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:!text-[#eb5322]">
            <MapPin size={18} className="!text-[#eb5322]" />
            <span>HỆ THỐNG CỬA HÀNG</span>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="flex-1 w-full md:w-auto max-w-md mx-auto md:mx-4 relative">
          <input 
            type="text" 
            placeholder="Tìm sản phẩm..." 
            className="!w-full !bg-gray-100 border-none rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none"
          />
          <Search size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 !text-gray-400" />
        </div>
        
        {/* Hành động */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <Gamepad2 size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tra cứu</span>
          </div>
          
          {/* USER ACCOUNT DROPDOWN */}
          <div className="flex flex-col items-center cursor-pointer relative group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <User size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tài khoản</span>

            {/* Menu thả xuống - Sử dụng left-1/2 và -translate-x-1/2 để căn giữa chính xác */}
            <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 w-48 pt-2 z-[9999]">
              <div className="!bg-white border border-gray-200 shadow-2xl rounded-sm relative">
                {/* Mũi tên trỏ lên - Căn giữa luôn */}
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 !bg-white border-t border-l border-gray-200 rotate-45 z-0"></div>
                
                <ul className="relative z-10 py-2 m-0 list-none !bg-white">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
                          <User size={16} className="mr-3" />
                          Trang cá nhân
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] border-none !bg-transparent cursor-pointer font-sans transition-colors">
                          <LogOut size={16} className="mr-3" />
                          Thoát tài khoản
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors border-b border-gray-50">
                          <LogIn size={16} className="mr-3" />
                          Đăng nhập
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
                          <UserPlus size={16} className="mr-3" />
                          Đăng ký ngay
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center cursor-pointer group relative">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 relative">
               <ShoppingCart size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
               <span className="absolute -top-1 -right-1 !bg-[#eb5322] !text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">0</span>
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Giỏ hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const navItems = [
    { label: 'TRANG CHỦ', link: "/" },
    { label: 'SẢN PHẨM', hasDropdown: true, link: "#" },
    { label: 'SALE OFF', link: "#" },
    { label: 'TIN TỨC', link: "#" },
    { label: 'NHƯỢNG QUYỀN', link: "#" },
    { label: 'HƯỚNG DẪN', hasDropdown: true, link: "#" },
    { label: 'GIỚI THIỆU', link: "#" },
    { label: 'LIÊN HỆ', link: "#" },
  ];

  return (
    <nav className="!bg-[#eb5322] !text-white w-full sticky top-0 z-[90]">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex items-center justify-center whitespace-nowrap m-0 p-0 list-none">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.link} className="flex items-center px-5 py-3.5 text-xs font-bold !text-white hover:!bg-black/10 transition-colors !no-underline uppercase tracking-wider">
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="ml-1 opacity-70" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const Header = () => (
  <header className="w-full relative z-[1000]">
    <TopBar />
    <Navigation />
  </header>
);

export default Header;