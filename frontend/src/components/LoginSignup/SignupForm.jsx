import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { urls } from "@/utils/urls";
import { toast } from 'react-toastify';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(urls.register, formData);
      console.log(response)
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      console.log(error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullname">Full Name</Label>
        <Input id="fullname" placeholder="Enter your full name" value={formData.fullname} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Choose a password" value={formData.password} onChange={handleChange} required />
      </div>
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
}