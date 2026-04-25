import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, AlertCircle, MapPin, Phone, Calendar } from 'lucide-react';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        navigate('/login');
        return;
      }

      if (!id) {
        setError('Không tìm thấy mã đặt sân.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8086/api/v1/bookings/get-booking-detail/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const json = await response.json();

        if (response.ok && json.status === 200 && json.data) {
          setBookingData(json.data);
        } else {
          setError(json.message || 'Không tìm thấy thông tin đặt sân.');
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đặt sân:", err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetail();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTimeForDisplay = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    return `${parts[0]}h${parts[1]}`;
  };

  const renderStatus = (status) => {
    if (!status) return null;
    const s = status.toLowerCase();
    
    let colorClass = "text-[#fbad18]"; 
    let text = status;

    if (s.includes('hủy') || s === 'cancelled' || s === 'failed' || s === 'failure') {
      colorClass = "text-[#e3001b]";
      text = s === 'cancelled' ? 'Đã hủy' : (s === 'failed' || s === 'failure' ? 'Thất bại' : 'Đã hủy');
    } else if (s.includes('thành công') || s === 'success' || s === 'paid') {
      colorClass = "text-[#5cb85c]";
      text = 'Thành công';
    } else if (s === 'pending') {
      text = 'Chờ xử lý';
    } else if (s === 'processing') {
      text = 'Đang xử lý';
    }

    return <span className={`${colorClass} font-bold italic`}>{text}</span>;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-[#eb5322] mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Đang tải thông tin đặt sân...</p>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <AlertCircle size={60} className="text-[#e3001b] mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải đơn đặt sân</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/profile" className="px-6 py-2 bg-[#eb5322] text-white rounded-sm no-underline font-bold uppercase transition-colors hover:bg-[#d04316]">
          Quay lại tài khoản
        </Link>
      </div>
    );
  }

  const isCancelled = bookingData.status.toLowerCase() === 'cancelled' || bookingData.status.toLowerCase() === 'failed';

  return (
    <div className="w-full min-h-screen bg-white py-12 font-sans">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* --- HEADER: THÔNG BÁO --- */}
        <div className="flex items-center gap-4 mb-6">
          {isCancelled ? (
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#e3001b] flex items-center justify-center flex-shrink-0">
              <AlertCircle size={36} className="text-[#e3001b]" strokeWidth={1.5} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-[1.5px] border-[#5cb85c] flex items-center justify-center flex-shrink-0">
              <Check size={36} className="text-[#5cb85c]" strokeWidth={1.5} />
            </div>
          )}
          
          <h1 className="text-[20px] md:text-[22px] font-bold text-[#333] uppercase m-0 leading-snug">
            ĐƠN ĐẶT SÂN [#{bookingData.bookingId}] CỦA BẠN 
            {isCancelled ? ' ĐÃ BỊ HỦY.' : ' ĐÃ ĐƯỢC XÁC NHẬN.'}
          </h1>
        </div>

        {/* Nút Quay lại Profile */}
        <div className="mb-10">
          <Link 
            to="/profile" 
            className="inline-block bg-[#eb5322] hover:bg-[#d04316] text-white px-8 py-3 text-[14px] font-medium rounded-sm transition-colors uppercase !no-underline"
          >
            QUAY LẠI TÀI KHOẢN
          </Link>
        </div>

        {/* --- THÔNG TIN ĐẶT SÂN CƠ BẢN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-[14px] text-gray-800 mb-6">
          <div className="flex">
            <span className="w-24 flex-shrink-0">Họ tên:</span>
            <span className="font-bold text-gray-900">{bookingData.userName}</span>
          </div>
          <div className="flex">
            <span className="w-24 flex-shrink-0">Tình trạng:</span>
            {renderStatus(bookingData.status)}
          </div>
          <div className="flex">
            <span className="w-24 flex-shrink-0">Ngày đặt:</span>
            <span className="font-bold text-gray-900 flex-1 leading-snug">
              {formatDate(bookingData.bookingDate || bookingData.createdAt)}
            </span>
          </div>
          <div className="flex">
            <span className="w-24 flex-shrink-0">SĐT Sân:</span>
            <span className="font-bold text-gray-900 flex-1 leading-snug">
              {bookingData.courtCenterPhoneNumber || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        {/* THÔNG TIN TRUNG TÂM SÂN (Court Center) */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm mb-10 text-[14px] text-gray-800">
           <h3 className="font-bold text-[#eb5322] uppercase mb-2 flex items-center gap-2 text-[15px]">
             <MapPin size={18} /> Điểm đến
           </h3>
           <p className="mb-1"><span className="font-semibold w-24 inline-block">Hệ thống:</span> {bookingData.courtCenterName}</p>
           <p className="m-0"><span className="font-semibold w-24 inline-block">Địa chỉ:</span> {bookingData.courtCenterAddress}</p>
        </div>

        {/* --- GHI CHÚ ĐẶT SÂN --- */}
        <div className="text-[13.5px] text-gray-600 italic space-y-3 leading-relaxed mb-10">
          <p className="m-0">- Vui lòng đến đúng giờ để nhận sân. Quý khách giữ chỗ tối đa 10 phút so với giờ bắt đầu.</p>
          <p className="m-0">- Yêu cầu đi giày thể thao đế mềm (không đinh) để bảo vệ mặt thảm.</p>
          <p className="m-0">- Mọi thắc mắc và hỗ trợ, vui lòng gọi trực tiếp hotline của sân: <span className="font-bold text-[#eb5322] not-italic">{bookingData.courtCenterPhoneNumber || '0977508430'}</span></p>
        </div>

        {/* --- BẢNG CHI TIẾT CÁC CA SÂN ĐÃ ĐẶT --- */}
        <div className="border border-gray-200 rounded-sm overflow-x-auto shadow-sm mb-10">
          <table className="w-full text-left min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px]">Thông tin ca</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[180px] text-center">Thời gian</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[150px] text-center">Ngày chơi</th>
                <th className="py-4 px-6 font-semibold text-gray-700 text-[14.5px] w-[150px] text-right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.bookingItems?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50/30 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-orange-50 border border-orange-100 flex items-center justify-center rounded-sm">
                         <Calendar size={20} className="text-[#eb5322]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[14.5px] text-gray-800 font-bold leading-snug mb-1 m-0 uppercase">
                          {item.court?.name || `Sân ${item.court?.courtId}`}
                        </h3>
                        <p className="text-[13px] text-gray-500 m-0 font-medium">Loại: {item.court?.type || 'Không xác định'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center text-[14.5px] text-gray-700 font-bold">
                    {formatTimeForDisplay(item.startTime)} - {formatTimeForDisplay(item.endTime)}
                  </td>
                  <td className="py-5 px-6 text-center text-[14.5px] text-gray-700 font-medium">
                    {formatDate(item.bookingDate)}
                  </td>
                  <td className="py-5 px-6 text-right text-[15px] text-[#eb5322] font-bold">
                    {formatPrice(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex flex-col bg-gray-50/50 border-t border-gray-200 py-4 px-6 gap-3">
            <div className="flex justify-end items-center gap-16 pt-2">
              <span className="text-[15px] font-bold text-gray-700 uppercase tracking-wide">Tổng tiền sân:</span>
              <span className="text-[20px] font-extrabold text-gray-800 min-w-[140px] text-right">
                {formatPrice(bookingData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailPage;