import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      return navigate('/', { replace: true });
    }

    if (user.role === 'PRINCIPAL') {
      return navigate('/admin', { replace: true });
    }
  }, [user, children]);

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
