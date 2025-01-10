import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaUserAlt, FaUsers } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Sidebar() {

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
    
        if (token) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    return (
        <> {/* Envolvendo o conteúdo com um div */}
            {isAuth ? (
                <Col xs={12} md={3} className="p-3">
    
                <div id="nav-bar" className="bg-dark" style={{marginTop:'100px'}}>
                <input type="checkbox" id="nav-toggle" ></input>
                <div id="nav-header">
                    <a id="nav-title" target="_blank">
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
                 
                </div>

                </div>

                </Col>

                
            ) : null}  {/* Não renderiza nada quando isAuth é false */}

            
        </>
    );
}
