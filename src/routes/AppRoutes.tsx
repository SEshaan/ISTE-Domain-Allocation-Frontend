import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Profile from '../pages/user/Profile';
import Dashboard from '../pages/user/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import AdminQuestions from '../pages/admin/Questions';
import AdminTasks from '../pages/admin';
import RequireAuth from '../auth/RequireAuth';
import RequireRole from '../auth/RequireRole';
import Question from '../pages/user/tasks/Question';
import EditDomains from '../pages/user/DomainSelection';
import QuestionsTasks from '../pages/user/tasks';
import Tasks from '../pages/user/tasks/Tasks';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/adminLogin" element={<Login />} />
        
        {/* Protected User Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/domains" element={<EditDomains />} />
          <Route path="/questionsandtasks" element={<QuestionsTasks />} />
          <Route path="/question" element={<Question />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="ADMIN"/>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
