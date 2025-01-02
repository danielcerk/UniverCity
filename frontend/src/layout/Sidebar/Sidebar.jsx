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
                    <div className="d-flex flex-column">
                        <Link
                            to="/feed"
                            className="text-left d-flex align-items-center text-decoration-none text-dark mb-2"
                        >
                            <FaHome className="me-2" /> Home
                        </Link>
                        <Link
                            to="/conta"
                            className="text-left d-flex align-items-center text-decoration-none text-dark mb-2"
                        >
                            <FaUserAlt className="me-2" /> Conta
                        </Link>
                        <Link
                            to="/comunidades"
                            className="text-left d-flex align-items-center text-decoration-none text-dark"
                        >
                            <FaUsers className="me-2" /> Universidades
                        </Link>
                    </div>
                </Col>
            ) : null}  {/* Não renderiza nada quando isAuth é false */}
        </>
    );
}
