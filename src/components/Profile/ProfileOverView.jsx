import { MapPin, Phone, User } from 'lucide-react';
// --- 2. MÀN HÌNH TỔNG QUAN (Thông tin tài khoản & Đơn hàng) ---
const ProfileOverview = ({ userData, onEdit }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full bg-white">
      <h1 className="text-xl font-bold uppercase !text-gray-900 mb-1">THÔNG TIN TÀI KHOẢN</h1>
      <p className="italic text-sm !text-gray-600 mb-10">
        Xin chào, <span className="!text-[#eb5322] font-semibold not-italic">{userData?.fullName || 'Khách'}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cột trái: Thông tin khách hàng */}
        <div className="md:col-span-1">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5">THÔNG TIN KHÁCH HÀNG</h2>
          <div className="space-y-4 text-sm !text-gray-800">
            <div className="flex items-start">
              <User size={16} className="!text-[#eb5322] mr-2 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Họ tên:</span> {userData?.fullName || 'Chưa cập nhật'}</div>
            </div>
            <div className="flex items-start">
              <Phone size={16} className="!text-[#eb5322] mr-2 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Số ĐT:</span> {userData?.phoneNumber || 'Chưa cập nhật'}</div>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="!text-[#eb5322] mr-2 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Địa chỉ:</span> Chưa cập nhật</div>
            </div>
          </div>
          <button 
            onClick={onEdit}
            className="mt-6 w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white py-2.5 text-sm transition-colors border-none cursor-pointer uppercase rounded-sm font-bold"
          >
            Sửa thông tin
          </button>
        </div>

        {/* Cột phải: Đơn hàng */}
        <div className="md:col-span-2">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5">ĐƠN HÀNG CỦA BẠN</h2>
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="!bg-[#eb5322] !text-white text-center font-bold">
                  <th className="py-2.5 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Đơn hàng</th>
                  <th className="py-2.5 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Ngày</th>
                  <th className="py-2.5 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Địa chỉ</th>
                  <th className="py-2.5 px-2 border-r border-white/30 font-bold whitespace-nowrap uppercase">Giá trị</th>
                  <th className="py-2.5 px-2 font-bold whitespace-nowrap uppercase">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="py-10 text-center !text-gray-500 bg-white italic border-t border-gray-200">
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
export default ProfileOverview;