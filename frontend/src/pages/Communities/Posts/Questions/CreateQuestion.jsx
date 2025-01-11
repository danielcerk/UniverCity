import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axiosInstance from '../../../../interceptors/axios'; // Importe a instância personalizada

export default function CreateQuestion() {
  const [title, setTitle] = useState("");  // Estado para o título da pergunta
  const [question, setQuestion] = useState("");  // Estado para o conteúdo da pergunta
  const [university, setUniversity] = useState({ id: "" }); // Estado para a universidade
  const [user, setUser] = useState(null); // Estado para o usuário autenticado
  const [isAuth, setIsAuth] = useState(false); // Verifica se o usuário está autenticado
  const { slug } = useParams(); // Obtém o slug da URL
  const navigate = useNavigate(); // Navegação após o envio

  // Função para lidar com a mudança no título
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Função para enviar a pergunta
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (title.trim() !== "" && question.trim() !== "") {
      // Prepara os dados a serem enviados
      const questionData = {
        title: title,
        content: question,
        community: university.id,  // A associação com a universidade usando o id
        user: user.id // Usa o ID do usuário autenticado
      };
      
      try {
        // Envia a requisição POST para criar a pergunta
        const response = await axiosInstance.post(
          `/api/v1/communities/${slug}/questions/`,
          questionData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Cabeçalho de autorização
            },
          }
        );

        console.log("Pergunta criada com sucesso:", response.data);

        // Redireciona para a página de perguntas ou limpa os campos
        //navigate(`/communities/${slug}/questions`);
        setTitle("");  // Limpar o campo título
        setQuestion("");  // Limpar o campo pergunta
      } catch (error) {
        console.error('Erro ao criar a pergunta:', error);
      }
    }
  };

  // Função para buscar os dados da universidade
  const getUniversityID = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}`);
      setUniversity(response.data); // Atualiza o estado da universidade
      console.log(response.data); // Verifique se a universidade está sendo recuperada corretamente
    } catch (error) {
      console.error('Erro ao conseguir ID da universidade', error);
    }
  };

  // Função para buscar os dados do usuário
  const getUserData = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUser(response.data); // Atualiza o estado do usuário
      console.log(response.data); // Verifique se os dados do usuário estão sendo recuperados corretamente
    } catch (error) {
      console.error('Erro ao conseguir os dados do usuário', error);
    }
  };

  useEffect(() => {
    document.title = 'UniverCity | Criar Nova Pergunta';

    const token = localStorage.getItem('access_token');
    
    if (token) {
      setIsAuth(true);
      getUniversityID(); // Busca os dados da universidade
      getUserData(); // Busca os dados do usuário
    } else {
      setIsAuth(false);
      navigate('/login'); // Redireciona para a página de login se não estiver autenticado
    }
  }, [slug, navigate]);

  return (
    <Container className="">
      <Row>
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo Principal */}
        <Col xs={12} md={9} className="p-2 py-5 p-md-5 card">
          <h3 className='text-center text-md-start'>Criar Nova Pergunta</h3>
          <br />

          {/* Formulário para criar uma pergunta */}
          <Form onSubmit={handleQuestionSubmit}>
            <Form.Group controlId="questionTitle" className="mb-3">
              <Form.Label>Título da Pergunta</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Digite o título da sua pergunta..."
              />
            </Form.Group>

            <Form.Group controlId="questionInput" className="mb-3">
              <Form.Label>Qual a sua pergunta?</Form.Label>
              <div className="container" data-color-mode="light">
                <MDEditor
                  value={question}
                  onChange={setQuestion} // Atualiza diretamente o estado
                />
                <MDEditor.Markdown source={question} style={{ whiteSpace: 'pre-wrap' }} />
              </div>
            </Form.Group>

            <div className="text-center">
              <Button variant="success" className='btn-hover fw-bold p-3' type="submit" disabled={title.trim() === "" || question.trim() === ""}>
                Enviar Pergunta
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
