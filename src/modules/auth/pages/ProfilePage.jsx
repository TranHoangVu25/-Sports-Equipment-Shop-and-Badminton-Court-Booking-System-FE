
import { useEffect, useState } from 'react';
import ProfileForm from '../../../components/Profile/ProfileForm';
import ProfileOverView from '../../../components/Profile/ProfileOverView';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('overview'); // 'overview' hoặc 'edit'

  useEffect(() => {
    // Cuộn lên đầu trang khi thay đổi view
    window.scrollTo(0, 0);
    
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        console.error("Lỗi parse user data", e);
      }
    }
  }, [view]);

  return (
    <div className="w-full !bg-white min-h-screen">
      {view === 'overview' ? (
        <ProfileOverView 
          userData={userData} 
          onEdit={() => setView('edit')} 
        />
      ) : (
        <ProfileForm 
          userData={userData} 
          onBack={() => setView('overview')} 
        />
      )}
    </div>
  );
};

export default ProfilePage;