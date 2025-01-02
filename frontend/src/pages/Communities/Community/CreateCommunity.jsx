import { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../../interceptors/axios';
import Sidebar from '../../../layout/Sidebar/Sidebar';

export default function CreateCommunity() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    small_description: '',
    site: '',
    city: '',
    state: '',
    founded_at: '',
    is_verified: false,
  });

  const navigate = useNavigate();

  const getUser = async (token) => {
    try {
      // Adiciona o token no cabeçalho da requisição
      const response = await axiosInstance.get('/api/v1/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
      return null;
    }
  };
  

  const fetchEstados = async () => {
    try {
      const response = await axios.get('http://servicodados.ibge.gov.br/api/v1/localidades/estados');
      setEstados(response.data.map(item => ({ id: item.id, nome: item.nome })));
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
    }
  };

  const fetchCidades = async (estadoNome) => {
    try {
      const estado = estados.find((e) => e.nome === estadoNome);
      if (!estado) {
        setCidades([]);
        return;
      }
      const response = await axios.get(
        `http://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
      );
      setCidades(response.data.map((item) => ({ id: item.id, nome: item.nome })));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsAuth(false);
        navigate('/login');
        return;
      }
      setIsAuth(true);
      const fetchedUser = await getUser(token);
      if (!fetchedUser || !fetchedUser.is_moderator) {
        navigate('/404');
      }
      fetchEstados();
    };
    initialize();
    document.title = 'UniverCity | Criar Nova Universidade';
  }, [navigate]);

  const handleEstadoChange = (e) => {
    const estadoNome = e.target.value;
    setSelectedEstado(estadoNome);
    setFormData({ ...formData, state: estadoNome });
    if (estadoNome) {
      fetchCidades(estadoNome);
    } else {
      setCidades([]);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/v1/communities/', formData);
      navigate('/comunidades/'); // Redireciona após criar a comunidade.
    } catch (error) {
      console.error('Erro ao criar a comunidade:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <Container>
            <h2 className="text-center mb-4">Criar Nova Comunidade</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Digite o nome da universidade"
                />
              </Form.Group>
              <Form.Group controlId="small_description" className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.small_description}
                  onChange={handleInputChange}
                  placeholder="Digite uma breve descrição"
                />
              </Form.Group>
              <Form.Group controlId="site" className="mb-3">
                <Form.Label>Site</Form.Label>
                <Form.Control
                  type="url"
                  value={formData.site}
                  onChange={handleInputChange}
                  placeholder="Digite o site"
                />
              </Form.Group>
              <Form.Group controlId="state" className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control as="select" onChange={handleEstadoChange}>
                  <option value="">Selecione o estado</option>
                  {estados.map((estado) => (
                    <option key={estado.nome} value={estado.nome}>
                      {estado.nome}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="city" className="mb-3">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione a cidade</option>
                  {cidades.map((cidade) => (
                    <option key={cidade.nome} value={cidade.nome}>
                      {cidade.nome}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="founded_at" className="mb-3">
                <Form.Label>Data de Fundação</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.founded_at}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="is_verified" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Universidade Verificada"
                  checked={formData.is_verified}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="dark" type="submit">
                Criar Comunidade
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
