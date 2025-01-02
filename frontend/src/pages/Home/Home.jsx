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
      <Container className="mt-5">
        <Row>
          {/* Sidebar */}
          <Sidebar />

          {/* Feed content */}
          <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
            <div className="text-center p-4 border rounded">
              <h3>Explore sua Universidade</h3>
              <p>
                <Link to="/comunidades/">aqui</Link>. Estamos trabalhando para que seu conteúdo apareça aqui.
              </p>
            </div>
          </Col>

          {/* Right Sidebar - Suggestions or Topics */}
          <Col xs={12} md={3} className="p-3">
            <Card className="mt-4">
              <Card.Header>
                <h5>Novidades</h5>
              </Card.Header>
              <Card.Body>
                <p>Você sabia? Temos novas funcionalidades chegando na plataforma!</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
