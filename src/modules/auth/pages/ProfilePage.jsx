import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ KHÔNG BỊ TRẮNG TRANG
import ProfileForm from '../../../components/Profile/ProfileForm';
import ProfileOverView from '../../../components/Profile/ProfileOverView';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentView = searchParams.get('view') || 'overview';

  const handleSetView = (newView) => {
    setSearchParams({ view: newView });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const localUser = localStorage.getItem('user');
          if (localUser) setUserData(JSON.parse(localUser));
          return; 
        }

        const response = await fetch('http://localhost:8086/api/v1/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();
        
        if (response.ok && data.code === 0) {
          setUserData(data.result);
          localStorage.setItem('user', JSON.stringify(data.result));
        }
      } catch (error) {
        console.error("Lỗi fetch profile:", error);
      }
    };

    fetchUserProfile();
  }, [currentView]); 

  return (
    <div className="w-full !bg-white min-h-screen">
      {currentView === 'overview' ? (
        <ProfileOverView 
          userData={userData} 
          onEdit={() => handleSetView('edit')} 
        />
      ) : (
        <ProfileForm 
          onBack={() => handleSetView('overview')} 
        />
      )}
    </div>
  );
};

export default ProfilePage;