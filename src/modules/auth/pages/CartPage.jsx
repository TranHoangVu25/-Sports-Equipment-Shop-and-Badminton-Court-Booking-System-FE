import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, X } from 'lucide-react';

/**
 * COMPONENT: CartForm
 * Chịu trách nhiệm hiển thị bảng danh sách sản phẩm và tổng tiền.
 */
const CartForm = ({ cartItems, updateQuantity, removeItem, totalPrice, formatPrice }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-gray-100 font-sans">
      <h1 className="text-lg font-bold uppercase !text-gray-800 mb-5 tracking-tight">
        GIỎ HÀNG CỦA BẠN
      </h1>
      
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        {/* Header màu cam đặc trưng */}
        <div className="!bg-[#eb5322] !text-white font-bold px-4 py-3 uppercase text-sm tracking-wider">
          GIỎ HÀNG
        </div>

        {/* Danh sách sản phẩm */}
        <div className="divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="p-16 text-center !text-gray-400 italic flex flex-col items-center">
              <ShoppingCart size={60} strokeWidth={1} className="mb-4 opacity-20" />
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="p-4 relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 group bg-white hover:bg-gray-50/30 transition-colors">
                
                {/* Nút X xóa sản phẩm (Góc trên bên phải) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 !text-gray-400 hover:!text-red-500 transition-colors bg-transparent border border-gray-200 rounded-full p-1 cursor-pointer"
                  title="Xóa sản phẩm"
                >
                  <X size={14} />
                </button>

                {/* Hình ảnh sản phẩm */}
                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white border border-gray-50 p-1">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                  />
                </div>

                {/* Thông tin tên và size */}
                <div className="flex-1">
                  <h3 className="text-[14px] font-medium !text-gray-800 mb-1.5 leading-snug pr-8">
                    {item.name}
                  </h3>
                  <p className="text-[12px] !text-gray-400">Size: {item.size}</p>
                </div>

                {/* Phần điều khiển số lượng và giá */}
                <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                  
                  {/* Bộ đếm số lượng */}
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white h-8">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 flex items-center justify-center h-full !text-gray-500 hover:!bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <div className="w-10 flex items-center justify-center text-sm font-semibold !text-gray-800 border-x border-gray-200 h-full">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 flex items-center justify-center h-full !text-gray-500 hover:!bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Giá sản phẩm */}
                  <div className="!text-[#eb5322] font-bold min-w-[110px] text-right text-[16px]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Phần Tổng kết & Nút đặt hàng */}
      {cartItems.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center py-4 border-t border-gray-100">
            <span className="text-[13px] font-bold !text-gray-800 uppercase tracking-wider">TỔNG TIỀN:</span>
            <span className="text-[18px] font-bold !text-[#eb5322]">{formatPrice(totalPrice)}</span>
          </div>
          
          <button className="w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white font-bold py-3.5 rounded-sm uppercase tracking-[0.1em] text-sm transition-all border-none cursor-pointer shadow-md active:scale-[0.98]">
            ĐẶT HÀNG
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * COMPONENT: CartPage
 * Trang chính quản lý State của giỏ hàng và Layout chung.
 */
const CartPage = () => {
  // Mock data bám sát hình ảnh thiết kế
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Vợt cầu lông Yonex Astrox 22 Lite (BK/RD) chính hãng',
      size: '3F5',
      price: 2349000,
      quantity: 1,
      image: 'https://cdn.shopvnb.com/img/300x300/uploads/gallery/vot-cau-long-yonex-astrox-22-lite-bkrd-chinh-hang_1741200200.webp'
    },
    {
      id: 2,
      name: 'Giày cầu lông Yonex Velo 300 Chính Hãng - White/Black',
      size: '40.5',
      price: 679000,
      quantity: 1,
      image: 'https://cdn.shopvnb.com/img/300x300/uploads/gallery/giay-cau-long-yonex-velo-300-chinh-hang-white-black_1741200061.webp'
    }
  ]);

  // Logic tăng/giảm số lượng
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // Logic xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Format tiền tệ Việt Nam
  const formatPrice = (price) => {
    return price ? price.toLocaleString('vi-VN') + ' đ' : '0 đ';
  };

  return (
    <div className="w-full min-h-screen !bg-[#f5f5f5] pb-20 font-sans">
      {/* Breadcrumb theo thiết kế */}
      <div className="!bg-white border-b border-gray-100 py-3 mb-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-[13px] !text-gray-600">
          <Link to="/" className="hover:!text-[#eb5322] transition-colors !text-gray-500 !no-underline">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2 !text-gray-300" />
          <span className="!text-[#eb5322] font-medium">Giỏ hàng</span>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto px-4">
        <CartForm 
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          totalPrice={totalPrice}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default CartPage;