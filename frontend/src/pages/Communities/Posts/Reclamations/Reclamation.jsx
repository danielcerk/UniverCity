import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';

export default function Reclamation() {
  const { slug, reclamation_slug } = useParams();
  const [reclamation, setReclamation] = useState({
    title: "",
    content: "",
    author: "",
    author_slug: "",
    created_at: "",
  });
  const [reclamations, setReclamations] = useState([]);
  const [responses, setResponses] = useState([]); // Para armazenar as respostas
  const [newReclamation, setNewReclamation] = useState("");
  const navigate = useNavigate();

  // Função para buscar a reclamação da API
  const fetchReclamation = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/reclamations/${reclamation_slug}`);
      const data = await response.json();
      setReclamation(data);
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

  const handleReclamationSubmit = (e) => {
    e.preventDefault();
    if (newReclamation.trim() !== "") {
      setReclamations([
        ...reclamations,
        {
          user: "Você",
          content: newReclamation,
          timestamp: "Agora"
        }
      ]);
      setNewReclamation("");
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
                      <strong><Link to={`/perfil/${response.author_slug}`}>@{response.author}</Link> escreveu:</strong>
                      <small>{response.created_at}</small>
                    </div>
                    <p>{response.text}</p>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>Ainda não há respostas para esta pergunta.</p>
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
