import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import  toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword,setShowPassword]=useState(false);
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
    const fields = [
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "xyz@gmail.com",
          icon: <Mail className="size-5 text-base-content/40" />,
        },
        {
          id: "password",
          label: "Password",
          type: showPassword ? "text" : "password",
          placeholder: "********",
          icon: <Lock className="size-5 text-base-content/40" />,
          toggle: true,
        },
      ];
    const {login,isLogginIn}=useAuthStore();
    const handleSubmit=(e)=>{
        e.preventDefault();
        login(formData);

    }
    const handleInputChange = (id, value) => {
        setFormData((prevData) => ({ ...prevData, [id]: value }));
      };
    


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">
                SignIn to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {fields.map(({ id, label, type, placeholder, icon, toggle }) => (
              <div key={id} className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{label}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                  </div>
                  <input
                    type={type}
                    className={`input input-bordered w-full pl-10`}
                    placeholder={placeholder}
                    value={formData[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                  />
                  {toggle && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLogginIn}
            >
              {isLogginIn ? (
                <>
                  <span className="animate-spin size-5">...</span> Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* {RightSide} */}
      <AuthImagePattern
        title="Welcome Back"
        subtitle="SignIn to your account to continue your conversation with the loved ones"
      />
    </div>
  )
}

export default LoginPage