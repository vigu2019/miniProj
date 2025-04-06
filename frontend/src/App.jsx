import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/AuthPage';
import  NotFound  from './pages/NotFound';
import PrintStaffDashboard from './pages/PrintStaffDashboard';
import StorekeeperDashboard from './pages/StorekeeperDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
function App() {
  const {authUser} = useAuthContext();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={authUser ? authUser.role ==="user" ? <Navigate to="/user-dashboard" /> : authUser.role === "print"? <Navigate to="/print-dashboard" /> : <Navigate to="/store-dashboard" /> : <Navigate to="/login" />} />
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/print-dashboard" element={<PrintStaffDashboard/>}/>
        <Route path="/store-dashboard" element={<StorekeeperDashboard/>}/>
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
