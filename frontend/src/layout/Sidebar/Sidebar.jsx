import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaUserAlt, FaUsers, FaUniversity } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useState, useEffect } from "react";

import axiosInstance from "../../interceptors/axios";

export default function Sidebar() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null); // Estado inicial definido como null

  const getUserID = async (token) => {
    try {
      const response = await axiosInstance.get("/api/v1/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao obter dados do usuário", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuth(true);
      getUserID(token);
    } else {
      setIsAuth(false);
    }
  }, []);

  return (
    <>
      {isAuth ? (
        <Col xs={12} md={3} className="p-3">
          <div id="nav-bar" className="bg-dark" style={{ marginTop: "100px" }}>
            <input type="checkbox" id="nav-toggle"></input>
            <div id="nav-header">
              <a id="nav-title" target="_blank" rel="noreferrer">
                Explore
              </a>

              <label htmlFor="nav-toggle">
                <span id="" className="fa-solid fa-ellipsis"></span>
              </label>
              <hr></hr>
            </div>
            <div id="nav-content">
              <div className="nav-button">
                <Link
                  to="/feed"
                  className="text-left d-flex align-items-center text-decoration-none text-white mb-2 nav-button"
                >
                  <FaHome className="me-2" /> <span>Home</span>
                </Link>
              </div>
              <div className="nav-button">
                <Link
                  to="/conta"
                  className="text-left d-flex align-items-center text-decoration-none text-white mb-2 nav-button"
                >
                  <FaUserAlt className="me-2" /> <span>Conta</span>
                </Link>
              </div>
              <div className="nav-button">
                <Link
                  to="/comunidades"
                  className="text-left d-flex align-items-center text-decoration-none text-white nav-button"
                >
                  <FaUsers className="me-2" /> <span>Universidades</span>
                </Link>
              </div>

              {user?.is_moderator && (
                <>
                    <div className="nav-button">
                    <Link
                        to="/moderacao/dashboard/"
                        className="text-left d-flex align-items-center text-decoration-none text-white nav-button"
                    >
                        <MdDashboard className="me-2" /> <span>Dashboard</span>
                    </Link>
                    </div>
                    <div className="nav-button">
                        <Link
                        to="/comunidades/criar"
                        className="text-left d-flex align-items-center text-decoration-none text-white nav-button"
                        >
                        <FaUniversity className="me-2" /> <span>Criar comunidade</span>
                        </Link>
                    </div>
                </>
              )}
            </div>
          </div>
        </Col>
      ) : null}
    </>
  );
}
