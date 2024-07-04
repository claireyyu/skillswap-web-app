import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Preview from "./Preview";
import "../style/home.css"; 

const Home = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="home">
      <nav className="home-nav">
        <h1>SkillSwap</h1>
        <div className="hamburger" onClick={handleNavToggle}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className={`nav-list ${isNavOpen ? "show" : ""}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#preview">Preview</a></li>
          {!isAuthenticated ? (
            <>
              <li><button className="btn-primary" onClick={loginWithRedirect}>Login</button></li>
              <li><button className="btn-secondary" onClick={signUp}>Sign Up</button></li>
            </>
          ) : (
            <>
              <li><button className="btn-primary" onClick={() => navigate("/app/learn")}>Explore</button></li>
              <li><button className="btn-secondary" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>

      <div id="home" className="home-section">
        <div className="home-item">
          <h2>Swap Your<br /><span>Skill</span><br />Today!</h2>
        </div>
        <img className="home-item" src="home.png" alt="Home" />
      </div>

      <div id="about" className="about-section">
        <div className="nav-placeholder"></div>
        <h2>About SkillSwap</h2>
        <p>
          SkillSwap is a platform that connects people from all over the world to
          exchange their skills. It is a great way to learn new skills and make new friends.<br /><br />
          Browse through active users' profiles and book your next skill exchange session today! 
          Remember to add your own profile to the list so others can find you too!
        </p>
      </div>

      <div id="preview" className="preview-section">
        <h2>Find Skills</h2>
        <Preview />
      </div>

      <footer>
        <p>Copyright &copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
