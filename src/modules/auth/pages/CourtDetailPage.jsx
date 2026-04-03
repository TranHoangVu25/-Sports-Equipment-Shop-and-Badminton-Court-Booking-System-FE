import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, MapPin, Clock, Phone, Loader2, Info, Wifi, Coffee, Car } from 'lucide-react';

const CourtDetailPage = () => {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State quản lý tab đang hiển thị
  const [activeTab, setActiveTab] = useState('Dịch vụ'); // Đặt Dịch vụ làm mặc định để dễ xem bảng

  // Danh sách các tab navigation
  const TABS = ['Thông tin', 'Dịch vụ', 'Hình ảnh', 'Điều khoản & quy định', 'Đánh giá'];

  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  // Helper chuyển đổi thứ trong tuần
  const getDayName = (dayOfWeek) => {
    if (dayOfWeek === 8 || dayOfWeek === 1) return 'Chủ nhật';
    return `Thứ ${dayOfWeek}`;
  };

  // Helper định dạng giờ từ 05:00:00 -> 5h
  const formatTimeSlot = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr === '23:59:00' || timeStr === '24:00:00') return '24h';
    return timeStr.substring(0, 5).replace(/^0/, '').replace(':00', 'h');
  };

  useEffect(() => {
    const fetchCourtDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8086/api/v1/court-centers/detail/${id}`);
        const data = await response.json();

        if (response.ok && data.status === 200 && data.data) {
          const result = data.data;

          // Xử lý danh sách ảnh
          const extractedImages = result.images?.map(img => img.imageUrl).filter(url => url) || [];
          const coverImg = extractedImages.length > 0 
            ? extractedImages[0] 
            : "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80";

          // Xử lý giờ hoạt động (dựa vào slots đầu tiên nếu có)
          let minTime = "05:00";
          let maxTime = "23:00";
          if (result.slots && result.slots.length > 0) {
            minTime = result.slots[0].startTime ? result.slots[0].startTime.substring(0, 5) : "05:00";
            maxTime = result.slots[0].endTime ? result.slots[0].endTime.substring(0, 5) : "23:00";
          }

          // Cập nhật State với dữ liệu thực tế kết hợp Fallback cho các trường chưa có
          setCourt({
            id: result.courtCenterId,
            name: result.name || "Sân cầu lông chưa rõ tên",
            rating: 4.6, 
            reviews: 9,  
            category: "Cầu lông", // Đổi từ Pickleball thành Cầu lông
            address: result.locationDetail || "Đang cập nhật địa chỉ",
            time: `${minTime} - ${maxTime}`,
            phone: result.phoneNumber || "Đang cập nhật",
            coverImage: coverImg,
            logo: "https://via.placeholder.com/150x150/eb5322/ffffff?text=VNB", 
            description: `Hệ thống ${result.name} bao gồm ${result.courts?.length || 0} sân đạt chuẩn chất lượng cao. Địa chỉ tọa lạc tại ${result.locationDetail}. Trang bị mặt thảm chống trơn trượt, hệ thống đèn led hiện đại và không gian thoáng đãng. Phù hợp cho cả tập luyện chuyên nghiệp và giao lưu phong trào.`,
            services: ["Wifi miễn phí", "Bãi đỗ xe ô tô/xe máy rộng rãi", "Phòng thay đồ/Tắm nóng lạnh", "Căn tin/Giải khát", "Cho thuê vợt/giày"],
            images: extractedImages.length > 0 ? extractedImages : ["https://via.placeholder.com/600x400?text=Chua+co+anh"],
            rules: "1. Vui lòng mang giày thể thao đế mềm (không đinh) khi vào sân.\n2. Không hút thuốc, ăn uống trên mặt sân thảm.\n3. Nhận sân đúng giờ, trả sân đúng giờ quy định.",
            pricingRules: result.pricingRules || []
          });
        } else {
          setError(data.message || "Không thể lấy thông tin sân.");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sân:", err);
        setError("Không thể tải thông tin sân. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtDetail();
    window.scrollTo(0, 0);
  }, [id]);

  // HÀM RENDER BẢNG GIÁ DỊCH VỤ THEO ẢNH
  const renderPricingTable = () => {
    if (!court.pricingRules || court.pricingRules.length === 0) return null;

    // 1. Nhóm theo Ngày (specificDate hoặc mặc định là chuỗi ngày)
    const dateGroups = {};
    court.pricingRules.forEach(rule => {
      const dKey = rule.specificDate ? new Date(rule.specificDate).toLocaleDateString('vi-VN') : '01/12 - 31/12'; 
      if (!dateGroups[dKey]) dateGroups[dKey] = {};
      if (!dateGroups[dKey][rule.dayOfWeek]) dateGroups[dKey][rule.dayOfWeek] = [];
      dateGroups[dKey][rule.dayOfWeek].push(rule);
    });

    // 2. Nhóm các ngày trong tuần (Thứ) có cùng quy tắc giá/khung giờ
    const finalGroups = {};
    Object.keys(dateGroups).forEach(dKey => {
      const daysMap = dateGroups[dKey];
      const signatureMap = {};

      Object.keys(daysMap).forEach(day => {
        // Sắp xếp các khung giờ tăng dần
        const rules = daysMap[day].sort((a,b) => a.startTime.localeCompare(b.startTime));
        // Tạo ra chuỗi đại diện (signature) để so sánh các thứ có trùng nhau không
        const signature = rules.map(r => `${r.startTime}-${r.endTime}-${r.pricePerHour}`).join('|');
        if (!signatureMap[signature]) {
          signatureMap[signature] = { days: [], rules: rules };
        }
        signatureMap[signature].days.push(parseInt(day));
      });

      // 3. Render tên thứ (VD: T2 - T6, T7 - CN)
      finalGroups[dKey] = Object.values(signatureMap).map(sig => {
        const sortedDays = sig.days.sort((a,b) => a-b);
        let dayLabel = '';
        const isT2toT6 = [2,3,4,5,6].every(d => sortedDays.includes(d)) && sortedDays.length === 5;
        const isT7CN = sortedDays.includes(7) && (sortedDays.includes(8) || sortedDays.includes(1)) && sortedDays.length === 2;
        
        if (isT2toT6) dayLabel = 'T2 - T6';
        else if (isT7CN) dayLabel = 'T7 - CN';
        else if (sortedDays.length === 7) dayLabel = 'T2 - CN';
        else dayLabel = sortedDays.map(d => (d === 8 || d === 1) ? 'CN' : `T${d}`).join(', ');
        
        return { dayLabel, rules: sig.rules };
      });
    });

    return (
      <div className="overflow-x-auto w-full mb-8">
        <table className="w-full text-center border-collapse border border-[#118a44] text-[14px]">
          <thead>
            <tr>
              <th colSpan="3" className="py-3 px-4 font-bold text-[#118a44] border border-[#118a44] uppercase tracking-wide bg-white">
                {court.category}
              </th>
            </tr>
            <tr className="bg-white">
              <th className="py-3 px-4 font-bold text-[#118a44] border border-[#118a44]">Thứ</th>
              <th className="py-3 px-4 font-bold text-[#118a44] border border-[#118a44]">Khung giờ</th>
              <th className="py-3 px-4 font-bold text-[#118a44] border border-[#118a44]">Giá</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(finalGroups).map((dKey) => {
              const dayGroups = finalGroups[dKey];
              
              return dayGroups.map((g, gIdx) => {
                return g.rules.map((rule, rIdx) => (
                  <tr key={`${dKey}-${g.dayLabel}-${rIdx}`} className="bg-white text-gray-800">
                    
                    {/* CỘT THỨ: Gộp (RowSpan) tất cả các khung giờ thuộc cùng 1 nhóm Thứ */}
                    {rIdx === 0 && (
                      <td rowSpan={g.rules.length} className="py-3 px-4 border border-[#118a44] align-middle whitespace-nowrap">
                        {g.dayLabel}
                      </td>
                    )}
                    
                    {/* CỘT KHUNG GIỜ */}
                    <td className="py-3 px-4 border border-[#118a44] whitespace-nowrap">
                      {formatTimeSlot(rule.startTime)} - {formatTimeSlot(rule.endTime)}
                    </td>
                    
                    {/* CỘT GIÁ */}
                    <td className="py-3 px-4 border border-[#118a44] whitespace-nowrap">
                      {formatPrice(rule.pricePerHour)}
                    </td>
                  </tr>
                ));
              });
            })}
          </tbody>
        </table>
      </div>
    );
  };


  // Hàm render nội dung theo Tab đang chọn
  const renderTabContent = () => {
    if (!court) return null;

    switch (activeTab) {
      case 'Thông tin':
        return (
          <div className="space-y-6 animate-fade-in text-gray-700 text-[14px] leading-relaxed">
            <div>
              <h3 className="font-bold text-[16px] text-gray-800 mb-2">Giới thiệu chung</h3>
              <p>{court.description}</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm">
              <p className="font-medium text-[#eb5322] flex items-center gap-2 mb-2">
                <Info size={16} /> Lưu ý:
              </p>
              <p className="text-sm text-gray-600">Vui lòng liên hệ trực tiếp số điện thoại chủ sân để xác nhận chính xác các khung giờ trống hiện tại.</p>
            </div>
          </div>
        );
      case 'Dịch vụ':
        return (
          <div className="animate-fade-in">
             
             {/* Render Bảng Giá bên trong Tab Dịch Vụ */}
             {renderPricingTable()}

             <h3 className="font-bold text-[16px] text-gray-800 mb-4 mt-6">Tiện ích tại sân</h3>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {court.services.map((service, index) => (
                 <li key={index} className="flex items-center gap-3 text-[14px] text-gray-700 bg-gray-50 p-3 rounded-sm border border-gray-100">
                   <div className="text-[#118a44]"><CheckCircleIcon /></div>
                   {service}
                 </li>
               ))}
             </ul>
          </div>
        );
      case 'Hình ảnh':
        return (
          <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-3 gap-3">
            {court.images.map((img, index) => (
              <div key={index} className="aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                <img src={img} alt={`Hình ảnh sân ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
      case 'Điều khoản & quy định':
        return (
          <div className="animate-fade-in text-[14px] text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-5 rounded-sm border border-gray-200">
            <h3 className="font-bold text-[16px] text-[#118a44] mb-3">Nội quy sân bãi</h3>
            {court.rules}
          </div>
        );
      case 'Đánh giá':
        return (
          <div className="animate-fade-in text-center py-10">
            <Star size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Chưa có đánh giá chi tiết nào cho sân này.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-[#eb5322]" />
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">{error || "Sân không tồn tại."}</p>
        <Link to="/courts" className="px-6 py-2 bg-[#eb5322] text-white rounded-sm no-underline font-medium hover:bg-[#d04316] transition-colors">
          Quay lại hệ thống sân
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans pb-20">
      
      {/* 1. BANNER & HEADER */}
      <div className="h-[280px] relative bg-gray-300">
        <img 
          src={court.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {/* Lớp overlay đen mờ cho dễ nhìn nút */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Thanh Navigation */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
          <Link to="/courts" className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors cursor-pointer">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div className="flex gap-3">
            <button className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors border-none cursor-pointer">
              <Heart size={20} strokeWidth={2.5} className="hover:text-red-500 transition-colors" />
            </button>
            <button className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors border-none cursor-pointer">
              <Share2 size={20} strokeWidth={2.5} className="hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. FLOATING INFO CARD */}
      <div className="max-w-[1000px] mx-auto px-4 relative z-10 -mt-24 mb-6">
        <div className="bg-white rounded-sm shadow-md p-6 pt-12 relative border border-gray-100">
          
          {/* Avatar (Logo sân) - Tràn lên trên */}
          <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-sm border-4 border-white shadow-sm overflow-hidden flex items-center justify-center p-1">
            <img src={court.logo} alt="Logo" className="w-full h-full object-contain rounded-sm" />
          </div>

          {/* Huy hiệu đánh giá - Nằm sát mép phải Logo */}
          <div className="absolute -top-4 left-[135px] bg-[#118a44] text-white px-3 py-1 rounded-sm text-[12px] font-bold flex items-center shadow-sm">
            <Star size={12} fill="currentColor" className="mr-1.5" /> 
            {court.rating} ({court.reviews} đánh giá)
          </div>

          {/* Nút đặt lịch - Góc phải (Mobile: Dời xuống dưới) */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 hidden sm:block">
            <button className="bg-[#f0ad4e] hover:bg-[#e09d3e] text-white font-bold py-2.5 px-8 rounded-sm transition-colors shadow-sm text-[14px] border-none cursor-pointer">
              ĐẶT LỊCH
            </button>
          </div>

          {/* Thông chính */}
          <div className="pr-0 sm:pr-40">
            <h1 className="text-[20px] md:text-[22px] font-bold text-gray-800 mt-2 mb-2 leading-snug">
              {court.name}
            </h1>
            
            <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-sm text-[12px] font-medium mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5">
                <path d="M12 22v-5"></path><path d="M9 7l3 10 3-10"></path><path d="M14 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path><path d="M10 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path><path d="M6 7l6 10"></path><path d="M18 7l-6 10"></path>
              </svg>
              {court.category}
            </div>

            <div className="space-y-3.5 text-[14px] text-gray-600 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#118a44] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                <span className="leading-snug">{court.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-[#118a44] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                <span>{court.time}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-[#118a44] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                <div className="flex flex-col">
                  <a href={`tel:${court.phone}`} className="text-[#eb5322] font-semibold hover:underline no-underline block">{court.phone}</a>
                </div>
              </div>
            </div>
            
            {/* Nút đặt lịch cho màn hình Mobile */}
            <div className="mt-6 block sm:hidden">
              <button className="w-full bg-[#f0ad4e] hover:bg-[#e09d3e] text-white font-bold py-3 rounded-sm transition-colors shadow-sm text-[14px] border-none cursor-pointer">
                ĐẶT LỊCH NGAY
              </button>
            </div>
          </div>

          {/* 3. TABS NAVIGATION */}
          <div className="flex overflow-x-auto border-b border-gray-200 mt-8 scrollbar-thin scrollbar-thumb-gray-300 w-full pb-0.5">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-3.5 px-6 font-bold text-[14px] transition-colors bg-transparent cursor-pointer border-t-0 border-l-0 border-r-0 border-b-[3px] outline-none ${
                  activeTab === tab 
                    ? 'border-[#118a44] text-[#118a44]' // Tab active chuyển màu xanh đậm theo thiết kế
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4. TAB CONTENT AREA */}
        <div className="bg-white mt-4 rounded-sm shadow-sm p-6 border border-gray-100 min-h-[300px]">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
};

// Component Icon check nhỏ tiện dụng
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default CourtDetailPage;