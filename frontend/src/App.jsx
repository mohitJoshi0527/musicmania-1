import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminNavbar from "./components/AdminNavbar";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignupPage";
import AdminRoute from "./components/AdminRoute";
import CreateSongForm from "./components/CreateSongForm";
import SongList from "./components/SongList";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";
import HomePage from "./Pages/HomePage";

function App() {
  const { checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-800 to-black text-white relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Render Admin Navbar if the user is an admin */}
      {user?.role === "admin" && <AdminNavbar />}

      <div className="relative z-50 pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/admin" element={<AdminRoute />}>
            <Route path="create-song" element={<CreateSongForm />} />
            <Route path="manage-songs" element={<SongList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
