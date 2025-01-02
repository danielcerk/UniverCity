import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function Question() {
  const { slug, question_slug } = useParams();
  const [question, setQuestion] = useState({
    title: "",
    content: "",
    like: "",
    dislike: "",
    author: "",
    author_slug: "",
    created_at: "",
  });

  const [newResponse, setNewResponse] = useState("");
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();

  // Função para buscar a pergunta da API
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/questions/${question_slug}`);
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Erro ao carregar pergunta:", error);
      navigate('/404');
    }
  };

  // Função para buscar as respostas da API
  const fetchResponses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/communities/${slug}/questions/${question_slug}/responses/`);
      const data = await response.json();
      setResponses(data.results)

    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };

  // Carrega a pergunta e as respostas assim que o componente for montado
  useEffect(() => {
    fetchQuestion();
    fetchResponses();
  }, [slug, question_slug]);

  // Atualizando o título após o estado da pergunta ser carregado
  useEffect(() => {
    if (question.title) {
      document.title = `UniverCity | ${question.title}`;
    }
  }, [question.title]);

  // Envia uma nova resposta
  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (newResponse.trim() !== "") {
      setResponses([
        ...responses,
        {
          user: "Você",
          content: newResponse,
          timestamp: "Agora",
        },
      ]);
      setNewResponse("");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />

        {/* Conteúdo Principal */}
        <Col xs={12} md={9} className="p-5">
          {/* Pergunta */}
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

          {/* Seção de Respostas */}
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

          {/* Espaço para nova resposta */}
          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="responseInput" className="mb-3" data-color-mode="light">
              <Form.Label>Escreva sua resposta</Form.Label>
              <MDEditor
                value={newResponse}
                onChange={setNewResponse}
                preview="edit"
                components={{
                  toolbar: (command, disabled, executeCommand) => {
                    if (command.keyCommand === 'code') {
                      return (
                        <button
                          aria-label="Insert code"
                          disabled={disabled}
                          onClick={(evn) => {
                            evn.stopPropagation();
                            executeCommand(command, command.groupName);
                          }}
                        >
                          Code
                        </button>
                      );
                    }
                  },
                }}
              />
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
