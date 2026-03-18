import { MapPin, Phone, User } from 'lucide-react';
// =======================================================================
// 1. MÀN HÌNH TỔNG QUAN (ProfileOverView)
// Chỉ lấy 3 trường: Họ tên, Số ĐT, Địa chỉ từ API
// =======================================================================
const ProfileOverView = ({ userData, onEdit }) => {
  // Lấy trực tiếp từ các trường cấp cao nhất thay vì mảng addresses
  const nameDisplay = userData?.fullName || 'Chưa cập nhật';
  const phoneDisplay = userData?.phoneNumber || 'Chưa cập nhật';
  const locationDetailDisplay = userData?.location || 'Chưa cập nhật';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full bg-white">
      <h1 className="text-xl font-bold uppercase !text-gray-900 mb-1 font-sans">THÔNG TIN TÀI KHOẢN</h1>
      <p className="italic text-sm !text-gray-600 mb-10 font-sans">
        Xin chào, <span className="!text-[#eb5322] font-semibold not-italic">{nameDisplay}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
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
            className="mt-8 w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white py-3 text-sm transition-colors border-none cursor-pointer uppercase rounded-sm font-bold tracking-wider font-sans"
          >
            Sửa thông tin
          </button>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5 tracking-wide border-b pb-2 font-sans">ĐƠN HÀNG CỦA BẠN</h2>
          <div className="overflow-x-auto border border-gray-200 mt-4 rounded-sm">
            <table className="w-full text-sm border-collapse min-w-[600px] font-sans">
              <thead>
                <tr className="!bg-[#eb5322] !text-white text-center font-bold">
                  <th className="py-3 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Đơn hàng</th>
                  <th className="py-3 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Ngày</th>
                  <th className="py-3 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Địa chỉ</th>
                  <th className="py-3 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Giá trị</th>
                  <th className="py-3 px-2 font-bold whitespace-nowrap uppercase">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-16 text-center !text-gray-500 bg-white italic border-t border-gray-100">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverView;