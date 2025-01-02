import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from "../../../interceptors/axios";

import Sidebar from '../../../layout/Sidebar/Sidebar';
import spinner from '../../../assets/loading.svg';

import styles from '../../../assets/loading.module.css';

export default function Community() {
  const [university, setUniversity] = useState({
    id: "",
    name: "",
    small_description: "",
    site: "",
    located_in: "",
    founded_at: "",
    members: 0,
    is_verified: false,
    city: "",
    state: "",
  });
  const [questions, setQuestions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const navigate = useNavigate();

  const getUniversityData = async () => {
    try {
      const [universityRes, questionsRes, complaintsRes] = await Promise.all([
        axiosInstance.get(`/api/v1/communities/${slug}`),
        axiosInstance.get(`/api/v1/communities/${slug}/questions`),
        axiosInstance.get(`/api/v1/communities/${slug}/reclamations`),
      ]);

      setUniversity(universityRes.data);
      setQuestions(questionsRes.data.results);
      setComplaints(complaintsRes.data.results);
    } catch (error) {
      console.error("Erro ao buscar os dados da Universidade:", error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUniversityData();

    if (university.name) {
      document.title = `UniverCity | ${university.name}`;
    }
  }, [university.name]);

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9}>
          {loading ? (
            <div className={styles.loading_container}>
              <div className="text-center">
                <img src={spinner} alt="Carregando..." height="35" width="35" className="loading-svg" />
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h2>{university.name}</h2>
                <p className="text-muted">Universidade</p>
                <p>
                  <strong>Site:</strong>{' '}
                  <a href={university.site} className="link-dark" target="_blank" rel="noopener noreferrer">
                    {university.site}
                  </a>
                </p>
                <p><strong>Localização:</strong> {university.located_in}</p>
                <p><strong>Fundada em:</strong> {new Date(university.founded_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {university.is_verified ? "Verificada" : "Não Verificada"}</p>
                <div className="mb-4">
                  <strong>Sobre:</strong>
                  <p>{university.small_description}</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <Link to={`/comunidades/${university.slug}/reclamacao/criar`}>
                  <Button variant="outline-danger" className="me-2">Criar Reclamação</Button>
                </Link>
                <Link to={`/comunidades/${university.slug}/pergunta/criar`}>
                  <Button variant="outline-dark">Criar Pergunta</Button>
                </Link>
              </div>

              <Row>
                <Col xs={12} md={6} className="mb-4">
                  <Card>
                    <Card.Header>Perguntas</Card.Header>
                    <Card.Body>
                      {questions.length > 0 ? (
                        questions.map((question, index) => (
                          <Link to={`/comunidades/${university.slug}/pergunta/${question.slug}`} key={index}>
                            <div className="post">
                              <div className="post-header">
                                <h5 className="post-title">{question.title}</h5>
                                <p className="post-meta">Postado por <strong>{question.author}</strong> - {question.created_at}</p>
                              </div>
                              <p className="post-content">{question.content}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-muted">Nenhuma pergunta encontrada.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6} className="mb-4">
                  <Card>
                    <Card.Header>Reclamações</Card.Header>
                    <Card.Body>
                      {complaints.length > 0 ? (
                        complaints.map((complaint, index) => (
                          <Link to={`/comunidades/${university.slug}/reclamacao/${complaint.slug}`} key={index}>
                            <div className="post">
                              <div className="post-header">
                                <h5 className="post-title">{complaint.title}</h5>
                                <p className="post-meta">Postado por <strong>{complaint.author}</strong> - {complaint.created_at}</p>
                              </div>
                              <p className="post-content">{complaint.content}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-muted">Nenhuma reclamação encontrada.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
