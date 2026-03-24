import { Loader2, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
// =======================================================================
// 1. MÀN HÌNH TỔNG QUAN (ProfileOverView)
// Chỉ lấy 3 trường: Họ tên, Số ĐT, Địa chỉ từ API
// =======================================================================
const ProfileOverView = ({ userData, onEdit }) => {
  const nameDisplay = userData?.fullName || 'Chưa cập nhật';
  const phoneDisplay = userData?.phoneNumber || 'Chưa cập nhật';
  const locationDetailDisplay = userData?.location || 'Chưa cập nhật';

  // State quản lý danh sách đơn hàng
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Gọi API lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingOrders(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8086/api/v1/orders/get-list-order', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.code === 0) {
          setOrders(data.result || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper functions
  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': 
        return <span className="text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded text-xs border border-orange-100">Chờ xử lý</span>;
      case 'processing': 
        return <span className="text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded text-xs border border-blue-100">Đang xử lý</span>;
      case 'shipped': 
        return <span className="text-indigo-500 font-medium bg-indigo-50 px-2 py-1 rounded text-xs border border-indigo-100">Đang giao</span>;
      case 'delivered': 
        return <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded text-xs border border-green-100">Đã giao</span>;
      case 'cancelled': 
        return <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded text-xs border border-red-100">Đã hủy</span>;
      default: 
        return <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full bg-white">
      <h1 className="text-xl font-bold uppercase !text-gray-900 mb-1 font-sans">THÔNG TIN TÀI KHOẢN</h1>
      <p className="italic text-sm !text-gray-600 mb-10 font-sans">
        Xin chào, <span className="!text-[#eb5322] font-semibold not-italic">{nameDisplay}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT THÔNG TIN KHÁCH HÀNG */}
        <div className="lg:col-span-1">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5 tracking-wide border-b pb-2 font-sans">THÔNG TIN KHÁCH HÀNG</h2>
          <div className="space-y-4 text-sm !text-gray-800 mt-4 font-sans">
            <div className="flex items-start">
              <User size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Họ tên:</span> {nameDisplay}</div>
            </div>
            <div className="flex items-start">
              <Phone size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Số ĐT:</span> {phoneDisplay}</div>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Địa chỉ:</span> {locationDetailDisplay}</div>
            </div>
          </div>
          <button 
            onClick={onEdit}
            className="mt-8 w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white py-3 text-sm transition-colors border-none cursor-pointer uppercase rounded-sm font-bold tracking-wider font-sans shadow-sm"
          >
            Sửa thông tin
          </button>
        </div>

        {/* CỘT DANH SÁCH ĐƠN HÀNG */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5 tracking-wide border-b pb-2 font-sans flex items-center justify-between">
            <span>ĐƠN HÀNG CỦA BẠN</span>
            {!isLoadingOrders && orders.length > 0 && (
              <span className="text-xs font-medium text-gray-500 normal-case bg-gray-100 px-2 py-1 rounded-full">
                {orders.length} đơn hàng
              </span>
            )}
          </h2>
          
          <div className="overflow-x-auto border border-gray-200 mt-4 rounded-sm shadow-sm">
            <table className="w-full text-sm border-collapse min-w-[650px] font-sans">
              <thead>
                <tr className="!bg-[#eb5322] !text-white text-center font-bold">
                  <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Mã ĐH</th>
                  <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Ngày đặt</th>
                  <th className="py-3 px-4 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-left">Địa chỉ giao</th>
                  <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-right">Tổng tiền</th>
                  <th className="py-3 px-3 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoadingOrders ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Loader2 size={30} className="animate-spin text-[#eb5322] mx-auto mb-3" />
                      <span className="text-gray-500 italic">Đang tải dữ liệu...</span>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center !text-gray-500 italic bg-gray-50/50">
                      Bạn chưa có đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.orderId} className="hover:bg-orange-50/30 transition-colors cursor-default">
                      <td className="py-3.5 px-3 border-r border-gray-100 text-center font-medium text-gray-800">
                        #{order.orderId}
                      </td>
                      <td className="py-3.5 px-3 border-r border-gray-100 text-center text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100 text-gray-600 max-w-[220px] truncate" title={order.locationDetail}>
                        {order.locationDetail || 'Không có địa chỉ'}
                      </td>
                      <td className="py-3.5 px-3 border-r border-gray-100 text-right font-bold text-[#eb5322]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {translateStatus(order.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileOverView;