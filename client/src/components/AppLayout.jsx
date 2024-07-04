import "../style/appLayout.css";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth0();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <h1 className="logo">SkillSwap</h1>
        </Link>
        <div className="hamburger" onClick={handleNavToggle}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className={`nav-list ${isNavOpen ? "show" : ""}`}>
          <li className="learn-teach"><Link to="/app/learn">Learn</Link></li>
          <li className="learn-teach"><Link to="/app/teach">Teach</Link></li>
          {isAuthenticated && (
            <li className="profile-icon">
              <div className="profile-pic" onClick={handleProfileClick}>
                <img
                  src={user.picture || "/default-profile.jpg"}
                  alt="Profile"
                />
              </div>
              {isProfileMenuOpen && (
                <div className="profile-menu">
                  <Link to="/app/profile">User Profile</Link>
                  <Link to="/app/authdebugger">Auth Debugger</Link>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
