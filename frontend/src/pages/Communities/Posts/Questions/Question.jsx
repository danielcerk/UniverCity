import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axiosInstance from '../../../../interceptors/axios'; // Importe a instância personalizada

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
  const navigate = useNavigate();

  const getUserData = async (token) => {
    try {
      const response = await axiosInstance.get('/api/v1/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }); // Usando axiosInstance
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

  const toggleLikeDislike = (type) => {
    setQuestion((prev) => ({
      ...prev,
      like: type === "like" ? !prev.like : false,
      dislike: type === "dislike" ? !prev.dislike : false,
    }));
  };

  const toggleResponseLikeDislike = (index, type) => {
    setResponses((prev) =>
      prev.map((response, i) =>
        i === index
          ? {
              ...response,
              like: type === "like" ? !response.like : response.like,
              dislike: type === "dislike" ? !response.dislike : response.dislike,
            }
          : response
      )
    );
  };

  // Envia uma nova resposta para a API
  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (newResponse.trim() !== "") {
      try {
        const response = await axiosInstance.post(`/api/v1/communities/${slug}/questions/${question_slug}/responses/`, {
          user: user.id,
          text: newResponse,
          content_type: 17,
          object_id: question.id,
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

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <Card className="mb-4">
            {question ? (
              <>
                <Card.Header>{`Pergunta: ${question.title}`}</Card.Header>
                <Card.Body>
                  <p>{question.content}</p>
                  <p>
                    <strong>Postado por:</strong> <Link to={`/perfil/${question.author_slug}`}>@{question.author}</Link> em {question.created_at}
                  </p>
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
                    <p>{response.text}</p>
                    {user.name === response.author && ( // Verifica se o usuário logado é o autor
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteResponse(response.id)}
                        >
                          Deletar
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
              <Button variant="dark" type="submit" disabled={newResponse.trim() === ""}>
                Enviar Resposta
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
