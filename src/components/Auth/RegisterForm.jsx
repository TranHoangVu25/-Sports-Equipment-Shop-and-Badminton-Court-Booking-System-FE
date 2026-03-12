import { Link } from 'react-router-dom';

const RegisterForm = () => {
  return (
    <div className="max-w-md w-full !bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold !text-[#eb5322] uppercase tracking-wide">Đăng ký</h2>
        <div className="mt-2 w-12 h-1 !bg-[#eb5322] mx-auto rounded-full"></div>
      </div>

      <div className="text-center mb-6 text-sm !text-gray-600">
        Đã có tài khoản, đăng nhập{' '}
        {/* Đã sử dụng Link của react-router-dom */}
        <Link 
          to="/login" 
          className="!text-[#eb5322] hover:!underline transition-colors !no-underline"
        >
          tại đây
        </Link>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <input
            id="register-name"
            name="name"
            type="text"
            required
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
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập email của bạn (*)"
          />
        </div>

        <div>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Số điện thoại"
          />
        </div>

        <div>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Mật khẩu"
          />
        </div>

        <div>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            required
            className="!appearance-none block !w-full !px-4 !py-3 !bg-white !text-gray-900 !border !border-gray-300 !rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[#eb5322] focus:border-[#eb5322] sm:text-sm transition-colors"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="!appearance-none !w-full flex justify-center !py-3 !px-4 !border !border-transparent !rounded-md shadow-sm text-sm font-medium !text-white !bg-[#eb5322] hover:!bg-[#d04316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eb5322] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};
export default RegisterForm;