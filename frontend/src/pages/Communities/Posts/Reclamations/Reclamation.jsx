import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axios from 'axios';

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
  const [reclamations, setReclamations] = useState([]);
  const [responses, setResponses] = useState([]); // Para armazenar as respostas
  const [newReclamation, setNewReclamation] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Função para buscar os dados do usuário
  const getUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/account', {
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
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/reclamations/${reclamation_slug}`);
      const data = await response.json();
      setReclamation(data);
      console.log(data)
    } catch (error) {
      console.error("Erro ao carregar reclamação:", error);
      navigate('/404');
    }
  };

  // Função para buscar as respostas da reclamação
  const fetchResponses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/`);
      const data = await response.json();
      setResponses(data.results); // Armazenar as respostas
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
    if (newReclamation.trim() !== "") {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Token de autenticação
          },
          body: JSON.stringify({
            user: user.id,
            text: newReclamation,
            content_type: 9,
            object_id: reclamation.id,
          }),
        });
        
        // Verificar resposta da API
        if (response.ok) {
          const data = await response.json();
          setResponses([...responses, data]);
          setNewReclamation(""); // Limpa o campo após enviar a resposta
        } else {
          const errorData = await response.json();
          console.error("Erro ao enviar a resposta:", errorData);
        }
      } catch (error) {
        console.error("Erro ao enviar a resposta:", error);
      }
    }
  };
  
  const handleDeleteResponse = async (responseId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/communities/${slug}/reclamations/${reclamation_slug}/responses/${responseId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
      if (response.ok) {
        setResponses(responses.filter((res) => res.id !== responseId));
      } else {
        const errorData = await response.json();
        console.error('Erro ao deletar a resposta:', errorData);
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
            {reclamation ? (
              <>
                <Card.Header>{`Reclamação: ${reclamation.title}`}</Card.Header>
                <Card.Body>
                  <p>{reclamation.content}</p>
                  <p>
                    <strong>Postado por:</strong>{' '}
                    <Link to={`/perfil/${reclamation.author_slug}`}>@{reclamation.author}</Link>{' '}
                    em {reclamation.created_at}
                  </p>
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
              <p>Ainda não há respostas para esta reclamação.</p>
            )}

          </div>

          <Form onSubmit={handleReclamationSubmit}>
            <Form.Group controlId="reclamationInput" data-color-mode="light" className="mb-3">
              <Form.Label>Escreva sua reclamação</Form.Label>
              <MDEditor
                value={newReclamation}
                onChange={handleReclamationChange}
                preview="edit"
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="danger" type="submit" disabled={newReclamation.trim() === ""}>
                Enviar Reclamação
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
