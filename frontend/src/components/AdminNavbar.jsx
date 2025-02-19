import { NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const AdminNavbar = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    // Hide navbar on home route or if not admin
    if (!user || user.role !== 'admin' || location.pathname === '/') return null;

    return (
        <nav className="bg-gradient-to-r from-red-700 via-black to-red-900 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex space-x-6">
                <NavLink 
                    to="/admin/dashboard" 
                    className={({ isActive }) => 
                        `text-white hover:text-red-300 ${isActive ? 'border-b-2 border-red-400' : ''}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink 
                    to="/admin/create-song" 
                    className={({ isActive }) => 
                        `text-white hover:text-red-300 ${isActive ? 'border-b-2 border-red-400' : ''}`
                    }
                >
                    Create Song
                </NavLink>
                <NavLink 
                    to="/admin/manage-songs" 
                    className={({ isActive }) => 
                        `text-white hover:text-red-300 ${isActive ? 'border-b-2 border-red-400' : ''}`
                    }
                >
                    Manage Songs
                </NavLink>
            </div>
        </nav>
    );
};

export default AdminNavbar;
