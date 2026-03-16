import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8086/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.name,
          encryptedPassword: formData.password,
          phoneNumber: formData.phone
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full !bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 !bg-green-50 rounded-full">
            <MailCheck size={48} className="!text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold !text-gray-800 mb-4">Đăng ký thành công!</h2>
        <p className="!text-gray-600 mb-8 leading-relaxed">
          Hệ thống đã gửi một email xác thực đến địa chỉ <span className="font-semibold !text-gray-900">{formData.email}</span>. 
          Vui lòng kiểm tra hộp thư đến để kích hoạt tài khoản.
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

  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold !text-[#eb5322] uppercase tracking-wide">Đăng ký</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>

      <div className="text-center mb-6 text-sm !text-gray-600">
        Đã có tài khoản, đăng nhập{' '}
        <Link 
          to="/login" 
          className="!text-[#eb5322] hover:!underline transition-colors !no-underline font-medium"
        >
          tại đây
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 flex items-center space-x-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            id="register-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập tên của bạn (*)"
          />
        </div>

        <div>
          <input
            id="register-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập email của bạn (*)"
          />
        </div>

        <div>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Số điện thoại"
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
            className="!appearance-none block !w-full !px-4 !py-3 !pr-10 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Mật khẩu"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#eb5322] focus:outline-none bg-transparent border-none cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="!appearance-none block !w-full !px-4 !py-3 !pr-10 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#eb5322] focus:outline-none bg-transparent border-none cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="pt-2">
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
              'Đăng ký'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;