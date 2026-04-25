import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Plus, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

const CourtCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { court, selectedDate, selectedSlots, totalAmount, totalHours, totalMins, bookingDetails } = location.state || {};

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Lấy Profile người dùng
  useEffect(() => {
    if (!court || !selectedSlots || selectedSlots.length === 0) {
      navigate('/courts', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8086/api/v1/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.code === 0 && data.result) {
          setFullName(data.result.fullName || '');
          setPhone(data.result.phoneNumber || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
    window.scrollTo(0, 0);
  }, [court, selectedSlots, navigate]);

  if (!court) return null;

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';
  const displayDate = new Date(selectedDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const formatTimeForDisplay = (timeStr) => {
     if (!timeStr) return '';
     const parts = timeStr.split(':');
     return `${parts[0]}h${parts[1]}`;
  };

  const handleConfirmBooking = async () => {
    if (!fullName.trim() || !phone.trim()) {
      alert("Vui lòng điền đầy đủ Tên và Số điện thoại!");
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const payload = {
        recipient: fullName,
        phoneNumber: phone,
        items: bookingDetails || []
      };

      const response = await fetch('http://localhost:8086/api/v1/orders/momo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      // 1. Đọc dữ liệu trả về dưới dạng text để phòng trường hợp API trả về plain text URL
      const responseText = await response.text();
      let payUrl = '';

      try {
        // 2. Thử parse JSON (nếu API bọc URL trong 1 object)
        const data = JSON.parse(responseText);
        payUrl = data.result || data.payUrl || data.url || data;
      } catch (e) {
        // Nếu parse lỗi, nghĩa là API trả về trực tiếp chuỗi URL
        payUrl = responseText;
      }

      // 3. Làm sạch chuỗi (xóa bỏ dấu nháy kép thừa nếu có)
      if (typeof payUrl === 'string') {
        payUrl = payUrl.replace(/^["']|["']$/g, '').trim();
      }

      // 4. Nếu là link hợp lệ, tiến hành Redirect thẳng sang trang thanh toán
      if (payUrl && payUrl.startsWith('http')) {
        window.location.href = payUrl;
      } else {
        alert("Lỗi: Không lấy được đường dẫn thanh toán MoMo. Dữ liệu trả về: " + payUrl);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col relative pb-24">
      {/* Loading Overlay */}
      {(isSubmitting || isLoadingProfile) && (
        <div className="fixed inset-0 z-[100] bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 size={48} className="animate-spin text-[#eb5322]" />
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#eb5322] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-200 bg-transparent border-none cursor-pointer p-1">
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] md:text-[20px] font-bold m-0 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap tracking-wide">
          Xác nhận & Thanh toán
        </h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full space-y-4">
        
        {/* CARD 1: Thông tin sân */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5">
          <h3 className="text-[#eb5322] font-bold text-[15px] flex items-center gap-2 mb-3 uppercase">
            <MapPin size={18} strokeWidth={2.5} /> Thông tin sân
          </h3>
          <div className="space-y-2 text-[14px] text-gray-800">
            <p><span className="font-semibold text-gray-600 inline-block min-w-[80px]">Tên CLB:</span> {court.name}</p>
            <p className="flex"><span className="font-semibold text-gray-600 inline-block min-w-[80px]">Địa chỉ:</span> <span className="flex-1">{court.address}</span></p>
          </div>
        </div>

        {/* CARD 2: Thông tin lịch đặt */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-5">
          <h3 className="text-[#eb5322] font-bold text-[15px] flex items-center gap-2 mb-4 uppercase">
            <Calendar size={18} strokeWidth={2.5} /> Thông tin lịch đặt
          </h3>
          
          <div className="space-y-3 text-[14px] text-gray-800">
            <p><span className="font-semibold text-gray-600 min-w-[80px] inline-block">Ngày:</span> <span className="font-bold text-[#eb5322]">{displayDate}</span></p>
            
            <div className="space-y-2 py-2 border-y border-gray-100">
              {bookingDetails?.map((detail, idx) => {
                const courtName = court.courts?.find(c => c.courtId === detail.courtId)?.name || `${court.category} ${detail.courtId}`;
                return (
                  <p key={idx} className="font-medium">
                    - {courtName}: {formatTimeForDisplay(detail.startTime)} - {formatTimeForDisplay(detail.endTime)} <span className="text-gray-400 font-normal">|</span> <span className="text-[#eb5322] font-bold">{formatPrice(detail.totalPrice)}</span>
                  </p>
                );
              })}
            </div>

            <p><span className="font-semibold text-gray-600 min-w-[80px] inline-block">Đối tượng:</span> {court.name}</p>
            <p><span className="font-semibold text-gray-600 min-w-[80px] inline-block">Tổng giờ:</span> {totalHours}h{totalMins > 0 ? String(totalMins).padStart(2, '0') : '00'}</p>
            <p className="text-[16px]"><span className="font-semibold text-gray-600 min-w-[80px] inline-block">Tổng tiền:</span> <span className="font-extrabold text-[#eb5322] text-[18px]">{formatPrice(totalAmount)}</span></p>
          </div>
        </div>

        {/* Nút Thêm Dịch Vụ */}
        <button className="w-full py-3.5 bg-white border border-[#eb5322] text-[#eb5322] font-bold rounded-md flex items-center justify-center hover:bg-orange-50 transition-colors shadow-sm cursor-pointer text-[14px]">
          <Plus size={18} className="mr-1" /> Thêm dịch vụ
        </button>

        {/* FORM NHẬP LIỆU */}
        <div className="space-y-4 pt-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <label className="block text-[12px] font-bold text-gray-600 uppercase mb-2">Tên của bạn (*)</label>
            <div className="relative">
              <input 
                type="text" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-[#eb5322] transition-colors text-[15px] font-medium text-gray-900" 
                placeholder="Nhập họ tên" 
              />
              {fullName && <XCircle size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setFullName('')}/>}
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <label className="block text-[12px] font-bold text-gray-600 uppercase mb-2">Số điện thoại (*)</label>
            <div className="flex border-b border-gray-300 focus-within:border-[#eb5322] transition-colors">
              <div className="px-2 py-2 flex items-center gap-2 text-gray-700 font-medium bg-white">
                <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-auto rounded-[2px] shadow-sm" /> +84
              </div>
              <div className="relative flex-1">
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full px-2 py-2 focus:outline-none text-[15px] font-medium text-gray-900" 
                  placeholder="Nhập số điện thoại" 
                />
                {phone && <XCircle size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setPhone('')}/>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <label className="block text-[12px] font-bold text-gray-600 uppercase mb-2">Ghi chú cho chủ sân</label>
            <input 
              type="text"
              value={note} 
              onChange={e => setNote(e.target.value)} 
              className="w-full py-2 border-b border-gray-300 focus:outline-none focus:border-[#eb5322] transition-colors text-[15px] text-gray-900" 
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>

        {/* LƯU Ý */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3 mt-4 shadow-sm">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
          <p className="text-[13px] text-yellow-800 m-0 leading-relaxed font-medium">
            <span className="font-bold uppercase mr-1">Lưu ý:</span> 
            Vui lòng kiểm tra kỹ thông tin lịch đặt trước khi xác nhận. Thời gian giữ chỗ là 5 phút.
          </p>
        </div>
      </div>

      {/* STICKY BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="w-full bg-[#fbad18] hover:bg-[#e59b12] text-white font-bold text-[16px] py-4 rounded-md uppercase tracking-wide transition-colors shadow-md border-none cursor-pointer disabled:opacity-70 flex justify-center items-center"
          >
            {isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Đang chuyển hướng...</> : 'Xác nhận & Thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtCheckoutPage;