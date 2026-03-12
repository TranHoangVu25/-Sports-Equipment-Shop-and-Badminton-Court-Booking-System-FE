import {
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold !text-gray-800 uppercase tracking-wide">Đăng nhập</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div>
          <input
            id="email-phone"
            name="email-phone"
            type="text"
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
            className="!appearance-none !w-full flex justify-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Đăng nhập
          </button>
        </div>
        
        <div className="flex items-center justify-end text-sm !text-gray-600 mt-4 space-x-1">
           {/* Đã sử dụng Link của react-router-dom */}
           <Link 
             to="/forgot-password" 
             className="!text-blue-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline"
           >
             Quên mật khẩu
           </Link>
           <Link 
             to="/register" 
             className="!text-gray-600 hover:!text-[#eb5322] hover:!underline transition-colors !no-underline"
           >
             Đăng ký tại đây
           </Link>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;