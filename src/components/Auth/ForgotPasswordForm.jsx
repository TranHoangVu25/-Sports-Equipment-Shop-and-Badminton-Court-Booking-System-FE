import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Loader2, MailCheck } from 'lucide-react';

const ForgotPasswordForm = () => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hàm sinh mã captcha ngẫu nhiên 4 chữ số
  const generateCaptcha = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(randomCode);
  };

  // Khởi tạo captcha khi component được render lần đầu
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Xử lý khi người dùng bấm "Lấy lại mật khẩu"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang
    setError('');

    // 1. Kiểm tra để trống email
    if (!email.trim()) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }

    // 2. Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }

    // 3. Kiểm tra để trống captcha
    if (!inputCaptcha.trim()) {
      setError('Vui lòng nhập mã captcha.');
      return;
    }

    // 4. Kiểm tra tính hợp lệ của mã captcha
    if (inputCaptcha !== captchaCode) {
      setError('Mã captcha không chính xác! Vui lòng thử lại.');
      generateCaptcha(); // Tạo mã mới để tăng tính bảo mật
      setInputCaptcha(''); // Xóa ô nhập cũ
      return;
    }

    // NẾU HỢP LỆ: Xử lý gọi API cấp lại mật khẩu
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        // Cập nhật trạng thái thành công để hiển thị màn hình thông báo
        setIsSuccess(true);
      } else {
        // Hiển thị lỗi trả về từ API
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        generateCaptcha();
        setInputCaptcha('');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API forgot-password:', err);
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
            <MailCheck size={48} className="!text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold !text-gray-800 mb-4">Gửi yêu cầu thành công!</h2>
        <p className="!text-gray-600 mb-8 leading-relaxed">
          Hệ thống đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ email <span className="font-semibold !text-gray-900">{email}</span>. 
          Vui lòng kiểm tra hộp thư đến (hoặc thư rác) để tiếp tục.
        </p>
        <Link 
          to="/login" 
          className="inline-block !w-full !py-3 !px-4 !bg-[#eb5322] hover:!bg-[#d04316] !text-white rounded-md font-medium transition-colors !no-underline uppercase tracking-wider"
        >
          Trở về Đăng nhập
        </Link>
      </div>
    );
  }

  // MÀN HÌNH FORM QUÊN MẬT KHẨU
  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold !text-[#eb5322] uppercase tracking-wide">Quên mật khẩu</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        
        {/* Thông báo lỗi được chuyển xuống ngay trên ô nhập Email */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md flex items-center space-x-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <input
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Email đăng ký tài khoản"
            disabled={isLoading}
          />
        </div>

        {/* Captcha Row */}
        <div className="flex items-center space-x-4">
          <input
            id="captcha"
            name="captcha"
            type="text"
            value={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
            className="!appearance-none block !w-full !flex-1 !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors tracking-widest"
            placeholder="Nhập mã captcha"
            maxLength={4}
            disabled={isLoading}
          />
          {/* Mock Captcha Image with Dynamic Code */}
          <div className="w-[120px] h-12 bg-white border border-gray-200 rounded flex items-center justify-center relative overflow-hidden select-none" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
             {/* Noise lines */}
             <div className="absolute w-[150%] h-[1px] bg-gray-400 transform rotate-12 top-1/2 -left-4"></div>
             <div className="absolute w-[150%] h-[1px] bg-gray-300 transform -rotate-6 top-1/3 -left-4"></div>
             <div className="absolute w-[150%] h-[1px] bg-gray-300 transform -rotate-12 bottom-1/3 -left-4"></div>
             
             {/* Captcha text dynamic */}
             <span className="relative z-10 font-serif text-[28px] tracking-[0.2em] italic text-gray-800 font-bold mix-blend-multiply filter blur-[0.3px]">
               {captchaCode}
             </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="!appearance-none !w-full flex justify-center items-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Đang gửi...
              </>
            ) : (
              'Lấy lại mật khẩu'
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-end text-sm !text-gray-600 mt-4">
           <Link 
             to="/login" 
             className="!text-gray-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline font-medium"
           >
             Đăng nhập tại đây
           </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;