import { Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import useUserStore from '../stores/useUserStore';
import logo from '../assets/logoweb.jpg'; // Ensure the correct path

const Navbar = () => {
  const { user } = useAuthStore();
  const { logout } = useUserStore();

  return (
    <nav className="bg-gradient-to-r from-red-600 via-black to-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <Link to="/" className="text-2xl font-bold text-white">
              Music App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/manage-songs"
                    className="text-white hover:bg-red-700 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-white hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:bg-red-700 px-3 py-2 rounded-md"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
