import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    biografy: '',
  });
  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Token não foi localizado');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/v1/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/v1/profiles/${user.slug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Limpar informações de autenticação e redirecionar
      localStorage.removeItem('access_token');
      navigate('/login');
      console.log('Conta excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/profiles/${user.slug}/`,
        {
          name: user.name,
          email: user.email,
          phone: user.phone ? user.phone.toString() : '',
          biografy: user.biografy,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setIsEditing(false);
      console.log('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
    }
  };

  useEffect(() => {
    document.title = 'UniverCity | Minha Conta';

    const token = localStorage.getItem('access_token');

    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      navigate('/login');
    }

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <h2 className="text-center mb-4">Minha Conta</h2>

            <div className="mb-4">
              <h4>Informações Pessoais</h4>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  {/* Campos de edição */}
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label><strong>Nome:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      placeholder="Digite seu nome"
                    />
                  </Form.Group>
                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label><strong>E-mail:</strong></Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      placeholder="Digite seu e-mail"
                    />
                  </Form.Group>

                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label><strong>Número de Telefone:</strong></Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      placeholder="Digite seu número de telefone"
                    />
                  </Form.Group>

                  <Form.Group controlId="biografy" className="mb-3">
                    <Form.Label><strong>Sua biografia:</strong></Form.Label>
                    <Form.Control
                      as="textarea" // Define o elemento como textarea
                      name="biografy"
                      rows={10} // Define o número de linhas para aumentar a altura
                      value={user.biografy}
                      onChange={handleChange}
                      placeholder="Sua biografia"
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="dark" type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>E-mail:</strong> {user.email}</p>
                  <p><strong>Número de Telefone:</strong> {user.phone}</p>
                  <p><strong>Bio:</strong> {user.biografy}</p>
                </div>
              )}
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="warning"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar' : 'Editar Informações'}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <h5 className="text-danger">Excluir Conta</h5>
              <p>
                Se você deseja excluir sua conta, todos os seus dados serão apagados permanentemente.
              </p>
              <Button variant="danger" onClick={handleDelete}>
                Excluir Conta
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
