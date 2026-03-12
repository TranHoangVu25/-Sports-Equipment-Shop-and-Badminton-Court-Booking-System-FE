import React, { useState } from 'react'; // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY
import LoginForm from '../../../components/Auth/LoginForm';
import ForgotPasswordForm from '../../../components/Auth/ForgotPasswordForm';
import RegisterForm from '../../../components/Auth/RegisterForm';


const LoginPage = () => {
  // State quản lý hiển thị form: 'login' | 'forgot_password' | 'register'
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="min-h-[500px] flex items-center justify-center !bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      {currentView === 'login' && (
        <LoginForm 
          onForgotPasswordClick={() => setCurrentView('forgot_password')} 
          onRegisterClick={() => setCurrentView('register')}
        />
      )}
      
      {currentView === 'forgot_password' && (
        <ForgotPasswordForm onLoginClick={() => setCurrentView('login')} />
      )}

      {currentView === 'register' && (
        <RegisterForm onLoginClick={() => setCurrentView('login')} />
      )}
    </div>
  );
};


export default LoginPage; // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ LIÊN KẾT VỚI APP.JSX