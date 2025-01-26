import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../../interceptors/axios';

import ReactMarkdown from 'react-markdown';

export default function Question() {
  const { slug, question_slug } = useParams();
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState({
    id: "",
    title: "",
    like: false,
    dislike: false,
    author: "",
    author_slug: "",
    created_at: "",
  });

  const [newResponse, setNewResponse] = useState("");
  const [responses, setResponses] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportTarget, setReportTarget] = useState(null); // Para definir se a denúncia é para resposta ou pergunta
  const navigate = useNavigate();

  const getUserData = async (token) => {
    try {
      const response = await axiosInstance.get('/api/v1/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao conseguir os dados do usuário', error);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/questions/${question_slug}`);
      setQuestion(response.data);
    } catch (error) {
      console.error("Erro ao carregar pergunta:", error);
      navigate('/404');
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/questions/${question_slug}/responses/`);
      setResponses(response.data.results);
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };

  useEffect(() => {
    getUserData(localStorage.getItem('access_token'));
    fetchQuestion();
    fetchResponses();
  }, [slug, question_slug]);

  useEffect(() => {
    if (question.title) {
      document.title = `UniverCity | ${question.title}`;
    }
  }, [question.title]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    if (newResponse.trim() !== "") {

      try {
        const response = await axiosInstance.post(`/api/v1/communities/${slug}/questions/${question_slug}/responses/`, {
          user: user.id,
          text: newResponse,
          content_type: 7,
          object_id: question.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        setResponses([...responses, response.data]);
        setNewResponse(""); // Limpa o campo após enviar a resposta
      } catch (error) {
        console.error("Erro ao enviar a resposta:", error);
      }
    }
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/communities/${slug}/questions/${question_slug}/responses/${responseId}/`
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

      if (response.status === 204) {
        setResponses(responses.filter((res) => res.id !== responseId));
      } else {
        console.error('Erro ao deletar a resposta:', response.data);
      }
    } catch (error) {
      console.error('Erro ao deletar a resposta:', error);
    }
  };

  const handleReportSubmit = async (e, type, objectId) => {
    e.preventDefault();
  
    if (!reportDescription.trim()) {
      return; // Não faz nada se a descrição estiver vazia
    }
    

    if (!objectId) {
      console.error("Erro: objectId está indefinido ou nulo.");
      return;
    }
  
    try {
      
      const res = await axiosInstance.post(`/api/v1/reports/`, {
        user: user.id,
        content_type: parseInt(type),
        object_id: parseInt(objectId),
        description: reportDescription,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      setShowReportModal(false); // Fecha o modal
      setReportDescription(""); // Limpa o campo
    } catch (error) {
      console.log(error.response.data)
      console.error("Erro ao enviar a denúncia:", error);
    }
  };


  const openReportModal = (target) => {
    setReportTarget(target);
    setShowReportModal(true);
  };

  return (
    <Container className="">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-2 py-5 p-md-5 card">
          <Card className="mb-4">
            {question ? (
              <>
                <Card.Header>{`Pergunta: ${question.title}`}</Card.Header>
                <Card.Body>
                  <p><ReactMarkdown>{question.content}</ReactMarkdown></p>
                  <p>
                    <strong>Postado por:</strong> <Link to={`/perfil/${question.author_slug}`}>@{question.author}</Link> em {question.created_at}
                  </p>
                  {user && user.id && user.name === question.author && (
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => navigate(`/comunidades/${slug}/${user.slug}/pergunta/${question.slug}/editar`)}>
                      Editar Reclamação
                    </Button>
                  )}
                  {user && (
                      <Button
                        variant="warning"
                        className="mt-3"
                        onClick={() =>
                          openReportModal({ content_type: 7, object_id: question.id })
                        }
                      >
                      Denunciar pergunta
                    </Button>
                  )}
                </Card.Body>
              </>
            ) : (
              <Card.Body>Carregando pergunta...</Card.Body>
            )}
          </Card>

          <div className="mb-4">
            <h5>Respostas</h5>
            {responses.length > 0 ? (
              responses.map((response, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <strong><Link to={`/perfil/${response.author_slug}`}>@{response.author}</Link> escreveu:</strong>
                      <small>{response.created_at}</small>
                    </div>      
                    <p><ReactMarkdown>{response.text}</ReactMarkdown></p>
                    {user && user.id && user.name === response.author && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteResponse(response.id)}>
                        Deletar
                      </Button>
                    )}
                    {user && (
                        <Button
                          variant="warning"
                          className="mt-3"
                          onClick={() =>
                            openReportModal({ content_type: 14, object_id: response.id })
                          }
                        >
                        Denunciar resposta
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Ainda não há respostas para esta pergunta.</p>
            )}
          </div>

          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="responseInput" className="mb-3" data-color-mode="light">
              <Form.Label>Escreva sua resposta</Form.Label>
              <MDEditor value={newResponse} onChange={setNewResponse} preview="edit" />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" className='btn-hover fw-bold p-3' type="submit" disabled={newResponse.trim() === ""}>
                Enviar Resposta
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Denunciar Conteúdo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleReportSubmit(e, reportTarget.content_type, reportTarget.object_id)}>
            <Form.Group>
              <Form.Label>Descrição da denúncia:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Enviar Denúncia
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
}
