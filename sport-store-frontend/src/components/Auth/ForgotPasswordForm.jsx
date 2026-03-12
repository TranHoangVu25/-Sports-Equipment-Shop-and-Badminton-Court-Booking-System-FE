import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  User, 
  ShoppingCart, 
  ChevronDown, 
  Gamepad2, 
  ShoppingBag,
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';
const ForgotPasswordForm = ({ onLoginClick }) => {
  const [captchaCode, setCaptchaCode] = useState('');

  // Sinh mã captcha ngẫu nhiên 4 chữ số khi component được render
  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(randomCode);
  }, []);

  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold !text-[#eb5322] uppercase tracking-wide">Quên mật khẩu</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div>
          <input
            id="forgot-email"
            name="email"
            type="email"
            required
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Email"
          />
        </div>

        {/* Captcha Row */}
        <div className="flex items-center space-x-4">
          <input
            id="captcha"
            name="captcha"
            type="text"
            required
            className="!appearance-none block !w-full !flex-1 !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Mã captcha"
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
            className="!appearance-none !w-full flex justify-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Lấy lại mật khẩu
          </button>
        </div>
        
        <div className="flex items-center justify-end text-sm !text-gray-600 mt-4">
           <button 
             type="button" 
             onClick={onLoginClick} 
             className="!text-gray-600 hover:!text-[#eb5322] hover:!underline transition-colors !bg-transparent !border-none !p-0 cursor-pointer"
           >
             Đăng nhập tại đây
           </button>
        </div>
      </form>
    </div>
  );
};
export default ForgotPasswordForm;