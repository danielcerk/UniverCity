import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

import Sidebar from '../../../../layout/Sidebar/Sidebar';

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

      // Buscar dados completos do usuário (ID e slug)
      const userResponse = await axios.get('http://127.0.0.1:8000/api/v1/account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userSlug = userResponse.data.slug;
      const userId = userResponse.data.id;  // Captura o ID do usuário
      setUserId(userId);

      // Verificar permissão
      if (userSlug !== profile_slug) {
        navigate('/404');
        return;
      }

      // Buscar dados da comunidade (ID)
      fetchCommunityData();
    } catch (error) {
      console.error('Erro ao buscar dados do usuário ou verificar permissão:', error);
      navigate('/404');
    }
  };

  const fetchCommunityData = async () => {
    try {
      // Buscar dados completos da comunidade (ID)
      const communityResponse = await axios.get(`http://127.0.0.1:8000/api/v1/communities/${slug}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      const communityId = communityResponse.data.id;  // Captura o ID da comunidade
      setCommunityId(communityId);

      // Buscar dados da pergunta
      fetchQuestion();
    } catch (error) {
      console.error('Erro ao buscar dados da comunidade:', error);
      navigate('/404');
    }
  };

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`,
        config
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
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        title,
        content: question,
        user: userId,      // Enviando o ID do usuário
        community: communityId,  // Enviando o ID da comunidade
      };

      await axios.put(
        `http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`,
        payload,
        config
      );

      navigate(`/comunidades/${slug}`);
    } catch (error) {
      console.error("Erro ao atualizar a pergunta:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(
        `http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/questions/${question_slug}/`,
        config
      );

      navigate(`/comunidades/${slug}`);
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
