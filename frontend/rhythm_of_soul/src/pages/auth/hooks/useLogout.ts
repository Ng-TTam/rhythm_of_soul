import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/api/authService';

const useLogout = () => {
  const navigate = useNavigate();

  const hanldelogout = async () => {
    try {
      await logout();

      sessionStorage.removeItem('accessToken');

      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return hanldelogout;
};

export default useLogout;
