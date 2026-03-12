import {
    ChevronDown,
    Gamepad2,
    MapPin,
    Phone,
    Search,
    ShoppingCart,
    User
} from 'lucide-react';
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
  return (
    <div className="!bg-white py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Logo />
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium !text-gray-700">
          <div className="flex items-center space-x-2">
            <Phone size={18} className="!text-[#eb5322]" />
            <span>HOTLINE: <span className="!text-[#eb5322]">0977508430 | 0338000308</span></span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:!text-[#eb5322] transition-colors">
            <MapPin size={18} className="!text-[#eb5322]" />
            <span>HỆ THỐNG CỬA HÀNG</span>
          </div>
        </div>
        <div className="flex-1 w-full md:w-auto max-w-md mx-auto md:mx-4 relative">
          <input 
            type="text" 
            placeholder="Tìm sản phẩm..." 
            className="!w-full !bg-gray-100 !text-gray-900 border-none rounded-full py-2.5 px-5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all placeholder-gray-500"
          />
          <Search size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 !text-gray-400 cursor-pointer hover:!text-[#eb5322]" />
        </div>
        <div className="flex items-center justify-center space-x-6">
          <div className="flex flex-col items-center justify-center cursor-pointer !text-gray-600 hover:!text-[#eb5322] transition-colors group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <Gamepad2 size={20} />
            </div>
            <span className="text-[10px] uppercase font-semibold">Tra cứu</span>
          </div>
          <div className="flex flex-col items-center justify-center cursor-pointer !text-gray-600 hover:!text-[#eb5322] transition-colors group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <User size={20} />
            </div>
            <span className="text-[10px] uppercase font-semibold">Tài khoản</span>
          </div>
          <div className="flex flex-col items-center justify-center cursor-pointer !text-gray-600 hover:!text-[#eb5322] transition-colors relative group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors relative">
               <ShoppingCart size={20} />
               <span className="absolute -top-1 -right-1 !bg-[#eb5322] !text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">0</span>
            </div>
            <span className="text-[10px] uppercase font-semibold">Giỏ hàng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const navItems = [
    { label: 'TRANG CHỦ', hasDropdown: false },
    { label: 'SẢN PHẨM', hasDropdown: true },
    { label: 'SALE OFF', hasDropdown: false },
    { label: 'TIN TỨC', hasDropdown: false },
    { label: 'CHÍNH SÁCH NHƯỢNG QUYỀN', hasDropdown: false },
    { label: 'HƯỚNG DẪN', hasDropdown: true },
    { label: 'GIỚI THIỆU', hasDropdown: false },
    { label: 'LIÊN HỆ', hasDropdown: false },
  ];

  return (
    <nav className="!bg-[#eb5322] !text-white w-full">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar w-full">
        <ul className="flex items-center justify-start md:justify-center whitespace-nowrap">
          {navItems.map((item, index) => (
            <li key={index} className="group relative">
              <a 
                href="#" 
                className="flex items-center px-4 py-3.5 text-sm font-semibold !text-white hover:!text-gray-100 hover:!bg-black/10 transition-colors !no-underline"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="ml-1 opacity-70" />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Main Header Component xuất ra để dùng
const Header = () => (
  <header className="sticky top-0 z-40 !bg-white shadow-sm w-full">
    <TopBar />
    <Navigation />
  </header>
);

export default Header;