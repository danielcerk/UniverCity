import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axiosInstance from '../../../../interceptors/axios';

import ReactMarkdown from 'react-markdown'

// reclamation 10

export default function Reclamation() {
  const { slug, reclamation_slug } = useParams();
  const [reclamation, setReclamation] = useState({
    id: "",
    title: "",
    content: "",
    author: "",
    author_slug: "",
    created_at: "",
  });
  const [responses, setResponses] = useState([]); // Para armazenar as respostas
  const [newReclamation, setNewReclamation] = useState("");
  const [user, setUser] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const navigate = useNavigate();

  // Função para buscar os dados do usuário
  const getUserData = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUser(response.data); // Atualiza o estado do usuário
    } catch (error) {
      console.error('Erro ao conseguir os dados do usuário', error);
    }
  };

  // Função para buscar a reclamação da API
  const fetchReclamation = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/reclamations/${reclamation_slug}`);
      setReclamation(response.data);
    } catch (error) {
      console.error("Erro ao carregar reclamação:", error);
      navigate('/404');
    }
  };

  // Função para buscar as respostas da reclamação
  const fetchResponses = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/`);
      setResponses(response.data.results); // Armazenar as respostas
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };

  useEffect(() => {
    getUserData(); // Busca os dados do usuário
    fetchReclamation();
    fetchResponses(); // Buscar respostas assim que a página carregar
  }, []); // A dependência vazia garante que a busca aconteça apenas uma vez

  useEffect(() => {
    if (reclamation.title) {
      document.title = `UniverCity | ${reclamation.title}`;
    }
  }, [reclamation.title]);

  const handleReclamationChange = (e) => {
    setNewReclamation(e);
  };

  const handleReclamationSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      navigate('/login'); 
      return;
    }

    if (newReclamation.trim() !== "") {
      try {
        const response = await axiosInstance.post(`/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/`, {
          user: user.id,
          text: newReclamation,
          content_type: 9,
          object_id: reclamation.id,
        });
        
        // Verificar resposta da API
        if (response.status === 201) {
          setResponses([...responses, response.data]);
          setNewReclamation(""); // Limpa o campo após enviar a resposta
        } else {
          console.error("Erro ao enviar a resposta:", response.data);
        }
      } catch (error) {
        console.error("Erro ao enviar a resposta:", error);
      }
    }
  };
  
  const handleDeleteResponse = async (responseId) => {

    try {
      const response = await axiosInstance.delete(
        `/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/${responseId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
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
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <Card className="mb-4">
            {reclamation ? (
              <>
                <Card.Header>{`Reclamação: ${reclamation.title}`}</Card.Header>
                <Card.Body>
                  <p><ReactMarkdown>{reclamation.content}</ReactMarkdown></p>
                  <p>
                    <strong>Postado por:</strong>{' '}
                    <Link to={`/perfil/${reclamation.author_slug}`}>@{reclamation.author}</Link>{' '}
                    em {reclamation.created_at}
                  </p>
                  {user && user.id && user.name === reclamation.author && (
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => navigate(`/comunidades/${slug}/${user.slug}/reclamacao/${reclamation.slug}/editar`)}
                    >
                      Editar Reclamação
                    </Button>
                  )}
                  {user && (
                      <Button
                        variant="warning"
                        className="mt-3"
                        onClick={() =>
                          openReportModal({ content_type: 10, object_id: reclamation.id })
                        }
                      >
                      Denunciar pergunta
                    </Button>
                  )}
                </Card.Body>
              </>
            ) : (
              <Card.Body>Carregando reclamação...</Card.Body>
            )}
          </Card>

          <div className="mb-4">
            <h5>Respostas</h5>
            {responses.length > 0 ? (
              responses.map((response, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>
                          <Link to={`/perfil/${response.author_slug}`}>
                            @{response.author}
                          </Link>
                        </strong>
                        {' '}escreveu:
                      </div>
                      <small>{response.created_at}</small>
                    </div>
                    <p><ReactMarkdown>{response.text}</ReactMarkdown></p>
                    {user && user.id && user.name === response.author && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteResponse(response.id)}
                      >
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
              <p>Ainda não há respostas para esta reclamação.</p>
            )}
          </div>

          <Form onSubmit={handleReclamationSubmit}>
            <Form.Group controlId="responseInput" className="mb-3" data-color-mode="light">
              <Form.Label>Escreva sua resposta</Form.Label>
              <MDEditor value={newReclamation} onChange={handleReclamationChange} preview="edit" />
            </Form.Group>
            <div className="text-center">
              <Button variant="dark" type="submit" disabled={newReclamation.trim() === ""}>
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
