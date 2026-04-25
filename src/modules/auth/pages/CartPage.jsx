import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, X, Loader2, AlertCircle } from 'lucide-react';
import { encodeId } from '../../../utils/url';

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
              <Link to="/" className="mt-4 inline-block px-6 py-2 bg-[#eb5322] text-white font-bold rounded-sm no-underline uppercase text-sm transition-colors hover:bg-[#d04316]">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              // Ẩn size nếu là null hoặc "Default"
              const hasSize = item.size && item.size.toLowerCase() !== 'default';
              const displaySize = hasSize ? String(item.size).replace('-', '.') : '';

              return (
                <div key={item.cartItemId} className="p-4 relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 group bg-white hover:bg-gray-50/30 transition-colors">
                  
                  {/* Nút X xóa sản phẩm (Góc trên bên phải) */}
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="absolute top-4 right-4 !text-gray-400 hover:!text-red-500 transition-colors bg-transparent border border-gray-200 rounded-full p-1 cursor-pointer"
                    title="Xóa sản phẩm"
                  >
                    <X size={14} />
                  </button>

                  {/* Hình ảnh sản phẩm */}
                  <Link to={`/product-detail/${encodeId(item.productId)}`} className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-white border border-gray-50 p-1 block">
                    <img 
                      src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </Link>

                  {/* Thông tin tên và size */}
                  <div className="flex-1">
                    <Link to={`/product-detail/${encodeId(item.productId)}`} className="no-underline">
                      <h3 className="text-[14px] font-medium !text-gray-800 mb-1.5 leading-snug pr-8 hover:!text-[#eb5322] transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {hasSize && (
                      <p className="text-[12px] !text-gray-500 font-medium">Phân loại: {displaySize}</p>
                    )}
                  </div>

                  {/* Phần điều khiển số lượng và giá */}
                  <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                    
                    {/* Bộ đếm số lượng */}
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white h-8">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="px-3 flex items-center justify-center h-full !text-gray-500 hover:!bg-gray-100 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                        disabled={item.quantity <= 1} // Disable nút trừ khi số lượng bằng 1
                      >
                        <Minus size={12} />
                      </button>
                      <div className="w-10 flex items-center justify-center text-sm font-semibold !text-gray-800 border-x border-gray-200 h-full">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="px-3 flex items-center justify-center h-full !text-gray-500 hover:!bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Giá sản phẩm (Tính tổng theo số lượng) */}
                    <div className="!text-[#eb5322] font-bold min-w-[110px] text-right text-[16px]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })
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
          
          {/* Nút đặt hàng giờ đây là một liên kết sang trang checkout */}
          <Link 
            to="/checkout"
            className="flex justify-center items-center w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white font-bold py-3.5 rounded-sm uppercase tracking-[0.1em] text-sm transition-all border-none cursor-pointer shadow-md active:scale-[0.98] !no-underline"
          >
            ĐẶT HÀNG
          </Link>
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
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  // Gọi API lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8086/api/v1/cart/get-user-cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.code === 0 && data.result) {
          setCartItems(data.result.cartItems || []);
        } else if (response.status === 401 || response.status === 403) {
          // Token hết hạn
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  // GỌI API: Tăng/giảm số lượng
  const updateQuantity = async (cartItemId, delta) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
    if (!itemToUpdate) return;
    
    // Không cho phép giảm nếu số lượng đã là 1
    if (itemToUpdate.quantity === 1 && delta === -1) return;

    const isPlus = delta > 0;

    try {
      const response = await fetch('http://localhost:8086/api/v1/cart/cart-items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: String(cartItemId),
          plus: isPlus
        })
      });

      if (response.ok) {
        // Cập nhật lại state sau khi API thành công
        setCartItems(prev =>
          prev.map(item =>
            item.cartItemId === cartItemId 
              ? { ...item, quantity: item.quantity + delta } 
              : item
          )
        );
      } else {
        console.error("Không thể cập nhật số lượng.");
      }
    } catch (error) {
      console.error("Lỗi khi kết nối tới API tăng giảm số lượng:", error);
    }
  };

  // GỌI API: Xóa sản phẩm
  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8086/api/v1/cart/cart-items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Xóa thành công, cập nhật state local
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      } else {
        console.error("Không thể xóa sản phẩm khỏi giỏ hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  // Tính tổng tiền dựa trên các mặt hàng hiện tại trong state
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Format tiền tệ Việt Nam
  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  // NẾU CHƯA ĐĂNG NHẬP
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="w-full min-h-screen !bg-[#f5f5f5] pb-20 font-sans flex flex-col items-center pt-20">
        <AlertCircle size={64} className="text-[#eb5322] mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
        <Link to="/login" className="px-8 py-3 bg-[#eb5322] text-white font-bold rounded-sm no-underline uppercase tracking-wider hover:bg-[#d04316] transition-colors shadow-md">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 relative min-h-[300px]">
        {isLoading ? (
           <div className="absolute inset-0 flex justify-center items-start pt-20 z-10">
             <Loader2 size={40} className="animate-spin !text-[#eb5322]" />
           </div>
        ) : (
          <CartForm 
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            totalPrice={totalPrice}
            formatPrice={formatPrice}
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;
