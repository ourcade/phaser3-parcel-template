import React from "react";

const NavBar = () => {
  const toggleNav = () => {
    let toggle = document.getElementById("navBar");
    if (toggle.className === "nav-bar") {
      toggle.className += " responsive";
    } else {
      toggle.className = "nav-bar";
    }
  };

  return (
    <div className="nav-bar-container">
      <div className="nav-bar" id="navBar">
        <a href="/">
          <img
            className="nav-bar-logo"
            src="https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.png"
            alt="Bowst Logo"
          />
        </a>
        <a href="/#">
          <li>Play the Game</li>
        </a>
        <a href="/#">
          <li>Meet the Team</li>
        </a>
        <a href="/#">
          <li>Contact Us</li>
        </a>
        <a href="/#" className="nav-bar-icon" onClick={toggleNav}>
          <i aria-hidden="true" className="fas fa-bars" />
        </a>
      </div>
    </div>
  );
};

export default NavBar;
