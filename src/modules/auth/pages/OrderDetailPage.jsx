import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  // GỌI API LẤY CHI TIẾT ĐƠN HÀNG
  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        navigate('/login');
        return;
      }

      if (!id) {
        setError('Không tìm thấy mã đơn hàng.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8086/api/v1/orders/get-order-detail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.code === 0 && data.result) {
          const result = data.result;
          
          // Mapping dữ liệu dựa trên cấu trúc API mới
          setOrderData({
            orderCode: result.orderId?.toString() || id,
            status: result.status || 'unknown',
            customerName: result.recipient || 'Không có thông tin',
            phone: result.phoneNumber || 'Không có thông tin',
            address: result.locationDetail || 'Không có thông tin',
            items: result.orderItems?.map((item, index) => ({
              id: item.sku || index,
              name: item.productName || `Sản phẩm`, // Lấy từ productName
              size: item.size && String(item.size).toLowerCase() !== 'default' ? item.size : null,
              price: item.price || 0,
              quantity: item.quantity || 0,
              image: item.imgUrl || "https://via.placeholder.com/100x100?text=No+Image", // Lấy từ imgUrl
              subTotal: (item.price || 0) * (item.quantity || 0)
            })) || [],
            totalAmount: result.totalAmount || 0
          });
        } else {
          setError(data.message || 'Không tìm thấy thông tin đơn hàng.');
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  // Render màu sắc và dịch trạng thái
  const renderStatus = (status) => {
    if (!status) return null;
    const s = status.toLowerCase();
    
    let colorClass = "text-[#fbad18]"; // Cam (Chờ xử lý, Đang giao)
    let text = status;

    if (s.includes('hủy') || s === 'cancelled' || s === 'failed') {
      colorClass = "text-[#e3001b]"; // Đỏ
      text = s === 'cancelled' ? 'Đã hủy' : (s === 'failed' ? 'Thất bại' : 'Đã hủy');
    } else if (s.includes('thành công') || s.includes('giao') || s === 'success' || s === 'delivered') {
      colorClass = "text-[#5cb85c]"; // Xanh lá
      text = s === 'success' ? 'Thành công' : (s === 'delivered' ? 'Đã giao hàng' : 'Thành công');
    } else if (s === 'pending') {
      text = 'Chờ xử lý';
    } else if (s === 'processing') {
      text = 'Đang xử lý';
    } else if (s === 'shipped') {
      text = 'Đang giao hàng';
    }

    return <span className={`${colorClass} font-bold italic`}>{text}</span>;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-[#eb5322] mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <AlertCircle size={60} className="text-[#e3001b] mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải đơn hàng</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/profile" className="px-6 py-2 bg-[#eb5322] text-white rounded-sm no-underline font-bold uppercase transition-colors hover:bg-[#d04316]">
          Quay lại tài khoản
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white py-12 font-sans">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* --- HEADER: THÔNG BÁO --- */}
        <div className="flex items-center gap-4 mb-6">
          {orderData.status.toLowerCase() === 'cancelled' || orderData.status.toLowerCase().includes('hủy') ? (
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#e3001b] flex items-center justify-center flex-shrink-0">
              <AlertCircle size={36} className="text-[#e3001b]" strokeWidth={1.5} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#5cb85c] flex items-center justify-center flex-shrink-0">
              <Check size={36} className="text-[#5cb85c]" strokeWidth={1.5} />
            </div>
          )}
          
          <h1 className="text-[20px] md:text-[22px] font-bold text-[#333] uppercase m-0 leading-snug">
            ĐƠN HÀNG [{orderData.orderCode}] CỦA BẠN 
            {orderData.status.toLowerCase() === 'cancelled' || orderData.status.toLowerCase().includes('hủy') 
              ? ' ĐÃ BỊ HỦY.' 
              : ' ĐÃ ĐƯỢC ĐẶT THÀNH CÔNG.'}
          </h1>
        </div>

        {/* Nút Tiếp tục mua hàng */}
        <div className="mb-10">
          <Link 
            to="/" 
            className="inline-block bg-[#eb5322] hover:bg-[#d04316] text-white px-8 py-3 text-[14px] font-medium rounded-sm transition-colors uppercase !no-underline"
          >
            TIẾP TỤC MUA HÀNG
          </Link>
        </div>

        {/* --- THÔNG TIN KHÁCH HÀNG --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[14px] text-gray-800 mb-6">
          <div className="flex">
            <span className="w-24 flex-shrink-0">Họ tên:</span>
            <span className="font-bold text-gray-900">{orderData.customerName}</span>
          </div>
          <div className="flex">
            <span className="w-28 md:w-auto md:mr-2 flex-shrink-0">Số điện thoại:</span>
            <span className="font-bold text-gray-900">{orderData.phone}</span>
          </div>
          <div className="flex">
            <span className="w-24 flex-shrink-0">Địa chỉ:</span>
            <span className="font-bold text-gray-900 flex-1 leading-snug">{orderData.address}</span>
          </div>
          <div className="flex">
            <span className="w-28 md:w-auto md:mr-2 flex-shrink-0">Tình trạng:</span>
            {renderStatus(orderData.status)}
          </div>
        </div>

        {/* --- GHI CHÚ ĐƠN HÀNG --- */}
        <div className="text-[13.5px] text-gray-600 italic space-y-3 leading-relaxed mb-10">
          <p className="m-0">- Giá trên chưa bao gồm phí vận chuyển. Phí vận chuyển sẽ được nhân viên báo khi xác nhận đơn hàng.</p>
          <p className="m-0">- Thời gian xử lý đơn hàng: Từ 8h00 - 17h thứ 2 đến thứ 7. Các đơn hàng sau thời gian này sẽ được xử lý vào ngày làm việc tiếp theo.</p>
          <p className="m-0">- Mọi thắc mắc liên hệ hotline: <span className="font-bold text-[#eb5322] not-italic">0977508430 | 0338000308</span></p>
        </div>

        {/* --- BẢNG SẢN PHẨM --- */}
        <div className="border border-gray-200 rounded-sm overflow-x-auto shadow-sm">
          <table className="w-full text-left min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px]">Sản phẩm</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[150px] text-center">Đơn giá</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[120px] text-center">Số lượng</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[150px] text-right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50/30 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center bg-white rounded-sm">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <Link to={`/product-detail/${item.id}`} className="no-underline">
                          <h3 className="text-[14px] text-gray-800 font-medium leading-snug mb-1 m-0 hover:text-[#eb5322] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.size && (
                          <p className="text-[12.5px] text-gray-500 m-0">Phân loại: <span className="font-medium text-gray-600">{item.size}</span></p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center text-[14px] text-gray-700 font-medium">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-5 px-6 text-center text-[14px] text-gray-700 font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-5 px-6 text-right text-[14px] text-gray-800 font-bold">
                    {formatPrice(item.subTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Dòng Tổng Tiền Cuối Bảng */}
          <div className="flex justify-end items-center py-5 px-6 bg-gray-50/50 border-t border-gray-200 gap-16">
            <span className="text-[15px] font-bold text-gray-700 uppercase tracking-wide">Tổng cộng:</span>
            <span className="text-[20px] font-extrabold text-[#eb5322]">
              {formatPrice(orderData.totalAmount)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;