import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './context/AuthContext';
import UserDashboard from './pages/Dashboards/UserDashboard';
import Login from './pages/AuthPage';
function App() {
  const {authUser} = useAuthContext();
  // console.log("authUser:", authUser);
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={authUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
      
      <ToastContainer />
    </>
  )
}

export default App
