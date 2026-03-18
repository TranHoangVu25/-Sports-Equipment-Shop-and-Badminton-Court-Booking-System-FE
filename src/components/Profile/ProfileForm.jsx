import { AlertCircle, CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProfileForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    id: '', 
    email: '',
    fullName: '',
    phone: '',
    address: '',
    gender: '',
    day: '',
    month: '',
    year: ''
  });

  const [pwdData, setPwdData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [pwdErrors, setPwdErrors] = useState({});

  const [isLoadingFetch, setIsLoadingFetch] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingPwd, setIsLoadingPwd] = useState(false);
  
  // Trạng thái cho Toast Notification góc phải trên
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000); // Ẩn sau 4 giây
  };

  // 1. LẤY THÔNG TIN
  useEffect(() => {
    const fetchProfileToFill = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:8086/api/v1/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (response.ok && data.code === 0) {
          const user = data.result;
          
          let d = '', m = '', y = '';
          if (user.dob) {
            let parts = [];
            if (user.dob.includes('/')) {
              parts = user.dob.split('/');
              if (parts.length === 3) {
                d = parseInt(parts[0], 10).toString();
                m = parseInt(parts[1], 10).toString();
                y = parseInt(parts[2], 10).toString();
              }
            } else if (user.dob.includes('-')) {
              parts = user.dob.split('-');
              if (parts.length === 3) {
                if (parts[0].length === 4) {
                  y = parseInt(parts[0], 10).toString();
                  m = parseInt(parts[1], 10).toString();
                  d = parseInt(parts[2], 10).toString();
                } else {
                  d = parseInt(parts[0], 10).toString();
                  m = parseInt(parts[1], 10).toString();
                  y = parseInt(parts[2], 10).toString();
                }
              }
            }
          }

          let genderFormatted = '';
          if (user.gender) {
            const g = user.gender.trim().toLowerCase();
            if (g === 'nam' || g === 'male') genderFormatted = 'Nam';
            else if (g === 'nữ' || g === 'nu' || g === 'female') genderFormatted = 'Nữ';
            else genderFormatted = 'Khác';
          }

          setFormData({
            id: user.id || '',
            email: user.email || '',
            fullName: user.fullName || '',
            phone: user.phoneNumber || '',
            address: user.location || '',
            gender: genderFormatted,
            day: d,
            month: m,
            year: y
          });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin form:", error);
      } finally {
        setIsLoadingFetch(false);
      }
    };

    fetchProfileToFill();
  }, []);

  // Validation Form Profile
  const validateProfileForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Họ tên không được để trống.";
    } else if (formData.fullName.length > 30) {
      errors.fullName = "Họ tên không được vượt quá 30 ký tự.";
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng số hợp lệ).";
    }

    if (formData.address && formData.address.length > 60) {
      errors.address = "Địa chỉ không được vượt quá 60 ký tự.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 2. CẬP NHẬT THÔNG TIN
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      showToast('error', 'Vui lòng kiểm tra lại các trường thông tin không hợp lệ.');
      return;
    }

    let dobString = null;
    if (formData.day && formData.month && formData.year) {
      const formattedDay = formData.day.toString().padStart(2, '0');
      const formattedMonth = formData.month.toString().padStart(2, '0');
      dobString = `${formattedDay}/${formattedMonth}/${formData.year}`;
    }

    setIsLoadingUpdate(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8086/api/v1/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          dob: dobString,
          phoneNumber: formData.phone,
          location: formData.address,
          gender: formData.gender
        })
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        showToast('success', 'Cập nhật thông tin tài khoản thành công!');
        localStorage.setItem('user', JSON.stringify(data.result));
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        showToast('error', data.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    } catch (error) {
      console.error('Lỗi gọi API cập nhật profile:', error);
      showToast('error', 'Không thể kết nối tới máy chủ.');
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  // Validation Form Đổi mật khẩu
  const validatePasswordForm = () => {
    const errors = {};
    if (!pwdData.oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại.";
    if (!pwdData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (pwdData.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      errors.confirmPassword = "Nhập lại mật khẩu không khớp.";
    }

    setPwdErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 3. ĐỔI MẬT KHẨU
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      showToast('error', 'Vui lòng kiểm tra lại thông tin mật khẩu.');
      return;
    }

    setIsLoadingPwd(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8086/api/v1/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: pwdData.oldPassword,
          newPassword: pwdData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
        showToast('success', 'Đổi mật khẩu thành công!');
        setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPwdErrors({});
      } else {
        showToast('error', data.message || 'Mật khẩu cũ không chính xác hoặc lỗi hệ thống.');
      }
    } catch (error) {
      console.error('Lỗi gọi API change-password:', error);
      showToast('error', 'Không thể kết nối tới máy chủ.');
    } finally {
      setIsLoadingPwd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-24 right-5 z-[9999] flex items-center p-4 mb-4 text-sm rounded-lg shadow-xl transition-all duration-500 transform ${toast.type === 'success' ? 'text-green-800 border-l-4 border-green-500 bg-green-50' : 'text-red-800 border-l-4 border-red-500 bg-red-50'}`} role="alert">
          {toast.type === 'success' ? <CheckCircle2 className="flex-shrink-0 inline w-5 h-5 mr-3" /> : <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />}
          <div className="font-medium mr-4">
            {toast.message}
          </div>
          <button onClick={() => setToast({show: false})} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 transition-colors ${toast.type === 'success' ? 'bg-green-50 hover:bg-green-200 focus:ring-green-400' : 'bg-red-50 hover:bg-red-200 focus:ring-red-400'}`}>
             <X size={16} className={toast.type === 'success' ? "text-green-800" : "text-red-800"}/>
          </button>
        </div>
      )}

      <h1 className="text-base font-normal uppercase !text-gray-600 mb-6 tracking-wide">TRANG THÔNG TIN TÀI KHOẢN</h1>
      
      <button 
        onClick={onBack}
        className="mb-8 px-8 py-2 !bg-[#eb5322] !text-white text-sm font-bold rounded-sm uppercase border-none cursor-pointer hover:!bg-[#d04316] transition-colors"
      >
        QUAY LẠI
      </button>

      {isLoadingFetch ? (
        <div className="flex justify-center items-center py-20">
           <Loader2 className="animate-spin !text-[#eb5322]" size={32} />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* CẬP NHẬT THÔNG TIN */}
          <section>
            <h2 className="text-xl font-bold !text-gray-800 mb-6">Thông tin tài khoản</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-bold !text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm bg-gray-50 !text-gray-500 cursor-not-allowed outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-bold !text-gray-700 mb-2">Họ tên *</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${formErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                  placeholder="Nhập họ tên" 
                  maxLength={35}
                />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1.5">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold !text-gray-700 mb-2">Số điện thoại *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                  placeholder="Nhập số điện thoại" 
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1.5">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold !text-gray-700 mb-2">Địa chỉ</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${formErrors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                  placeholder="Nhập địa chỉ chi tiết (VD: Cổ Nhuế, Hoàng Quốc Việt)" 
                  maxLength={65}
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1.5">{formErrors.address}</p>}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-10">
                <label className="text-sm font-bold !text-gray-800 w-24">Giới tính:</label>
                <div className="flex-1 relative">
                  <select 
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer font-sans"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-10">
                <label className="text-sm font-bold !text-gray-800 w-24">Ngày sinh:</label>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="relative">
                    <select 
                      value={formData.day || ''}
                      onChange={(e) => setFormData({...formData, day: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer font-sans"
                    >
                      <option value="">Ngày</option>
                      {Array.from({length: 31}, (_, i) => {
                        const val = (i + 1).toString();
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select 
                      value={formData.month || ''}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer font-sans"
                    >
                      <option value="">Tháng</option>
                      {Array.from({length: 12}, (_, i) => {
                        const val = (i + 1).toString();
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select 
                      value={formData.year || ''}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm appearance-none outline-none focus:border-[#eb5322] cursor-pointer font-sans"
                    >
                      <option value="">Năm</option>
                      {Array.from({length: 100}, (_, i) => {
                        const yearStr = (new Date().getFullYear() - i).toString();
                        return <option key={yearStr} value={yearStr}>{yearStr}</option>;
                      })}
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoadingUpdate}
                className="w-full flex justify-center items-center py-3 !bg-[#eb5322] hover:!bg-[#d04316] !text-white font-bold rounded-sm uppercase mt-4 cursor-pointer border-none disabled:opacity-70 transition-colors"
              >
                {isLoadingUpdate ? <><Loader2 size={18} className="animate-spin mr-2"/> Đang cập nhật...</> : 'CẬP NHẬT'}
              </button>
            </form>
          </section>

          {/* ĐỔI MẬT KHẨU */}
          <section className="pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold !text-gray-800 mb-6">Đổi mật khẩu</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <input 
                  type="password" 
                  value={pwdData.oldPassword}
                  onChange={(e) => setPwdData({...pwdData, oldPassword: e.target.value})}
                  placeholder="Mật khẩu hiện tại (*)" 
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${pwdErrors.oldPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                />
                {pwdErrors.oldPassword && <p className="text-red-500 text-xs mt-1.5">{pwdErrors.oldPassword}</p>}
              </div>
              
              <div>
                <input 
                  type="password" 
                  value={pwdData.newPassword}
                  onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                  placeholder="Mật khẩu mới (*)" 
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${pwdErrors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                />
                {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1.5">{pwdErrors.newPassword}</p>}
              </div>

              <div>
                <input 
                  type="password" 
                  value={pwdData.confirmPassword}
                  onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới (*)" 
                  className={`w-full px-4 py-2.5 border rounded-sm outline-none font-sans transition-colors ${pwdErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#eb5322]'}`} 
                />
                {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{pwdErrors.confirmPassword}</p>}
              </div>

              <button 
                type="submit"
                disabled={isLoadingPwd} 
                className="w-full flex justify-center items-center py-3 !bg-[#eb5322] hover:!bg-[#d04316] !text-white font-bold rounded-sm uppercase cursor-pointer border-none disabled:opacity-70 transition-colors"
              >
                {isLoadingPwd ? <><Loader2 size={18} className="animate-spin mr-2"/> Đang xử lý...</> : 'ĐỔI MẬT KHẨU'}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;