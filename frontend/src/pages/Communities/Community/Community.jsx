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
    <Container className="card py-5">
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
              <div className="mb-4">
                <div className='d-flex gap-3 flex-md-row flex-column'>
                  <img className="card-img-community mb-3 rounded" src="https://i.pinimg.com/736x/53/5d/71/535d71f8060cdcf672173cc4944345b2.jpg" alt="" />
                  <div>
                    <h2>{university.name}</h2>
                    <p className="text-muted mt-2 mb-4">Universidade</p>
                    <div>
                      <p className='d-flex align-items-baseline gap-2 m-0 p-0'>
                        <p className='fw-semibold'>Site:</p>{' '}
                        <a href={university.site} className="link-dark" target="_blank" rel="noopener noreferrer">
                          {university.site}
                        </a>
                      </p>
                      <p className='d-flex align-items-baseline gap-2 m-0 p-0'><p className='fw-semibold'>Localização:</p> {university.located_in}</p>
                      <p className='d-flex align-items-baseline gap-2 m-0 p-0'><p className='fw-semibold'>Status:</p>
                        <span className={`badge ${university.is_verified ? 'bg-success' : 'bg-danger'}`}>
                            {university.is_verified ? 'Verificada' : 'Não Verificada'}
                        </span></p>
                    </div>
                  </div>
                </div>
                <p className='d-flex align-items-baseline gap-2 m-0'><p className='fw-semibold'>Fundada em:</p> {new Date(university.founded_at).toLocaleDateString()}</p>
              
                <div className="mb-4">
                  <p className='fw-semibold'>Sobre:</p>
                  <p>{university.small_description}</p>
                </div>
              </div>

              <div className="mb-4 d-flex gap-3">
                <Link to={`/comunidades/${university.slug}/pergunta/criar`}>
                  <Button className="bg-primary text-white fw-semibold p-3 btn-hover">Perguntar <i className="fa-regular fa-message"></i></Button>
                </Link>
                <Link to={`/comunidades/${university.slug}/reclamacao/criar`}>
                  <Button variant="outline-danger" className="me-2 bg-danger text-white fw-semibold p-3 btn-hover">Reclamar <i className="fa-solid fa-bullhorn"></i></Button>
                </Link>
              </div>

              <Row>
                <Col xs={12} md={6} className="mb-4">
                  <Card>
                    <Card.Header className='border-0'>Perguntas</Card.Header>
                    <Card.Body>
                      {questions.length > 0 ? (
                        questions.map((question, index) => (
                          <Link to={`/comunidades/${university.slug}/pergunta/${question.slug}`} key={index}>
                            <div className="post text-dark">
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

                <Col xs={12} md={6} className="mb-4 ">
                  <Card>
                    <Card.Header className='border-0'>Reclamações</Card.Header>
                    <Card.Body>
                      {complaints.length > 0 ? (
                        complaints.map((complaint, index) => (
                          <Link to={`/comunidades/${university.slug}/reclamacao/${complaint.slug}`} key={index}>
                            <div className="post text-dark">
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
