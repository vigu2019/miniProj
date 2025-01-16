
import './App.css'
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import LoginPage from '../app/login/page'
import RegisterPage from './app/register/page';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";
function App() {
  // const authUser = useState(false)
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={ <RegisterPage />} />
      </Routes> 
      <ToastContainer/>
    </>
  )
}

export default App
