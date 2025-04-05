    import { useState } from "react"
    import { Button } from "@/components/ui/button"
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
    import { User } from "lucide-react"
    import React from "react"
    import { urls } from "@/utils/urls";
    import axios from "axios"
    import { toast } from "react-toastify"
    import { useNavigate } from "react-router-dom"
    import { useAuthContext } from '../../context/AuthContext'
    export function Navbar() {
    const {authUser,setAuthUser} = useAuthContext();
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordDetails, setPasswordDetails] = useState({
        oldPassword: "",
        newPassword: "",
    }) 
    const [userDetails, setUserDetails] = useState({
        email: authUser.email,
    })
    const handleEdit = (e) => {
        e.preventDefault()
        setIsEditing(true)
        setIsChangingPassword(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if(authUser.email === userDetails.email){
            setIsEditing(false)
            toast.warning("No changes made")
            return
        }
        try {
            const token = localStorage.getItem("token")
            const response = await axios.put(urls.updateProfile, userDetails, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            toast.success(response.data.message)
            setIsEditing(false)
            setAuthUser({...authUser,email:userDetails.email})
        } catch (error) {
            toast.error(error.response?.data?.error || error.message)
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value })
    }

    const handleChangePasswordClick = (event) => {
        event.preventDefault(); // Prevent dropdown from closing
        setIsChangingPassword(true);
        setIsEditing(false);
    };


    const handleChangePasswordSubmit = async (e)  =>{
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(urls.updatePassword, passwordDetails, {
                headers: {
                    "auth-token": token
                }
            }
            )
            toast.success(response.data.message);
            setPasswordDetails({
                oldPassword: "",
                newPassword: ""
            });
            setIsChangingPassword(false);
        }
        catch (error) {
            toast.error(error.response?.data?.error || error.message);
            console.log(error);
        }
    }
    const handleLogout = async (e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem("token");
            // console.log(token)
            if (!token) {
                toast.error("You are not logged in");
                navigate("/login")
                return;
            }
            const response = await axios.get(urls.logout, {
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.status !== 200) {
                toast.error("Logout failed");
                return;
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuthUser(null);
            toast.success(response.data.message);
            navigate("/")
        }
        catch (error) {
            toast.error(error.response?.data?.error || error.message);
            console.log(error);
        }
    }
    return (
        
        <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-black-600">CampusEase</div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                <span>{authUser.username}</span>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>
                    <User />
                    </AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                {!isChangingPassword && (
                    <div className="space-y-2">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                        id="username"
                        name="username"
                        value={authUser.username}
                        disabled={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                        id="fullName"
                        name="fullName"
                        value={authUser.fullname}
                        disabled={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        name="email"
                        value={authUser.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        />
                    </div>
                    {isEditing ? (
                    <>
                        <Button className="mt-2 w-full" onClick={handleSave}>
                        Save
                        </Button>
                        <Button className="mt-2 w-full" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </>
                    ) : (
                        <Button className="mt-2 w-full" onClick={handleEdit}>
                        Edit Profile
                        </Button>
                    )}
                    </div>
                )}
                {isChangingPassword && (
                    <div className="space-y-2">
                    <div>
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <Input
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        value={passwordDetails.oldPassword}
                        onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordDetails.newPassword}
                        onChange={handlePasswordChange}
                        />
                    </div>
                    <Button className="mt-2 w-full" onClick={handleChangePasswordSubmit}>
                        Change Password
                    </Button>
                    <Button className="mt-2 w-full" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                    </div>
                )}
                </div>
                <DropdownMenuSeparator />
                {isChangingPassword && <DropdownMenuItem onSelect={handleEdit}>Edit Profile</DropdownMenuItem>}
                {!isChangingPassword && <DropdownMenuItem onSelect={handleChangePasswordClick}>Change Password</DropdownMenuItem>}
                <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
        </nav>
  )
}

