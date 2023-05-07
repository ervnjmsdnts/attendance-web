import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationLayout from './layouts/ApplicationLayout';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import DailyReport from './pages/DailyReport';
import Teachers from './pages/Teachers';
import Students from './pages/Students';

function App() {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Routes>
      <Route element={<ApplicationLayout />}>
        <Route path="admin" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<Admin />} />
          <Route path="daily-report" element={<DailyReport />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Route>
      <Route path="/" element={<ProtectedRoute user={user} />}>
        <Route path="" element={<Auth />} />
      </Route>
    </Routes>
  );
}

export default App;
