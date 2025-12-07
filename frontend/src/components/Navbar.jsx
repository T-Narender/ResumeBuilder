import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutTemplate, LogOut } from "lucide-react";
import { ProfileInfoCard } from "../components/Cards";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { cardStyles } from "../assets/dummystyle";

const Navbar = () => {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (clearUser) {
      clearUser();
      toast.success("Logged out successfully");
      navigate("/", { replace: true }); // Navigate to landing page
    } else {
      // Fallback logout if clearUser is not available
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 h-full">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl">
            <LayoutTemplate className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            ResumeCraft
          </span>
        </Link>

        {/* Profile Info Card (right side) */}
        <div className="flex items-center h-full">
          <ProfileInfoCard />
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className={cardStyles.profileCard}>
                      <div className={cardStyles.profileInitialsContainer}>
                        <span className={cardStyles.profileInitialsText}>
                          {user.name ? user.name.charAt(0).toUpperCase() : ""}
                        </span>
                      </div>
                      <div className={cardStyles.profileName}>
                        {user.name || ""}
                      </div>
                      <button className={cardStyles.logoutButton} onClick={handleLogout}>Logout</button>
                    </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
