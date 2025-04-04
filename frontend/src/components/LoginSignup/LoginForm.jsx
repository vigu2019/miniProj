import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "react-toastify";
import { urls } from "@/utils/urls";
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/context/AuthContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setAuthUser  } = useAuthContext();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(urls.login, formData);
      localStorage.setItem("token", response.data.token, { expires: 1 });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAuthUser (response.data.user);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md"> {/* Add background and styling here */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}