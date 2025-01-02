import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaHome, FaUserAlt, FaUsers } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';

import MDEditor from '@uiw/react-md-editor';

import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axios from 'axios'

export default function EditDeleteReclamation() {
  const { slug, profile_slug, reclamation_slug } = useParams();
  const [title, setTitle] = useState("");
  const [reclamation, setReclamation] = useState("");
  const [userId, setUserId] = useState('')
  const [communityId, setCommunityId] = useState('')

  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

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

      fetchReclamation();
    } catch (error) {
      console.error('Erro ao buscar dados da comunidade:', error);
      navigate('/404');
    }
  };

  // Função para buscar a reclamação da API
  const fetchReclamation = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`);
      const data = await response.json();
      setTitle(data.title);
      setReclamation(data.content);

      document.title = `UniverCity | Editar '${data.title}'`;

    } catch (error) {
      console.error("Erro ao carregar reclamação:", error);
    }
  };

  // Função para atualizar a reclamação via API
  const handleUpdateReclamation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: reclamation,
          user: userId,       // Incluindo o usuário
          community: communityId,  // Incluindo a comunidade
        }),
      });

      if (response.ok) {
        navigate(`/comunidades/${slug}/reclamacao/${reclamation_slug}/`);
      } else {
        alert("Erro ao atualizar a reclamação");
      }
    } catch (error) {
      console.error("Erro ao atualizar reclamação:", error);
    }
  };

  // Função para excluir a reclamação via API
  const handleDeleteReclamation = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/profile/${profile_slug}/reclamations/${reclamation_slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate(`/communidades/${slug}/`);
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
      setIsAuth(true);
      fetchUserDataAndVerifyPermission()

    } else {
      setIsAuth(false);
      navigate('/login');
    }
  }, [slug, reclamation_slug, navigate]);

  return (
    <Container className="mt-5">
      <Row>
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo Principal */}
        <Col xs={12} md={9} className="p-5">
          <h3>Editar Reclamação</h3>

          {/* Formulário para editar a reclamação */}
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
                  onChange={(e) => setReclamation(e)}
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

          {/* Botão para excluir a reclamação */}
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
