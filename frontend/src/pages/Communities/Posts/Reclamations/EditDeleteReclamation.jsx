import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axiosInstance from '../../../../interceptors/axios';

export default function EditDeleteReclamation() {
  const { slug, profile_slug, reclamation_slug } = useParams();
  const [title, setTitle] = useState("");
  const [reclamation, setReclamation] = useState("");
  const [userId, setUserId] = useState('');
  const [communityId, setCommunityId] = useState('');
  const navigate = useNavigate();

  const fetchUserDataAndVerifyPermission = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const userResponse = await axiosInstance.get('/api/v1/account', {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error('Erro ao buscar dados do usuário ou verificar permissão:', error);
      navigate('/404');
    }
  };

  const fetchCommunityData = async () => {
    try {
      const communityResponse = await axiosInstance.get(`/api/v1/communities/${slug}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      const communityId = communityResponse.data.id;
      setCommunityId(communityId);

      fetchReclamation();
    } catch (error) {
      console.error('Erro ao buscar dados da comunidade:', error);
      navigate('/404');
    }
  };

  const fetchReclamation = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`);
      setTitle(response.data.title);
      setReclamation(response.data.content);

      document.title = `UniverCity | Editar '${response.data.title}'`;
    } catch (error) {
      console.error("Erro ao carregar reclamação:", error);
    }
  };

  const handleUpdateReclamation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.put(`/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`, {
        title,
        content: reclamation,
        user: userId,
        community: communityId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        navigate(`/comunidades/${slug}/`);
      } else {
        alert("Erro ao atualizar a reclamação");
      }
    } catch (error) {
      console.error("Erro ao atualizar reclamação:", error);
    }
  };

  const handleDeleteReclamation = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
        navigate(`/comunidades/${slug}/`);
      } else {
        alert("Erro ao excluir a reclamação");
      }
    } catch (error) {
      console.error("Erro ao excluir reclamação:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      fetchUserDataAndVerifyPermission();
    } else {
      navigate('/login');
    }
  }, [slug, reclamation_slug, navigate]);

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <h3>Editar Reclamação</h3>
          <Form onSubmit={handleUpdateReclamation}>
            <Form.Group controlId="reclamationTitle" className="mb-3">
              <Form.Label>Título da Reclamação</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o novo título da reclamação"
              />
            </Form.Group>

            <Form.Group controlId="reclamationContent" className="mb-3">
              <Form.Label>Conteúdo da Reclamação</Form.Label>
              <div className="container" data-color-mode="light">
                <MDEditor
                  value={reclamation}
                  onChange={setReclamation}
                />
                <MDEditor.Markdown source={reclamation} style={{ whiteSpace: 'pre-wrap' }} />
              </div>
            </Form.Group>

            <div className="text-center">
              <Button variant="dark" type="submit">
                Atualizar Reclamação
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <Button variant="danger" onClick={handleDeleteReclamation}>
              Excluir Reclamação
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
