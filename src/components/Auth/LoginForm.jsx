import {
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8086/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.result && data.result.token) {
        const { token, role } = data.result;
        
        // 1. Lưu token vào localStorage để sử dụng gắn vào Header ở các request sau
        localStorage.setItem('token', token);
        // Có thể lưu thêm thông tin user nếu cần hiển thị tên ở Header
        localStorage.setItem('user', JSON.stringify(data.result));

        // 2. Kiểm tra role và chuyển hướng
        if (role === 'ROLE_user') {
          navigate('/'); // Điều hướng về HomePage
        } else {
          // Xử lý các role khác (ví dụ: ROLE_admin)
          navigate('/'); 
        }
      } else {
        // Hiển thị lỗi từ backend trả về hoặc lỗi mặc định
        setError(data.message || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold !text-gray-800 uppercase tracking-wide">Đăng nhập</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>
      <form className="space-y-6" onSubmit={handleLogin}>
        
        {/* Khối hiển thị thông báo lỗi */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <input
            id="email-phone"
            name="email-phone"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Email/Số ĐT"
          />
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="!appearance-none block !w-full !px-4 !py-3 !pr-10 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
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
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="!appearance-none !w-full flex justify-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </div>
        <div className="flex items-center justify-end text-sm !text-gray-600 mt-4 space-x-1">
           <Link to="/forgot-password" className="!text-blue-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline">
             Quên mật khẩu
           </Link>
           <Link to="/register" className="!text-gray-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline">
             Đăng ký tại đây
           </Link>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;