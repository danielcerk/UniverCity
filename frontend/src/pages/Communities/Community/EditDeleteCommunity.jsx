import { useState, useEffect } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../interceptors/axios'; // Importa a instância personalizada
import Sidebar from '../../../layout/Sidebar/Sidebar';

export default function EditDeleteCommunity() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    small_description: '',
    site: '',
    state: '',
    city: '',
    founded_at: '',
    is_verified: false,
  });
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const navigate = useNavigate();
  const { slug } = useParams();

  // Busca informações do usuário autenticado
  const getUser = async () => {
    try {

      const token = localStorage.getItem('access_token')

      const response = await axiosInstance.get('/api/v1/account',{
        headers: {
          'Authorization': `Bearer ${token}`,  // Passando o token de autenticação
        },
      });
      setUser(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
      return null;
    }
  };

  // Busca dados da universidade
  const fetchUniversidade = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/communities/${slug}/`);
      setFormData(response.data);
      fetchCidades(response.data.state);
      document.title = `UniverCity | Editar '${response.data.name}'`;
    } catch (error) {
      console.error('Erro ao buscar universidade:', error);
      navigate('/404')
    }
  };

  // Busca lista de estados
  const fetchEstados = async () => {
    try {
      const response = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      setEstados(response.data.map((estado) => ({ id: estado.id, nome: estado.nome })));
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
    }
  };

  // Busca lista de cidades com base no estado selecionado
  const fetchCidades = async (estadoNome) => {
    try {
      const estado = estados.find((e) => e.nome === estadoNome);
      if (!estado) return;
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
      );
      setCidades(response.data.map((cidade) => ({ id: cidade.id, nome: cidade.nome })));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  // Manipula alterações no formulário
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Salva alterações feitas
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`api/v1/communities/${slug}/`, formData);
      navigate('/comunidades/');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  // Exclui a universidade
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`api/v1/communities/${slug}/`);
      navigate('/comunidades/');
    } catch (error) {
      console.error('Erro ao excluir universidade:', error);
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
      } else {
        await fetchEstados();
        await fetchUniversidade();
      }
    };
    initialize();
  }, [slug, navigate]);

  return (
    <Container className="mt-5">
      <Row className="g-0">
        <Sidebar />
        <Col xs={12} md={9} className="p-5">
          <Container>
            <h2 className="text-center mb-4">Editar '{formData.name}'</h2>
            <Form onSubmit={handleSave}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nome da Universidade</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  name="small_description"
                  rows={3}
                  value={formData.small_description || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formSite" className="mb-3">
                <Form.Label>Site</Form.Label>
                <Form.Control
                  type="url"
                  name="site"
                  value={formData.site || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formState" className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="state"
                  value={formData.state || ''}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchCidades(e.target.value);
                  }}
                >
                  <option value="">Selecione o estado</option>
                  {estados.map((estado) => (
                    <option key={estado.nome} value={estado.nome}>
                      {estado.nome}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formCity" className="mb-3">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  as="select"
                  name="city"
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
              <Form.Group controlId="formFoundationDate" className="mb-3">
                <Form.Label>Data de Fundação</Form.Label>
                <Form.Control
                  type="date"
                  name="founded_at"
                  value={formData.founded_at || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formIsVerified" className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="is_verified"
                  label="Universidade Verificada"
                  checked={formData.is_verified || false}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <div className="text-center">
                <Button variant="dark" type="submit" className="me-2">
                  Salvar Alterações
                </Button>
                <Button variant="danger" type="button" onClick={handleDelete}>
                  Excluir Universidade
                </Button>
              </div>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
