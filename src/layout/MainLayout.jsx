// Import Header và Footer vào. 
// Chú ý: Hãy sửa lại đường dẫn '../components/Header' cho khớp với thư mục bạn đang lưu Header và Footer nhé!
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';


const MainLayout = ({ children }) => {
  return (
    <div className="!w-full !min-h-screen !bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex w-full">
        {children}
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
export default MainLayout;