// import React, { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { MessageSquare, User, Mail, Eye, EyeOff,Lock } from "lucide-react";
// import { Link } from "react-router-dom";
// const SignUpPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });
//   const { isSigningUp, signup } = useAuthStore();

//   const validateForm = () => {};

//   const handleSubmit = () => {
//     e.preventDefault();
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* {leftSide} */}
//       <div className="flex flex-col justify-center items-center p-6 sm:p-12">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center mb-8">
//             <div className="flex flex-col items-center gap-2 group">
//               <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
//                 <MessageSquare className="size-6 text-primary" />
//               </div>
//               <h1 className="text-2xl font-bold mt-2">Create Account</h1>
//               <p className="text-base-content/60">
//                 Get Started with your free Account
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">FullName</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type="name"
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="Vivek Verma"
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullName: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Email</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type="email"
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="xyz@gmail.com"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-medium">Password</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="size-5 text-base-content/40" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className={`input input-bordered w-full pl-10`}
//                   placeholder="********"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                 />
//                 <button
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="size-5 text-base-content/40" />
//                   ) : (
//                     <Eye className="size-5 text-base-content/40" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
//                 {isSigningUp? (
//                     <>
//                     <Loader2 className="size-5 animate-spin"/>
//                     Loading...
//                     </>
//                 ):("Create Account")}
//             </button>
//           </form>
//           <div className="text-center">
//             <p className="text-base-content/60">Already have an account:{" "}
//             <Link to="/login" className="link link-primary">
//             Sign In
//             </Link>
//             </p>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;

import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import  toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",
    email:"",
    password:""
  });
  const { isSigningUp ,signUp} = useAuthStore();

  // Array to store input field configurations
  const fields = [
    {
      id: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Vivek Verma",
      icon: <User className="size-5 text-base-content/40" />,
    },
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

  const handleInputChange = (id, value) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateForm = () => {
     if(!formData.fullName.trim()) return toast.error("Full name is required");
     if(!formData.email.trim()) return toast.error("Email is required");
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return toast.error("Invalid email format");
      }
    if(!formData.password) return toast.error("Password is required");
    if(formData.password.length<6) return toast.error("Password length must be at least 6");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success=validateForm()
    if(success===true){
        signUp(formData)
        console.log("This is the success value" +success)
    }
     // Replace this with your signup logic
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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get Started with your free Account
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
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <span className="animate-spin size-5">...</span> Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* {RightSide} */}
      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones"
      />
    </div>
  );
};

export default SignUpPage;
