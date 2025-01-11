import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Sidebar from '../../../../layout/Sidebar/Sidebar';
import axiosInstance from '../../../../interceptors/axios'; // Aqui você importa sua instância do Axios

export default function CreateReclamation() {
  const [title, setTitle] = useState("");  // Estado para o título da reclamação
  const [reclamation, setReclamation] = useState("");  // Estado para o conteúdo da reclamação
  const [university, setUniversity] = useState({ id: "" }); // Estado para a universidade
  const [isAuth, setIsAuth] = useState(false); // Verifica se o usuário está autenticado
  const { slug } = useParams(); // Obtém o slug da URL
  const navigate = useNavigate(); // Navegação após o envio
  const [user, setUser] = useState({}); // Estado para armazenar os dados do usuário

  // Função para lidar com a mudança no título
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Função para lidar com a mudança no conteúdo da reclamação
  const handleReclamationChange = (value) => {
    setReclamation(value);  // Atualiza o estado com o novo valor
  };

  // Função para enviar a reclamação
  const handleReclamationSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() !== "" && reclamation.trim() !== "") {
      // Prepara os dados a serem enviados
      const reclamationData = {
        title: title,
        content: reclamation,
        community: university.id,  // A associação com a universidade usando o id
        user: user.id  // O ID do usuário autenticado
      };

      try {
        // Envia a requisição POST para criar a reclamação
        const response = await axiosInstance.post(
          `/api/v1/communities/${slug}/reclamations/`,
          reclamationData
        );

        console.log("Reclamação criada com sucesso:", response.data);

        // Redireciona para a página de reclamações ou limpa os campos
        //navigate(`/communities/${slug}/reclamations`);
        setTitle("");  // Limpar o campo título
        setReclamation("");  // Limpar o campo reclamação
      } catch (error) {
        console.error('Erro ao criar a reclamação:', error);
      }
    }
  };

  // Função para buscar os dados da universidade e o ID do usuário
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
  const getUserID = async (token) => {
    try {
      const response = await axiosInstance.get('/api/v1/account',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
      setUser(response.data); // Atualiza o estado do usuário
    } catch (error) {
      console.error('Erro ao obter dados do usuário', error);
    }
  };

  useEffect(() => {
    document.title = 'UniverCity | Criar Nova Reclamação';

    const token = localStorage.getItem('access_token');
    
    if (token) {
      setIsAuth(true);
      getUniversityID();
      getUserID();
    } else {
      setIsAuth(false);
      navigate('/login');
    }
  }, [slug, navigate]);

  return (
    <Container className="">
      <Row>
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo Principal */}
        <Col xs={12} md={9} className="p-2 py-5 p-md-5 card">
          <h3 className='text-center text-md-start'>Criar Nova Reclamação</h3>
          <br />

          {/* Formulário para criar uma reclamação */}
          <Form onSubmit={handleReclamationSubmit}>
            <Form.Group controlId="reclamationTitle" className="mb-3">
              <Form.Label>Título da Reclamação</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Digite o título da sua reclamação..."
              />
            </Form.Group>

            <Form.Group controlId="reclamationInput" className="mb-3">
              <Form.Label>Qual o seu problema?</Form.Label>
              <div className="container" data-color-mode="light">
                  <MDEditor
                    value={reclamation}
                    onChange={handleReclamationChange}
                  />
                  <MDEditor.Markdown source={reclamation} style={{ whiteSpace: 'pre-wrap' }} />
              </div>
            </Form.Group>

            <div className="text-center">
              <Button variant="danger" className='btn-hover fw-bold p-3' type="submit" disabled={title.trim() === "" || reclamation.trim() === ""}>
                Enviar Reclamação
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
