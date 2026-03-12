import React from 'react';
// Import Header và Footer vào. 
// Chú ý: Hãy sửa lại đường dẫn '../components/Header' cho khớp với thư mục bạn đang lưu Header và Footer nhé!
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="!w-full !min-h-screen !bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Phần nội dung của từng trang (ví dụ LoginPage) sẽ được chèn vào chỗ children này */}
      <main className="flex-grow flex w-full">
        {children}
      </main>

      <Footer />
      
      {/* Global CSS để ẩn thanh cuộn của navigation */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default MainLayout;