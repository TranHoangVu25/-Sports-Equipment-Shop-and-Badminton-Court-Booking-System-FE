import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Xử lý khi người dùng bấm "Đặt lại mật khẩu"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Kiểm tra để trống
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.');
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu (tuỳ chọn, ví dụ tối thiểu 6 ký tự)
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // 3. Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    // NẾU HỢP LỆ: Xử lý gọi API đặt lại mật khẩu
    setIsLoading(true);
    try {
      // Lấy token từ URL (ví dụ: ?token=86e98673-...)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setError('Đường dẫn không hợp lệ hoặc đã hết hạn (thiếu mã token).');
        setIsLoading(false);
        return;
      }

      // Truyền token vào query parameter của URL API
      const response = await fetch(`http://localhost:8086/api/v1/auth/change-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: password }), 
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        // Cập nhật trạng thái thành công
        setIsSuccess(true);
        
        // Tự động redirect về màn login sau 3 giây
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Hiển thị lỗi trả về từ API
        setError(data.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API change-password:', err);
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // MÀN HÌNH THÔNG BÁO THÀNH CÔNG
  if (isSuccess) {
    return (
      <div className="max-w-md w-full !bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 !bg-green-50 rounded-full">
            <CheckCircle2 size={48} className="!text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold !text-gray-800 mb-4">Thành công!</h2>
        <p className="!text-gray-600 mb-2 leading-relaxed">
          Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống ngay bây giờ.
        </p>
        <p className="!text-sm !text-gray-400 mb-8 animate-pulse">
          Đang tự động chuyển hướng về trang đăng nhập...
        </p>
        <Link 
          to="/login" 
          className="inline-block !w-full !py-3 !px-4 !bg-[#eb5322] hover:!bg-[#d04316] !text-white rounded-md font-medium transition-colors !no-underline uppercase tracking-wider"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // MÀN HÌNH FORM ĐẶT LẠI MẬT KHẨU
  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold !text-[#eb5322] uppercase tracking-wide">Đặt lại mật khẩu</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
        <p className="mt-4 text-sm !text-gray-500">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        
        {/* Thông báo lỗi */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md flex items-center space-x-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Ô nhập mật khẩu mới */}
        <div className="relative">
          <input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="!appearance-none block !w-full !px-4 !py-3 !pr-10 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Mật khẩu mới (*)"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#eb5322] focus:outline-none bg-transparent border-none cursor-pointer disabled:opacity-50"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Ô nhập lại mật khẩu mới */}
        <div className="relative">
          <input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="!appearance-none block !w-full !px-4 !py-3 !pr-10 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập lại mật khẩu mới (*)"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#eb5322] focus:outline-none bg-transparent border-none cursor-pointer disabled:opacity-50"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Nút Submit */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="!appearance-none !w-full flex justify-center items-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              'Cập nhật mật khẩu'
            )}
          </button>
        </div>
        
        {/* Nút quay lại */}
        <div className="flex items-center justify-center text-sm !text-gray-600 mt-4">
           <Link 
             to="/login" 
             className="!text-gray-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline font-medium"
           >
             Quay lại đăng nhập
           </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;