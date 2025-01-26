import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../interceptors/axios';

import Sidebar from '../../../layout/Sidebar/Sidebar';
import spinner from '../../../assets/loading.svg';

import styles from '../../../assets/loading.module.css';

import ReactMarkdown from 'react-markdown';

export default function Community() {
  const [university, setUniversity] = useState(null);
  const [user, setUser] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch university data
  const fetchUniversityData = async () => {
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
      console.error('Erro ao buscar os dados da Universidade:', error);
      navigate('/404');
    }
  };

  // Fetch user data and participation status
  const fetchUserData = async () => {
    try {
      const userRes = await axiosInstance.get('/api/v1/account', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setUser(userRes.data);

      // Verifica se o usuário já participa
      const participationRes = await axiosInstance.get(`/api/v1/communities/${slug}/members/${userRes.data.slug}/`);
      setIsParticipating(participationRes.data?.active || false);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário ou participação:', error);
    }
  };

  // Handle participation
  const handleParticipationToggle = async () => {
    try {
      const url = `/api/v1/communities/${slug}/members/${user?.slug}/`;
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      };

      if (isParticipating) {
        await axiosInstance.delete(url, config);
      } else {
        await axiosInstance.post(`/api/v1/communities/${slug}/members/`, {
          community: university.id,
          user: user.id,
          active: true,
        }, config);
      }

      setIsParticipating(!isParticipating);
    } catch (error) {
      console.error('Erro ao alternar participação na comunidade:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchUniversityData();
      await fetchUserData();
      setLoading(false);
    };
    init();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loading_container}>
        <div className="text-center">
          <img src={spinner} alt="Carregando..." height="35" width="35" className="loading-svg" />
        </div>
      </div>
    );
  }

  if (!university) return null;

  return (
    <Container className="card py-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9}>
          <div className="mb-4">
            <div className="d-flex gap-3 flex-md-row flex-column">
              <img
                className="card-img-community mb-3 rounded"
                src="https://cdn.pixabay.com/photo/2020/09/29/10/42/library-5612441_1280.jpg"
                alt="Universidade"
              />
              <div>
                <h2>{university.name}</h2>
                <p className="text-muted mt-2 mb-4">Universidade</p>
                <div>
                  <p className="d-flex align-items-baseline gap-2 m-0 p-0">
                    <span className="fw-semibold">Site:</span>
                    <a href={university.site} className="link-dark" target="_blank" rel="noopener noreferrer">
                      {university.site}
                    </a>
                  </p>
                  <p className="d-flex align-items-baseline gap-2 m-0 p-0">
                    <span className="fw-semibold">Localização:</span> {university.located_in}
                  </p>
                  <p className="d-flex align-items-baseline gap-2 m-0 p-0">
                    <span className="fw-semibold">Status:</span>
                    <span className={`badge ${university.is_verified ? 'bg-success' : 'bg-danger'}`}>
                      {university.is_verified ? 'Verificada' : 'Não Verificada'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <p className="d-flex align-items-baseline gap-2 m-0">
              <span className="fw-semibold">Fundada em:</span> {new Date(university.founded_at).toLocaleDateString()}
            </p>
            <div className="mb-4">
              <span className="fw-semibold">Sobre:</span>
              <p>{university.small_description}</p>
            </div>
            {user?.is_moderator && (
              <Link to={`/comunidades/${university.slug}/editar`}>
                <Button variant="warning" className="fw-semibold">Editar Universidade</Button>
              </Link>
            )}
          </div>

          <div className="mb-4 d-flex gap-3">
            {user && user.id ? ( <Button
              className={`fw-semibold p-3 btn-hover ${isParticipating ? 'bg-danger text-white' : 'bg-success text-white'}`}
              onClick={handleParticipationToggle}
            >
              {isParticipating ? 'Sair da Comunidade' : 'Participar da Comunidade'}
            </Button> ) : null }
            <Link to={`/comunidades/${university.slug}/pergunta/criar`}>
              <Button className="bg-primary text-white fw-semibold p-3 btn-hover">Perguntar</Button>
            </Link>
            <Link to={`/comunidades/${university.slug}/reclamacao/criar`}>
              <Button variant="outline-danger" className="bg-danger text-white fw-semibold p-3 btn-hover">Reclamar</Button>
            </Link>
          </div>

          <Row>
            <Col xs={12} md={6} className="mb-4">
              <Card>
                <Card.Header className="border-0">Perguntas</Card.Header>
                <Card.Body>
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <Link to={`/comunidades/${university.slug}/pergunta/${question.slug}`} key={question.id}>
                        <div className="post text-dark">
                          <h5 className="post-title">{question.title}</h5>
                          <p className="post-meta">Postado por <strong>{question.author}</strong> - {question.created_at}</p>
                          <p className="post-content">
                            <ReactMarkdown>{question.content}</ReactMarkdown>
                          </p>
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
                <Card.Header className="border-0">Reclamações</Card.Header>
                <Card.Body>
                  {complaints.length > 0 ? (
                    complaints.map((complaint) => (
                      <Link to={`/comunidades/${university.slug}/reclamacao/${complaint.slug}`} key={complaint.id}>
                        <div className="post text-dark">
                          <h5 className="post-title">{complaint.title}</h5>
                          <p className="post-meta">Postado por <strong>{complaint.author}</strong> - {complaint.created_at}</p>
                          <p className="post-content">
                            <ReactMarkdown>{complaint.content}</ReactMarkdown>
                          </p>
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
        </Col>
      </Row>
    </Container>
  );
}
