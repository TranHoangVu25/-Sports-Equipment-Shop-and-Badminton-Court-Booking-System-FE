import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';

const CheckoutPage = () => {
  // State quản lý form thông tin nhận hàng
  const [formData, setFormData] = useState({
    fullName: 'vvv', // Giá trị mẫu theo hình
    phone: '0983676605',
    address: '',
    email: 'vuth@teracom.vn',
    note: ''
  });

  // State phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Dữ liệu giỏ hàng mẫu
  const cartItem = {
    id: 1,
    name: 'Giày cầu lông Victor P8500 NitroLite ZSW/DX chính hãng',
    price: 2680000,
    quantity: 1,
    image: 'https://cdn.shopvnb.com/img/100x100/uploads/gallery/giay-cau-long-victor-p8500-nitrolite-zsw-dx-chinh-hang_1739504443.webp'
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row">
        
        {/* ========================================== */}
        {/* CỘT TRÁI: FORM THÔNG TIN & THANH TOÁN */}
        {/* ========================================== */}
        <div className="flex-1 p-4 md:p-8 lg:pr-12 pt-8">
          <Link to="/" className="inline-block mb-8 no-underline">
            <h1 className="text-[32px] font-normal text-[#eb5322] m-0 tracking-tight">VNBSports</h1>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            
            {/* --- CỘT CON 1: THÔNG TIN NHẬN HÀNG --- */}
            <div>
              <h2 className="text-[17px] font-bold text-gray-800 mb-4">Thông tin nhận hàng</h2>
              <form className="space-y-3.5">
                <div>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên người nhận hàng"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#eb5322] transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ"
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

            {/* --- CỘT CON 2: PHƯƠNG THỨC THANH TOÁN --- */}
            <div>
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
                  {/* Icon Cash (Mô phỏng) */}
                  <div className="text-[#eb5322]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6C1.89543 6 1 6.89543 1 8V16C1 17.1046 1.89543 18 3 18H21C22.1046 18 23 17.1046 23 16V8C23 6.89543 22.1046 6 21 6H3ZM3 8H21V16H3V8ZM7 10C6.44772 10 6 10.4477 6 11C6 11.5523 6.44772 12 7 12H8C8.55228 12 9 11.5523 9 11C9 10.4477 8.55228 10 8 10H7ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM16 10C15.4477 10 15 10.4477 15 11C15 11.5523 15.4477 12 16 12H17C17.5523 12 18 11.5523 18 11C18 10.4477 17.5523 10 17 10H16Z" fill="#eb5322"/>
                    </svg>
                  </div>
                </label>

                {/* Thanh toán qua ngân hàng */}
                <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="w-4 h-4 accent-[#eb5322] cursor-pointer"
                    />
                    <span className="text-[14px] text-gray-700">Thanh toán qua ngân hàng</span>
                  </div>
                  {/* Icon Bank (Mô phỏng) */}
                  <div className="text-[#eb5322]">
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
                  {/* Item 1 */}
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 10% - tối đa 500.000đ khi chọn kỳ hạn 6 & 12 tháng cho khách hàng mới</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[9px] font-bold w-10 h-10 rounded-full flex items-center justify-center text-center shadow-sm relative pt-1">
                       <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300">🔥</span>
                       <span className="leading-[1.1]">ƯU<br/>ĐÃI<br/>HOT</span>
                     </div>
                  </div>
                  {/* Item 2 */}
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 3% - tối đa 100.000đ với kỳ hạn 3 tháng cho khách hàng mới</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[9px] font-bold w-10 h-10 rounded-full flex items-center justify-center text-center shadow-sm relative pt-1">
                       <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300">🔥</span>
                       <span className="leading-[1.1]">ƯU<br/>ĐÃI<br/>HOT</span>
                     </div>
                  </div>
                  {/* Item 3 */}
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 3% - tối đa 100.000đ với kỳ hạn 3 tháng cho khách hàng đã phát sinh đơn hàng HPL</p>
                     <div className="flex-shrink-0 bg-[#eb5322] text-white text-[8px] font-bold w-12 h-12 rounded-full flex items-center justify-center text-center shadow-sm leading-[1.1]">
                       SIÊU<br/>MỚI,<br/>SIÊU<br/>HOT
                     </div>
                  </div>
                  {/* Item 4 */}
                  <div className="py-3 flex items-start gap-3">
                     <span className="text-[#e3001b] font-extrabold text-[10px] italic flex-shrink-0 leading-tight w-12 text-center">HOME<br/>PayLater</span>
                     <p className="text-[11px] text-gray-800 flex-1 leading-snug font-medium m-0 pt-0.5">Giảm 5% - tối đa 200.000đ khi chọn kỳ hạn 6 & 12 tháng cho khách hàng đã phát sinh đơn hàng HPL</p>
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
        <div className="w-full lg:w-[420px] bg-[#fafafa] border-l border-gray-200 p-4 md:p-8 flex flex-col">
          <h2 className="text-[17px] font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
            Đơn hàng (1 sản phẩm)
          </h2>

          {/* Chi tiết sản phẩm */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative w-16 h-16 border border-gray-200 rounded-sm bg-white flex-shrink-0 p-1">
              <img 
                src={cartItem.image} 
                alt={cartItem.name} 
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-2.5 -right-2.5 bg-[#eb5322] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold shadow-sm">
                {cartItem.quantity}
              </span>
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-[13px] font-medium text-gray-700 leading-snug line-clamp-2">
                {cartItem.name}
              </h3>
            </div>

            <div className="text-[14px] font-medium text-gray-800 whitespace-nowrap">
              {formatPrice(cartItem.price)}
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Nhập mã giảm giá */}
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Mã giảm giá" 
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#5bc0de] transition-colors bg-white"
            />
            <button className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-5 py-2.5 rounded-sm text-[13px] font-medium transition-colors border-none cursor-pointer">
              Sử dụng
            </button>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Tổng tiền */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-[15px] text-gray-600">Tổng cộng</span>
            <span className="text-[20px] font-bold text-gray-800">{formatPrice(cartItem.price)}</span>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/cart" className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-4 py-3 rounded-sm flex items-center gap-2 text-[13px] transition-colors no-underline">
              <Edit3 size={14} />
              Sửa giỏ hàng
            </Link>
            <button className="flex-1 bg-[#eb5322] hover:bg-[#d04316] text-white py-3 rounded-sm font-bold uppercase text-[15px] transition-colors border-none cursor-pointer shadow-sm">
              ĐẶT HÀNG
            </button>
          </div>

          {/* Ghi chú */}
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