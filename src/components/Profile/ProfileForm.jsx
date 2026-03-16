import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, ChevronDown } from 'lucide-react';

// --- 1. MÀN HÌNH CHỈNH SỬA CHI TIẾT (Dựa trên thiết kế detail) ---
const ProfileForm = ({ userData, onBack }) => {
  const [formData, setFormData] = useState({
    email: userData?.email || '',
    fullName: userData?.fullName || '',
    phone: userData?.phoneNumber || '',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <h1 className="text-base font-normal uppercase !text-gray-600 mb-6 tracking-wide">TRANG THÔNG TIN TÀI KHOẢN</h1>
      
      <button 
        onClick={onBack}
        className="mb-8 px-8 py-2 !bg-[#eb5322] !text-white text-sm font-bold rounded-sm uppercase border-none cursor-pointer hover:!bg-[#d04316] transition-colors"
      >
        QUAY LẠI
      </button>

      <div className="space-y-8">
        {/* Phần: Thông tin tài khoản */}
        <section>
          <h2 className="text-xl font-bold !text-gray-800 mb-6">Thông tin tài khoản</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold !text-gray-700 mb-2">Email *</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-sm bg-gray-50 !text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold !text-gray-700 mb-2">Họ tên *</label>
              <input 
                type="text" 
                value={formData.fullName}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:border-[#eb5322] outline-none transition-colors"
                placeholder="Nhập họ tên"
              />
            </div>

            <div>
              <label className="block text-sm font-bold !text-gray-700 mb-2">Số điện thoại *</label>
              <input 
                type="tel" 
                value={formData.phone}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:border-[#eb5322] outline-none transition-colors"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-10">
              <label className="text-sm font-bold !text-gray-800 w-24">Giới tính:</label>
              <div className="flex-1 relative">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer">
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-10">
              <label className="text-sm font-bold !text-gray-800 w-24">Ngày sinh:</label>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer">
                    <option value="">Ngày</option>
                    {Array.from({length: 31}, (_, i) => (<option key={i+1} value={i+1}>{i+1}</option>))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer">
                    <option value="">Tháng</option>
                    {Array.from({length: 12}, (_, i) => (<option key={i+1} value={i+1}>{i+1}</option>))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer">
                    <option value="">Năm</option>
                    {Array.from({length: 100}, (_, i) => (<option key={2026-i} value={2026-i}>{2026-i}</option>))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="w-full py-3 !bg-[#eb5322] !text-white font-bold rounded-sm uppercase mt-4 hover:!bg-[#d04316] transition-colors border-none cursor-pointer">
              CẬP NHẬT
            </button>
          </div>
        </section>

        {/* Phần: Đổi mật khẩu */}
        <section className="pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold !text-gray-800 mb-6">Đổi mật khẩu</h2>
          <div className="space-y-5">
            <input type="password" underline="none" className="w-full px-4 py-2 border border-gray-300 rounded-sm outline-none focus:border-[#eb5322]" placeholder="Mật khẩu hiện tại (*)" />
            <input type="password" underline="none" className="w-full px-4 py-2 border border-gray-300 rounded-sm outline-none focus:border-[#eb5322]" placeholder="Mật khẩu mới (*)" />
            <input type="password" underline="none" className="w-full px-4 py-2 border border-gray-300 rounded-sm outline-none focus:border-[#eb5322]" placeholder="Nhập lại mật khẩu mới (*)" />
            <button className="w-full py-3 !bg-[#eb5322] !text-white font-bold rounded-sm uppercase hover:!bg-[#d04316] transition-colors border-none cursor-pointer">
              ĐỔI MẬT KHẨU
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default ProfileForm;