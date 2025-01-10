import React, { useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Sidebar from '../../layout/Sidebar/Sidebar';

export default function Home() {
  useEffect(() => {
    document.title = 'UniverCity | Feed';
  }, []);

  return (
    <div>
      {/* Main content layout */}
      <Container className="mt-5" style={{minHeight:"400px"}}>
        <Row>
          {/* Sidebar */}
          <Sidebar />

          {/* Feed content */}
          <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
          <div className="text-center p-5 bg-light rounded shadow-sm">
              <h2 className="fw-bold mb-4 text-dark">Explore sua Universidade</h2>
              <p className="mb-4 text-muted">
                <Link
                  to="/comunidades/"
                  className="btn btn-danger d-inline-flex align-items-center px-4 py-2 animated-link"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square me-2"></i> Conferir
                </Link>
              </p>
              <p className="text-dark">
                Estamos trabalhando para que seu conteúdo apareça aqui.
              </p>
              <div className="mt-4">
                
                <img
                  src="https://i.pinimg.com/236x/c1/2a/a0/c12aa07cf8efcb94429189373864ae59.jpg"
                  alt="Ilustração representativa"
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>

             
            </div>

          </Col>

          {/* Right Sidebar - Suggestions or Topics */}
    

          <Col xs={12} md={3} className="p-3">
            <Card className=" card-novidades">
              <Card.Body className="p-2 rounded text-center">
                <img className="rounded" src="https://i.pinimg.com/236x/ef/15/ff/ef15ff08946d8c4688edf4b4c34934b3.jpg"alt="" style={{maxWidth:"100px"}}/> 
                <p className="mt-3 fw-semibold">Você sabia? Temos novas funcionalidades chegando na plataforma!</p>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
}
