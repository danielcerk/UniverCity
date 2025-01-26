import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../interceptors/axios';

import Sidebar from '../../layout/Sidebar/Sidebar';

import ReactMarkdown from 'react-markdown'

import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();

  const navigate = useNavigate()

  const fetchUserData = async () => {
    try {
      const userRes = await axiosInstance.get('/api/v1/account', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      navigate('/login')
    }
  };

  useEffect(() => {
    document.title = 'UniverCity | Feed';
    fetchUserData();

    const fetchFeedData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/feed/${user?.id}`);
        setFeedData(response.data);
      } catch (error) {
        console.error("Erro ao buscar o feed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchFeedData();
    }

  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Main content layout */}
      <Container style={{ minHeight: "400px" }}>
        <Row>
          {/* Sidebar */}
          <Sidebar />

          <Col className="d-flex justify-content-center align-items-start">
            <div>

              {/* Displaying Reclamation Communities */}
              {feedData?.reclamations_communities && Object.keys(feedData.reclamations_communities).map((communityId) => (
                feedData.reclamations_communities[communityId].map((post) => (
                  <Row key={post.id}>
                    <Col xs={12} className="mb-4">
                      <Card className="shadow-sm">
                        <Card.Body>
                          <Card.Title className="fw-semibold">{post.user.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{new Date(post.created_at).toLocaleString()}</Card.Subtitle>
                          <Card.Text>
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                          </Card.Text>

                          {/* Verificando se o slug existe antes de gerar o link */}
                          <Link 
                            to={`/comunidades/${post.community.slug}/reclamacao/${post.slug}`} 
                            className="btn btn-link"
                          >
                            Ver mais
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                ))
              ))}

              {/* Displaying Question Communities */}
              {feedData?.question_communities && Object.keys(feedData.question_communities).map((communityId) => (
                feedData.question_communities[communityId].map((post) => (
                  <Row key={post.id}>
                    <Col xs={12} className="mb-4">
                      <Card className="shadow-sm">
                        <Card.Body>
                          <Card.Title className="fw-semibold">{post.user.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{new Date(post.created_at).toLocaleString()}</Card.Subtitle>
                          <Card.Text>
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                          </Card.Text>

                          {/* Verificando se o slug existe antes de gerar o link */}
                          <Link 
                            to={`/comunidades/${post.community.slug}/pergunta/${post.slug}`} 
                            className="btn btn-link"
                          >
                            Ver mais
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                ))
              ))}

              {/* If no posts */}
              {(!feedData?.reclamations_communities || !feedData?.question_communities) && (
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
                  <div className="mt-4">
                    <img
                      src="https://i.pinimg.com/236x/c1/2a/a0/c12aa07cf8efcb94429189373864ae59.jpg"
                      alt="Ilustração representativa"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Right Sidebar - Suggestions or Topics */}
          <Col xs={12} md={3} className="p-3">
            <Card className="card-novidades">
              <Card.Body className="p-2 rounded text-center">
                <img className="rounded" src="https://i.pinimg.com/236x/ef/15/ff/ef15ff08946d8c4688edf4b4c34934b3.jpg" alt="" style={{ maxWidth: "100px" }} />
                <p className="mt-3 fw-semibold">Você sabia? Temos novas funcionalidades chegando na plataforma!</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
