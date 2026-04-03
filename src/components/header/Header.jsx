import React, { useEffect, useState } from 'react';
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
  UserPlus,
  X,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- DATA MEGA MENU ---
const MENU_DATA = [
  {
    main: "Vợt Cầu Lông",
    subs: ["Vợt cầu lông Yonex", "Vợt cầu lông Victor", "Vợt cầu lông Lining", "Vợt Cầu Lông VS", "Vợt Cầu Lông Mizuno", "Vợt Cầu Lông Apacs", "Vợt Cầu Lông VNB", "Vợt cầu lông Proace", "Vợt cầu lông Forza", "Vợt Cầu Lông FlyPower"],
    hasMore: true
  },
  {
    main: "Giày Cầu Lông",
    subs: ["Giày cầu lông Yonex", "Giày cầu lông Victor", "Giày cầu lông Lining", "Giày cầu lông VS", "Giày cầu lông Kawasaki", "Giày Cầu Lông Mizuno", "Giày Cầu Lông Kumpoo", "Giày Cầu Lông Promax", "Giày cầu lông Babolat", "Giày Cầu Lông Sunbatta"],
    hasMore: true
  },
  {
    main: "Áo Cầu Lông",
    subs: ["Áo cầu lông Yonex", "Áo cầu lông VNB", "Áo cầu lông Kamito", "Áo cầu lông VS", "Áo cầu lông Victor", "Áo cầu lông Lining", "Áo cầu lông DonexPro", "Áo Cầu Lông Alien Armour", "Áo thể thao SFD", "Áo cầu lông Kawasaki"],
    hasMore: true
  },
  {
    main: "Váy Cầu Lông",
    subs: ["Váy cầu lông Yonex", "Váy cầu lông Victec", "Váy cầu lông Lining", "Váy Cầu Lông Donex Pro", "Váy cầu lông Victor", "Váy cầu lông Kamito", "Váy cầu lông Taro"],
    hasMore: false
  },
  {
    main: "Quần Cầu Lông",
    subs: ["Quần cầu lông Yonex", "Quần cầu lông Victor", "Quần cầu lông Lining", "Quần cầu lông VNB", "Quần Cầu Lông SFD", "Quần cầu lông Donex Pro", "Quần Cầu Lông Apacs", "QUẦN CẦU LÔNG ALIEN AMOUR", "Quần cầu lông Mizuno", "Quần cầu lông Kawasaki"],
    hasMore: true
  },
  {
    main: "Túi Vợt Cầu Lông",
    subs: ["Túi vợt cầu lông Yonex", "Túi đựng giày", "Túi vợt cầu lông VS", "Túi vợt cầu lông Victor", "Túi vợt cầu lông Lining", "Túi vợt cầu lông Kason", "Túi vợt cầu lông Kawasaki", "Túi vợt cầu lông Forza", "Túi Vợt Cầu Lông Apacs", "Túi vợt cầu lông Mizuno"],
    hasMore: true
  },
  {
    main: "Balo Cầu Lông",
    subs: ["Balo Cầu Lông Yonex", "Balo cầu lông VS", "Balo cầu lông Victor", "Balo cầu lông Kawasaki", "Balo cầu lông Flypower", "Balo cầu lông Mizuno", "Balo cầu lông VNB", "Balo cầu lông Adonex", "Balo cầu lông Forza", "Balo cầu lông Lining"],
    hasMore: true
  },
  {
    main: "Phụ Kiện Cầu Lông",
    subs: ["Vớ Cầu Lông", "Cước đan vợt cầu lông", "Quả cầu lông", "Banh Power Ball", "Bình nước cầu lông", "Băng bó cơ", "Móc khóa cầu lông", "Quấn cán cầu lông", "Lót giày cầu lông", "Băng chặn mồ hôi"],
    hasMore: true
  },
  {
    main: "Vợt Pickleball",
    subs: ["Vợt PickleBall Head", "Vợt PickleBall Joola", "Vợt Pickleball Prokennex", "Vợt Pickleball Passion", "Vợt Pickleball Beesoul", "Vợt Pickleball Selkirk", "Vợt Pickleball Babolat", "Vợt Pickleball Wilson", "Vợt Pickleball Gamma", "Vợt Pickleball Amakirk"],
    hasMore: true
  },
  {
    main: "Giày Pickleball",
    subs: ["Giày Pickleball Jogarbola", "Giày Pickleball Asics", "Giày Pickleball Nike", "Giày Pickleball Joola", "Giày Pickleball Diadem", "Giày Pickleball Kamito", "Giày Pickleball Promax", "Giày Pickleball Kaiwin", "Giày Pickleball Lining", "Giày Pickleball Zocker"],
    hasMore: true
  },
  {
    main: "Túi Pickleball",
    subs: ["Túi Pickleball Joola", "Túi Pickleball Kamito", "Túi Pickleball Proton", "Túi Pickleball Spikopoll", "Túi Pickleball Wilson", "Túi Pickleball CRBN"],
    hasMore: true
  },
  {
    main: "Áo Pickleball",
    subs: ["Áo Pickleball Babolat", "Áo Pickleball Joola", "Áo Pickleball Kaiwin", "Áo Pickleball Kamito", "Áo Pickleball Selkirk", "Áo Pickleball Skechers"],
    hasMore: false
  },
  {
    main: "Quần Pickleball",
    subs: ["Quần Pickleball Babolat", "Quần Pickleball Joola", "Quần Pickleball Kaiwin", "Quần Pickleball Kamito"],
    hasMore: false
  },
  {
    main: "Bóng Pickleball",
    subs: ["Bóng Pickleball Joola", "Bóng Pickleball Bamboo", "Bóng Pickleball Diadem", "Bóng Pickleball Facolos", "Bóng Pickleball Franklin", "Bóng Pickleball Gamicy", "Bóng Pickleball Gamma", "Bóng Pickleball Kaiwin", "Bóng Pickleball Kamito", "Bóng Pickleball Lining"],
    hasMore: true
  },
  {
    main: "Váy Pickleball",
    subs: ["Váy Pickleball Kamito"],
    hasMore: false
  },
  {
    main: "Phụ Kiện Pickleball",
    subs: ["Lưới pickleball", "Quấn Cán Vợt Pickleball", "Bảo vệ khung vợt Pickleball", "Tẩy mặt vợt Pickleball", "Túi đơn đựng vợt Pickleball", "Túi bọc đầu vợt Pickleball"],
    hasMore: false
  },
  {
    main: "Balo Pickleball",
    subs: ["Balo Pickleball Joola", "Balo Pickleball Selkirk", "Balo Pickleball Wilson", "Balo Pickleball Arronax", "Balo Pickleball CRBN", "Balo Pickleball Kaiwin", "Balo Pickleball Kumpoo", "Balo Pickleball Gamicy", "Balo Pickleball Zocker", "Balo Pickleball Facolos"],
    hasMore: true
  },
  {
    main: "Vợt Tennis",
    subs: ["Vợt Tennis Wilson", "Vợt Tennis Babolat", "Vợt Tennis Yonex", "Vợt Tennis Head", "Vợt Tennis Prince", "Vợt Tennis Tecnifibre"],
    hasMore: false
  },
  {
    main: "Giày Tennis",
    subs: ["Giày Tennis Asics", "Giày Tennis Yonex", "Giày Tennis Adidas", "Giày Tennis Nike", "Giày Tennis Mizuno", "Giày Tennis Prince", "Giày Tennis Babolat", "Giày tennis Jogarbola", "Giày tennis Wilson", "Giày tennis Head"],
    hasMore: true
  },
  {
    main: "Balo Tennis",
    subs: ["Balo Tennis Wilson", "Balo Tennis Babolat", "Balo Tennis Prince", "Balo Tennis Head"],
    hasMore: false
  },
  {
    main: "Túi Tennis",
    subs: ["Túi Tennis Wilson", "Túi Tennis Babolat", "Túi Tennis Nike", "Túi Tennis Head", "Túi Tennis Adidas", "Túi Tennis Tecnifibre", "Túi tennis Prince", "Túi Tennis Kumpoo", "Túi Tennis Hundred"],
    hasMore: true
  },
  {
    main: "Chân Váy Tennis",
    subs: ["Váy tennis Babolat"],
    hasMore: false
  },
  {
    main: "Áo Tennis",
    subs: ["Áo tennis Adidas", "Áo tennis Babolat", "Áo tennis Donex Pro", "Áo tennis Nike", "Áo tennis Uniqlo", "Áo tennis Vina Authentic", "Áo tennis Wilson"],
    hasMore: false
  },
  {
    main: "Quần Tennis",
    subs: ["Quần tennis Adidas", "Quần tennis Babolat", "Quần Tennis Donex Pro MSC-2030 Đen Phối Trắng Chính Hãng", "Quần tennis Nike", "Quần tennis Uniqlo", "Quần tennis Wilson"],
    hasMore: false
  },
  {
    main: "Phụ Kiện Tennis",
    subs: ["Cước Tennis (dây đan vợt tennis)", "Băng chặn mồ hôi Tennis", "Quấn Cán Vợt Tennis", "Khăn lau mồ hôi tennis"],
    hasMore: false
  },
  {
    main: "Máy Đan và Thảm Cầu Lông",
    subs: ["Máy Đan Vợt Cầu Lông", "Thảm Sân Cầu Lông", "Thảm cầu lông Mini"],
    hasMore: false
  },
  {
    main: "Giày Running",
    subs: ["Giày chạy bộ Yonex Running SAFERUN 350 Đỏ chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Trắng chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Xanh Đen chính hãng", "Giày Running Victor 701CR-2018 Đỏ", "Giày Running Victor 701CR-2018 Xanh"],
    hasMore: false
  },
  {
    main: "Ghế Massage",
    subs: ["Ghế Massage Giá Rẻ", "Ghế Massage Trung Cấp", "Ghế Massage Thương Gia", "Ghế massage Kingsport", "Ghế massage Queen Crown", "Ghế massage Tokuyo", "Ghế massage Kagawa", "Ghế massage KLC", "Ghế massage Okasa", "Ghế massage Toshiko"],
    hasMore: true
  },
  {
    main: "Máy Massage",
    subs: ["Máy Massage Mắt Azaki E191 Plus chính hãng", "Máy Massage Cổ Azaki N109 Plus chính hãng", "Máy Massage Lưng & Bụng Azaki W122 chính hãng", "Máy Massage Bụng Azaki Slim Beauty A150 chính hãng", "Máy (Súng) Massage Cầm Tay Azaki G188 chính hãng"],
    hasMore: false
  },
  {
    main: "Máy Chạy Bộ, Xe Đạp Tập",
    subs: ["Máy chạy bộ Azaki Helios H8500 chính hãng", "Máy chạy bộ Azaki Hercules H6000 chính hãng", "Máy chạy bộ Azaki Mercury M1000 chính hãng", "Máy chạy bộ Azaki TH666 chính hãng", "Máy chạy bộ Azaki Zeus Z9100 chính hãng", "Xe đạp tập Azaki Apollo SB380 chính hãng", "Xe đạp tập Azaki Olympus SB450 chính hãng"],
    hasMore: false
  },
  {
    main: "Mũ",
    subs: ["Mũ Bucket Victoc OnePiece Limited", "Mũ lưỡi trai Victor OnePiece Limited", "Mũ cầu lông Victor Hello Kitty", "Mũ cầu lông Victor Hello Kitty VC-KT213 I Hồng"],
    hasMore: false
  },
  {
    main: "Phụ Kiện Sưu Tầm",
    subs: ["Túi", "Túi bút", "Bút"],
    hasMore: false
  }
];

const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 L40 60 L60 20 Z" fill="black" />
      <path d="M40 80 L60 40 L80 80 Z" fill="black" />
    </svg>
    <span className="font-extrabold text-2xl tracking-tighter !text-gray-900">VNB</span>
  </div>
);

const Header = () => {
  // --- TẠO STATE QUẢN LÝ VIỆC ĐÓNG MENU ---
  const [forceCloseMenu, setForceCloseMenu] = useState(false);

  // Hàm xử lý chung khi hoàn tất một hành động (nhấn search hoặc chọn menu)
  const handleActionComplete = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setForceCloseMenu(true);
    setTimeout(() => {
      setForceCloseMenu(false);
    }, 150);
  };

  // ==========================================
  // TOPBAR COMPONENT
  // ==========================================
  const TopBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (token) {
        fetchCart(); 
      }
    }, []);

    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8086/api/v1/cart/get-user-cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (response.ok && data.code === 0 && data.result) {
          setCartItems(data.result.cartItems || []);
          setTotalPrice(data.result.totalPrice || 0);
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng trên Header:', error);
      }
    };

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

    const handleSearch = (e) => {
      if (e.key === 'Enter' && searchValue.trim()) {
        navigate(`/search?name=${encodeURIComponent(searchValue.trim())}`);
        handleActionComplete();
      }
    };

    const handleSearchClick = () => {
      if (searchValue.trim()) {
        navigate(`/search?name=${encodeURIComponent(searchValue.trim())}`);
        handleActionComplete();
      }
    };

    const formatPrice = (price) => {
      return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
    };

    const handleCartHover = () => {
      if (isLoggedIn) {
        fetchCart();
      }
    };

    return (
      <div className="!bg-white py-4 border-b border-gray-100 relative z-[1000]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="w-full md:w-auto flex justify-center md:justify-start !no-underline" onClick={handleActionComplete}>
            <Logo />
          </Link>
          
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium !text-gray-700">
            <div className="flex items-center space-x-2">
              <Phone size={18} className="!text-[#eb5322]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 leading-none">HOTLINE:</span>
                <span className="!text-[#eb5322] font-bold">0977508430 | 0338000308</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:!text-[#eb5322]">
              <MapPin size={18} className="!text-[#eb5322]" />
              <span className="font-bold uppercase text-[11px]">Hệ thống cửa hàng</span>
            </div>
          </div>

          <div className="flex-1 w-full md:w-auto max-w-md mx-auto md:mx-4 relative">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              className="!w-full !bg-gray-100 border-none rounded-sm py-2 px-4 pr-10 text-sm focus:outline-none placeholder:italic focus:ring-1 focus:ring-[#eb5322] transition-shadow"
            />
            <Search 
              size={18} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 !text-gray-400 cursor-pointer hover:!text-[#eb5322] transition-colors" 
              onClick={handleSearchClick}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
                 <Gamepad2 size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
              </div>
              <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tra cứu</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer relative group">
              <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
                 <User size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
              </div>
              <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tài khoản</span>

              <div className={`hidden ${forceCloseMenu ? '' : 'group-hover:block'} absolute top-full left-1/2 transform -translate-x-1/2 w-48 pt-2 z-[9999]`}>
                <div className="!bg-white border border-gray-200 shadow-2xl rounded-sm relative">
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 !bg-white border-t border-l border-gray-200 rotate-45 z-0"></div>
                  <ul className="relative z-10 py-2 m-0 list-none !bg-white">
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link to="/profile" onClick={handleActionComplete} className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
                            <User size={16} className="mr-3" />
                            Trang cá nhân
                          </Link>
                        </li>
                        <li>
                          <button onClick={() => {handleLogout(); handleActionComplete();}} className="w-full flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] border-none !bg-transparent cursor-pointer font-sans transition-colors">
                            <LogOut size={16} className="mr-3" />
                            Thoát tài khoản
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/login" onClick={handleActionComplete} className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors border-b border-gray-50">
                            <LogIn size={16} className="mr-3" />
                            Đăng nhập
                          </Link>
                        </li>
                        <li>
                          <Link to="/register" onClick={handleActionComplete} className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
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

            <div 
              className="flex flex-col items-center cursor-pointer group relative"
              onMouseEnter={handleCartHover}
            >
              <div 
                onClick={() => { navigate('/cart'); handleActionComplete(); }}
                className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 relative"
              >
                 <ShoppingCart size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
                 {cartItems.length > 0 && (
                   <span className="absolute -top-1 -right-1 !bg-[#eb5322] !text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                     {cartItems.length}
                   </span>
                 )}
              </div>
              <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Giỏ hàng</span>

              <div className={`hidden ${forceCloseMenu ? '' : 'group-hover:block'} absolute top-full right-0 w-[320px] pt-2 z-[9999]`}>
                <div className="!bg-white border border-gray-200 shadow-2xl rounded-sm overflow-hidden">
                  <div className="!bg-[#eb5322] !text-white text-[11px] font-bold px-3 py-2 uppercase">
                    Giỏ hàng
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {!isLoggedIn ? (
                      <div className="p-6 text-center text-xs text-gray-500 italic">
                        Vui lòng <Link to="/login" className="text-[#eb5322] hover:underline font-bold">đăng nhập</Link> để xem giỏ hàng.
                      </div>
                    ) : cartItems.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500 italic">
                        Giỏ hàng trống
                      </div>
                    ) : (
                      cartItems.slice(0, 3).map((item) => {
                        const hasSize = item.size && item.size.toLowerCase() !== 'default';
                        const displaySize = hasSize ? String(item.size).replace('-', '.') : '';

                        return (
                          <div key={item.cartItemId} className="p-3 flex gap-3 relative group/item hover:bg-gray-50 transition-colors">
                            <div className="w-12 h-12 flex-shrink-0 border border-gray-100 p-1 bg-white">
                              <img 
                                src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                                alt={item.name} 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-medium !text-gray-800 line-clamp-2 leading-tight mb-1" title={item.name}>
                                {item.name}
                              </h4>
                              {hasSize && (
                                <p className="text-[10px] text-gray-400 mb-2">Size: {displaySize}</p>
                              )}
                              <div className="text-[10px] text-gray-500 mt-1">
                                {item.quantity} x <span className="font-bold text-[#eb5322]">{formatPrice(item.price)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <span className="text-[11px] font-bold !text-[#eb5322] whitespace-nowrap mt-auto pb-1">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-medium text-gray-600">Tổng cộng ({cartItems.length} loại):</span>
                        <span className="text-[13px] font-bold !text-[#eb5322]">{formatPrice(totalPrice)}</span>
                      </div>
                      <button 
                        onClick={() => { navigate('/cart'); handleActionComplete(); }}
                        className="w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white text-[11px] font-bold py-2 rounded-sm uppercase transition-colors border-none cursor-pointer"
                      >
                        Tới giỏ hàng để thanh toán
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
      { label: 'HỆ THỐNG SÂN', link: "/courts" }, // Đổi từ SALE OFF thành HỆ THỐNG SÂN
      { label: 'TIN TỨC', link: "#" },
      { label: 'CHÍNH SÁCH NHƯỢNG QUYỀN', link: "#" },
      { label: 'HƯỚNG DẪN', hasDropdown: true, link: "#" },
      { label: 'GIỚI THIỆU', link: "#" },
      { label: 'LIÊN HỆ', link: "#" },
    ];

    return (
      <nav className="!bg-[#eb5322] !text-white w-full sticky top-0 z-[90] relative">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center whitespace-nowrap m-0 p-0 list-none">
            {navItems.map((item, index) => (
              <li key={index} className="group static">
                <Link 
                  to={item.link} 
                  onClick={item.link !== '#' ? handleActionComplete : undefined}
                  className="flex items-center px-5 py-4 text-[13px] font-bold !text-white hover:!bg-black/10 transition-colors !no-underline uppercase tracking-wider h-full"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown size={14} className="ml-1 opacity-70" />}
                </Link>

                {item.label === 'SẢN PHẨM' && (
                  <div className={`absolute top-full left-0 w-full !bg-white shadow-2xl border-t border-gray-100 z-[9999] ${forceCloseMenu ? 'hidden' : 'hidden group-hover:block'}`}>
                    <div className="w-full px-8 py-6 grid grid-cols-5 gap-x-10 gap-y-10 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                      {MENU_DATA.map((categoryData) => (
                        <div key={categoryData.main} className="space-y-3">
                          <Link 
                            to={`/search?mainCategory=${encodeURIComponent(categoryData.main)}`}
                            className="!no-underline group/title block"
                            onClick={handleActionComplete}
                          >
                            <h3 className="text-[15px] font-bold !text-[#eb5322] uppercase border-b border-gray-200 pb-2.5 mb-3 flex items-center cursor-pointer hover:opacity-80 transition-opacity tracking-tight whitespace-normal break-words leading-snug">
                              {categoryData.main}
                              <ChevronRight size={16} className="ml-1 opacity-0 group-hover/title:opacity-100 -translate-x-2 group-hover/title:translate-x-0 transition-all text-[#eb5322]" />
                            </h3>
                          </Link>

                          <ul className="list-none p-0 m-0 space-y-2.5">
                            {categoryData.subs.map((sub) => (
                              <li key={sub}>
                                <Link 
                                  to={`/search?mainCategory=${encodeURIComponent(categoryData.main)}&subCategory=${encodeURIComponent(sub)}`} 
                                  className="text-[13px] font-normal !text-gray-600 hover:!text-[#eb5322] hover:translate-x-1.5 transition-all !no-underline block leading-snug whitespace-normal break-words"
                                  onClick={handleActionComplete}
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                            {categoryData.hasMore && (
                              <li>
                                <Link 
                                  to={`/search?mainCategory=${encodeURIComponent(categoryData.main)}`} 
                                  className="text-[13px] font-normal !text-[#eb5322] hover:underline !no-underline block mt-2"
                                  onClick={handleActionComplete}
                                >
                                  Xem thêm
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  };

  return (
    <header className="w-full relative z-[1000]">
      <TopBar />
      <Navigation />
    </header>
  );
};

export default Header;