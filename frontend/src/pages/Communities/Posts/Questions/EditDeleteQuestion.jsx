import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axiosInstance from '../../../../interceptors/axios';

export default function EditDeleteQuestion() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [userId, setUserId] = useState(null);
  const [communityId, setCommunityId] = useState(null);

  const navigate = useNavigate();
  const { slug, profile_slug, question_slug } = useParams();

  const fetchUserDataAndVerifyPermission = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const userResponse = await axiosInstance.get('/api/v1/account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const userSlug = userResponse.data.slug;
      const userId = userResponse.data.id;
      setUserId(userId);

      if (userSlug !== profile_slug) {
        navigate('/404');
        return;
      }

      fetchCommunityData();
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      navigate('/404');
    }
  };

  const fetchCommunityData = async () => {
    try {
      const communityResponse = await axiosInstance.get(`/api/v1/communities/${slug}/`);
      const communityId = communityResponse.data.id;
      setCommunityId(communityId);

      fetchQuestion();
    } catch (error) {
      console.error('Erro ao buscar dados da comunidade:', error);
      navigate('/404');
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`
      );

      setTitle(response.data.title || "");
      setQuestion(response.data.content || "");
    } catch (error) {
      console.error("Erro ao buscar a pergunta:", error);
      navigate('/404');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { title, content: question, user: userId, community: communityId };

      await axiosInstance.put(
        `/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`,
        payload
      );

      navigate(`/api/v1/comunidades/${slug}/`);
    } catch (error) {
      console.error("Erro ao atualizar a pergunta:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`
      );

      navigate(`/api/v1/comunidades/${slug}`);
    } catch (error) {
      console.error("Erro ao excluir a pergunta:", error);
    }
  };

  useEffect(() => {
    fetchUserDataAndVerifyPermission();
  }, []);

  useEffect(() => {
    if (title) {
      document.title = `UniverCity | Editar a pergunta '${title}'`;
    }
  }, [title]);

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <h3>Editar Pergunta</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="questionTitle" className="mb-3">
              <Form.Label>Título da Pergunta</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o novo título da pergunta"
              />
            </Form.Group>

            <Form.Group controlId="questionContent" className="mb-3">
              <Form.Label>Conteúdo da Pergunta</Form.Label>
              <div className="container" data-color-mode="light">
                <MDEditor
                  value={question}
                  onChange={setQuestion}
                />
              </div>
            </Form.Group>

            <div className="text-center">
              <Button variant="dark" type="submit">
                Atualizar Pergunta
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <Button variant="danger" onClick={handleDelete}>
              Excluir Pergunta
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
