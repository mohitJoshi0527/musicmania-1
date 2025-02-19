import { useState, useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import useUserStore from "../stores/useUserStore";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useUserStore();
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      await checkAuth();
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  if (user) return <Navigate to={user.role === "admin" ? "/admin/manage-songs" : "/"} replace />;

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-r from-red-700 via-black to-red-900 py-12 sm:px-6 lg:px-8">
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2 className="text-center text-3xl font-extrabold text-white">Login to your account</h2>
      </motion.div>

      <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-black bg-opacity-50 backdrop-blur-md shadow-lg p-8 rounded-lg border border-red-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" required placeholder="Email" className="w-full p-3 bg-gray-800 border border-red-500 text-white rounded-md focus:ring-red-400" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required placeholder="Password" className="w-full p-3 bg-gray-800 border border-red-500 text-white rounded-md focus:ring-red-400" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-red-700 hover:bg-red-900 text-white py-2 rounded-md">{loading ? "Loading..." : "Login"}</button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
