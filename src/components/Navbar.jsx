import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { searchSweets } from "../services/api";

const Navbar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  const toggleSearch = () => {
    setShowMobileSearch((prev) => !prev);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userLoggedIn", handleAuthChange);
    window.addEventListener("userLoggedOut", handleAuthChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleAuthChange);
      window.removeEventListener("userLoggedOut", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576 && showMobileSearch) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMobileSearch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchSweets(searchTerm);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/login");
  };

  useLayoutEffect(() => {
    const findNav = () =>
      navRef.current ||
      document.querySelector("nav.navbar") ||
      document.querySelector(".navbar") ||
      document.querySelector(".custom-navbar");
    const navbarEl = findNav();
    if (!navbarEl) return;

    const setVar = () => {
      const h =
        navbarEl.offsetHeight ||
        Math.round(navbarEl.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };

    setVar();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(setVar);
      });
      try {
        ro.observe(navbarEl);
      } catch (e) {}
    } else {
      window.addEventListener("resize", setVar);
    }

    const mo = new MutationObserver(() => requestAnimationFrame(setVar));
    mo.observe(navbarEl, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("orientationchange", setVar);

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", setVar);
      mo.disconnect();
      window.removeEventListener("orientationchange", setVar);
    };
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="navbar fixed-top shadow-sm custom-navbar px-3 py-2"
      >
        <div className="navbar-container">
          {/* Logo click uses navigate */}
          <a
            href="/"
            className="navbar-logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img src={logo} alt="Bombay Sweet Shop" />
          </a>

          <div className="navbar-search position-relative">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search for sweets"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowSuggestions(true)}
              />
              <button className="btn btn-light" type="button">
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "#002244" }}
                ></i>
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((sweet) => (
                  <div
                    key={sweet._id}
                    className="suggestion-item"
                    onClick={(e) => e.preventDefault()} // Do nothing on click
                  >
                    <img
                      src={
                        sweet.imageUrls && sweet.imageUrls.length > 0
                          ? sweet.imageUrls[0]
                          : "https://via.placeholder.com/40"
                      }
                      alt={sweet.name}
                    />
                    <div>
                      <div className="sweet-name">{sweet.name}</div>
                      <div className="sweet-price">₹{sweet.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="navbar-account-large">
            <Dropdown align="end">
              <Dropdown.Toggle
                as="span"
                style={{ cursor: "pointer", color: "#fff", fontSize: "22px" }}
              >
                <i className="fa-solid fa-user"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {user ? (
                  <>
                    <Dropdown.Item disabled>
                      Hello, {user.username}
                    </Dropdown.Item>
                    {user.role === "admin" && (
                      <Dropdown.Item onClick={() => navigate("/store")}>
                        Store
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => navigate("/login")}>
                      Login
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/register")}>
                      Register
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="navbar-icons-small">
            <button
              onClick={toggleSearch}
              className="btn btn-light search-icon-btn"
              aria-label="Toggle search"
            >
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ fontSize: "20px", color: "#ffffffff" }}
              ></i>
            </button>
            <Dropdown align="end">
              <Dropdown.Toggle
                as="span"
                style={{
                  cursor: "pointer",
                  color: "#ffffffff",
                  fontSize: "22px",
                }}
              >
                <i className="fa-solid fa-user"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user ? (
                  <>
                    <Dropdown.Item disabled>
                      Hello, {user.username}
                    </Dropdown.Item>
                    {user.role === "admin" && (
                      <Dropdown.Item onClick={() => navigate("/store")}>
                        Store
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => navigate("/login")}>
                      Login
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/register")}>
                      Register
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {showMobileSearch && (
          <form
            className="mobile-search-form"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search for sweets"
                aria-label="Search"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-light" type="submit" aria-label="Search">
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "#002244" }}
                ></i>
              </button>
            </div>
          </form>
        )}
      </nav>

      <style jsx>{`
        :root {
          --header-height: 120px;
        }
        .navbar {
          z-index: 1030;
        }
        .custom-navbar {
          background-color: #192b54;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .navbar-logo img {
          height: 80px;
          object-fit: contain;
          min-width: 120px;
        }
        .navbar-search {
          flex-grow: 1;
          max-width: 700px;
          margin: 0 20px;
        }
        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-top: 5px;
          z-index: 1050;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          cursor: default; /* not clickable */
        }
        .suggestion-item img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 10px;
        }
        .sweet-name {
          font-size: 14px;
          font-weight: 500;
          color: #192b54;
        }
        .sweet-price {
          font-size: 13px;
          color: #ff9800;
          font-weight: 600;
        }
        .navbar-account-large {
          display: flex;
          justify-content: flex-end;
        }
        .navbar-icons-small {
          display: none;
          align-items: center;
          gap: 10px;
        }
        .search-icon-btn {
          border: none;
          background: none;
          padding: 5px;
          cursor: pointer;
        }
        .mobile-search-form {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 0;
        }

        @media (max-width: 992px) {
          .navbar-search {
            max-width: 100%;
            margin: 0 10px;
          }
        }
        @media (max-width: 576px) {
          .navbar-container {
            padding: 0 10px;
          }
          .navbar-logo {
            min-width: 80px;
          }
          .navbar-search {
            display: none;
          }
          .navbar-account-large {
            display: none;
          }
          .navbar-icons-small {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
