import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ApplicationLayout = ({ children }) => {
  return <Navigation>{children ? children : <Outlet />}</Navigation>;
};

export default ApplicationLayout;
