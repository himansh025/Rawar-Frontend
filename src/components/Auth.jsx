import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch as well

export const requireAuth = (Component) => {
  const user  = useSelector((state) => state.auth.user);
  const location = useLocation();

  return  user ? (
<Component/>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};