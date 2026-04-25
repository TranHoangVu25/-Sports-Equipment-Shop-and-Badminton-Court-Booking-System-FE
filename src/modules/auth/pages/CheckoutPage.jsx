import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Loader2, ShoppingCart, CheckCircle2, AlertCircle, X } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();

  // State quản lý form thông tin nhận hàng (Khởi tạo trống, đợi API fill)
  const [formData, setFormData] = useState({
    fullName: '', 
    phone: '',
    address: '',
    email: '',
    note: ''
  });
  
  // State quản lý giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Trạng thái hiển thị loading
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State phương thức thanh toán (cod hoặc stripe)
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Trạng thái cho Toast Notification
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // GỌI API TỰ ĐỘNG ĐIỀN THÔNG TIN USER VÀ LẤY GIỎ HÀNG SONG SONG
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsFetchingData(false);
        navigate('/login'); // Chưa đăng nhập thì đá về login
        return;
      }

      try {
        const [profileResponse, cartResponse] = await Promise.all([
          fetch('http://localhost:8086/api/v1/users/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:8086/api/v1/cart/get-user-cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        
        // 1. Xử lý Profile Data
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.code === 0 && profileData.result) {
            const user = profileData.result;
            setFormData(prev => ({
              ...prev,
              fullName: user.fullName || '',
              phone: user.phoneNumber || '',
              email: user.email || '',
              address: user.location || ''
            }));
          }
        }

        // 2. Xử lý Cart Data
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          if (cartData.code === 0 && cartData.result) {
            setCartItems(cartData.result.cartItems || []);
            setTotalPrice(cartData.result.totalPrice || 0);
          }
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thanh toán:", error);
        showToast('error', 'Không thể kết nối đến máy chủ.');
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [navigate]);

  // ==========================================
  // XỬ LÝ ĐẶT HÀNG (CẢ COD VÀ STRIPE)
  // ==========================================
  const handleCheckout = async () => {
    // 1. Kiểm tra validate form cơ bản
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('error', 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    if (cartItems.length === 0) {
      showToast('error', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    const token = localStorage.getItem('token');
    setIsSubmitting(true);
    
    try {
      if (paymentMethod === 'cod') {
        // --- XỬ LÝ THANH TOÁN COD ---
        const response = await fetch('http://localhost:8086/api/v1/orders/checkout/cod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipient: formData.fullName,
            phoneNumber: formData.phone,
            locationDetail: formData.address,
            email: formData.email,
            note: formData.note,
            checkoutType: true // COD là true
          })
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
          showToast('success', 'Đặt hàng thành công! Đang chuyển hướng...');
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } else {
          showToast('error', data.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        }

      } else if (paymentMethod === 'stripe') {
        // --- XỬ LÝ THANH TOÁN STRIPE ---
        const response = await fetch('http://localhost:8086/api/v1/orders/checkout-stripe-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipient: formData.fullName,
            phoneNumber: formData.phone,
            locationDetail: formData.address,
            email: formData.email,
            note: formData.note,
            checkoutType: false // Stripe là false
          })
        });

        const data = await response.json();

        if (response.ok && data.code === 0 && data.result) {
          showToast('success', 'Đang chuyển hướng đến cổng thanh toán an toàn...');
          // Redirect trang hiện tại sang link của Stripe
          setTimeout(() => {
            window.location.href = data.result;
          }, 1000);
        } else {
          showToast('error', data.message || 'Không thể tạo URL thanh toán. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      showToast('error', 'Lỗi kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center relative">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-24 right-5 z-[9999] flex items-center p-4 mb-4 text-sm rounded-lg shadow-xl transition-all duration-500 transform border ${toast.type === 'success' ? 'text-green-800 border-green-200 bg-white' : 'text-red-800 border-red-200 bg-white'}`} role="alert">
          {toast.type === 'success' ? <CheckCircle2 className="flex-shrink-0 inline w-5 h-5 mr-3 text-green-500" /> : <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3 text-red-500" />}
          <div className="font-medium mr-4">
            {toast.message}
          </div>
          <button onClick={() => setToast({show: false})} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 transition-colors border-none cursor-pointer ${toast.type === 'success' ? 'bg-green-50 hover:bg-green-100 focus:ring-green-400' : 'bg-red-50 hover:bg-red-100 focus:ring-red-400'}`}>
             <X size={16} className={toast.type === 'success' ? "text-green-600" : "text-red-600"}/>
          </button>
        </div>
      )}

      {/* Hiệu ứng loading mờ khi đang fetch dữ liệu Profile và Cart */}
      {isFetchingData && (
        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#eb5322]" size={40} />
        </div>
      )}

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row">
        
        {/* ========================================== */}
        {/* CỘT TRÁI & GIỮA: FORM THÔNG TIN & THANH TOÁN */}
        {/* ========================================== */}
        <div className="flex-[2] p-4 md:p-8 lg:pr-10 pt-8">
          <Link to="/" className="inline-block mb-8 no-underline">
            <h1 className="text-[32px] font-normal text-[#eb5322] m-0 tracking-tight">MATHMORE </h1>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            
            {/* --- CỘT 1: THÔNG TIN NHẬN HÀNG --- */}
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-gray-800 mb-4">Thông tin nhận hàng</h2>
              <form className="space-y-3.5">
                <div>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên người nhận hàng (*)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại (*)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ chi tiết (*)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú đơn hàng (tùy chọn)"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* --- CỘT 2: PHƯƠNG THỨC THANH TOÁN --- */}
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-gray-800 mb-4">Thanh toán</h2>
              
              <div className="border border-gray-200 rounded-sm overflow-hidden mb-4">
                {/* Thanh toán khi nhận hàng */}
                <label className="flex items-center justify-between p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 accent-[#eb5322] cursor-pointer"
                    />
                    <span className="text-[14px] text-gray-700">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <div className="text-[#eb5322]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6C1.89543 6 1 6.89543 1 8V16C1 17.1046 1.89543 18 3 18H21C22.1046 18 23 17.1046 23 16V8C23 6.89543 22.1046 6 21 6H3ZM3 8H21V16H3V8ZM7 10C6.44772 10 6 10.4477 6 11C6 11.5523 6.44772 12 7 12H8C8.55228 12 9 11.5523 9 11C9 10.4477 8.55228 10 8 10H7ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM16 10C15.4477 10 15 10.4477 15 11C15 11.5523 15.4477 12 16 12H17C17.5523 12 18 11.5523 18 11C18 10.4477 17.5523 10 17 10H16Z" fill="#eb5322"/>
                    </svg>
                  </div>
                </label>

                {/* Thanh toán qua Stripe */}
                <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="w-4 h-4 accent-[#eb5322] cursor-pointer"
                    />
                    <span className="text-[14px] text-gray-700">Thanh toán qua Stripe</span>
                  </div>
                  <div className="text-[#eb5322] flex gap-1">
                    {/* Thêm một số icon thẻ tượng trưng cho Stripe */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 20H22V22H2V20ZM12 2L22 7H2L12 2ZM4 10H7V18H4V10ZM10 10H14V18H10V10ZM17 10H20V18H17V10Z" fill="#eb5322"/>
                    </svg>
                  </div>
                </label>
              </div>

              {/* Các nút thanh toán bên thứ 3 */}
              <div className="space-y-2.5 mb-6">
                <button className="w-full bg-[#e3001b] hover:bg-[#cc0018] text-white py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 shadow-sm">
                  <span className="font-bold text-[13px] uppercase tracking-wide">Thanh toán qua thẻ</span>
                  <span className="text-[10px] font-normal mt-0.5">Visa, Master, JCB</span>
                </button>
                
                <button className="w-full bg-[#2084d9] hover:bg-[#1b75c2] text-white py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 shadow-sm">
                  <span className="font-bold text-[13px] uppercase tracking-wide">Trả góp qua thẻ</span>
                  <span className="text-[10px] font-normal mt-0.5">Visa, Master, JCB</span>
                </button>
                
                <button className="w-full bg-[#fae30c] hover:bg-[#f0d908] text-gray-900 py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 shadow-sm">
                  <span className="font-bold text-[13px] uppercase tracking-wide">Mua ngay - Trả sau</span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic leading-tight">HOME<br/>PayLater</span>
                     <span className="text-[#00c9a7] font-extrabold text-[11px] leading-tight">Fundiin<br/><span className="text-[8px] font-normal text-gray-600 block leading-[0.5]">Pay Later</span></span>
                  </div>
                </button>
              </div>

              {/* Khung Khuyến Mãi Thanh Toán */}
              <div className="border border-gray-200 rounded-sm">
                <div className="bg-gray-100 text-center py-2.5 px-2 border-b border-gray-200 flex flex-col items-center justify-center">
                   <h4 className="text-[12px] font-bold text-[#eb5322] uppercase m-0 flex items-center justify-center gap-1.5 flex-wrap">
                     ƯU ĐÃI KHI THANH TOÁN 
                     <span className="text-[#e3001b] italic tracking-tight">HOME PayLater</span> 
                     <span className="text-[#00c9a7] tracking-tight">Fundiin</span>
                   </h4>
                   <p className="text-[10px] text-[#2084d9] m-0 mt-0.5">(SỬ DỤNG KHI XÁC NHẬN KHOẢN VAY TRÊN TRANG CỦA TỔ CHỨC TÀI CHÍNH)</p>
                </div>
                
                <div className="p-3 divide-y divide-gray-100 bg-white">
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 10% - tối đa 500.000đ khi chọn kỳ hạn 6 & 12 tháng cho khách hàng mới</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[9px] font-bold w-10 h-10 rounded-full flex items-center justify-center text-center shadow-sm relative pt-1">
                       <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300">🔥</span>
                       <span className="leading-[1.1]">ƯU<br/>ĐÃI<br/>HOT</span>
                     </div>
                  </div>
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 3% - tối đa 100.000đ với kỳ hạn 3 tháng cho khách hàng mới</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[9px] font-bold w-10 h-10 rounded-full flex items-center justify-center text-center shadow-sm relative pt-1">
                       <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300">🔥</span>
                       <span className="leading-[1.1]">ƯU<br/>ĐÃI<br/>HOT</span>
                     </div>
                  </div>
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 3% - tối đa 100.000đ với kỳ hạn 3 tháng cho khách hàng đã phát sinh đơn hàng HPL</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[8px] font-bold w-12 h-12 rounded-full flex items-center justify-center text-center shadow-sm leading-[1.1]">
                       SIÊU<br/>MỚI,<br/>SIÊU<br/>HOT
                     </div>
                  </div>
                </div>
                <div className="text-right px-3 py-1.5 bg-white border-t border-gray-100">
                  <span className="text-[9px] text-gray-400 italic">Powered by </span>
                  <span className="text-[10px] font-bold text-gray-700 tracking-tight">baokim</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CỘT PHẢI: THÔNG TIN ĐƠN HÀNG (SIDEBAR) */}
        {/* ========================================== */}
        <div className="flex-1 bg-[#fafafa] border-l border-gray-200 p-4 md:p-8 pt-8 flex flex-col h-full sticky top-0">
          <h2 className="text-[17px] font-bold text-gray-800 mb-4 border-b border-gray-200 pb-4">
            Đơn hàng ({totalQuantity} sản phẩm)
          </h2>

          <div className="max-h-[350px] overflow-y-auto pr-3 pt-3 space-y-6 mb-6 scrollbar-thin scrollbar-thumb-gray-300">
            {cartItems.length === 0 ? (
               <div className="text-center py-10 text-gray-400 italic text-sm flex flex-col items-center">
                 <ShoppingCart size={40} className="mb-3 opacity-30" />
                 Không có sản phẩm nào
               </div>
            ) : (
              cartItems.map(item => {
                const hasSize = item.size && String(item.size).toLowerCase() !== 'default';
                const displaySize = hasSize ? String(item.size).replace('-', '.') : '';

                return (
                  <div key={item.cartItemId} className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative w-14 h-14 md:w-16 md:h-16 border border-gray-200 rounded-sm bg-white flex-shrink-0 p-1">
                        <img 
                          src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -top-2.5 -right-2.5 bg-[#eb5322] text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold shadow-sm z-10">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pr-2 pt-1">
                        <h3 className="text-[13px] font-medium text-gray-700 leading-snug line-clamp-2 m-0 mb-1" title={item.name}>
                          {item.name}
                        </h3>
                        {hasSize && (
                          <p className="text-[12px] text-gray-500 m-0">Size: {displaySize}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-[14px] font-medium text-gray-800 whitespace-nowrap pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Mã giảm giá" 
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#5bc0de] transition-colors bg-white"
            />
            <button className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-5 py-2.5 rounded-sm text-[13px] font-medium transition-colors border-none cursor-pointer">
              Sử dụng
            </button>
          </div> */}

          {/* <div className="border-t border-gray-200 my-4"></div> */}

          <div className="flex justify-between items-center mb-8">
            <span className="text-[15px] text-gray-600">Tổng cộng</span>
            <span className="text-[20px] font-bold text-gray-800">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Link to="/cart" className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-4 py-3 rounded-sm flex items-center gap-2 text-[13px] transition-colors no-underline">
              <Edit3 size={14} />
              Sửa giỏ hàng
            </Link>
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isSubmitting}
              className="flex-1 flex justify-center items-center bg-[#eb5322] hover:bg-[#d04316] text-white py-3 rounded-sm font-bold uppercase text-[15px] transition-colors border-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Đang xử lý...</> : 'ĐẶT HÀNG'}
            </button>
          </div>

          <div className="text-[13px] text-gray-500 italic space-y-2 leading-relaxed">
            <p className="m-0">- Giá trên chưa bao gồm phí vận chuyển. Phí vận chuyển sẽ được nhân viên báo khi xác nhận đơn hàng.</p>
            <p className="m-0">- Thời gian xử lý đơn hàng: Từ 8h00 - 17h thứ 2 đến thứ 7. Các đơn hàng sau thời gian này sẽ được xử lý vào ngày làm việc tiếp theo.</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;