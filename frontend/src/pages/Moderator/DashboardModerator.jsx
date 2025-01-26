import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';

import Sidebar from '../../layout/Sidebar/Sidebar';

import axiosInstance from '../../interceptors/axios';

// Vamos fazer requisições do tipo patch em Remover admin, adicionar admin e aprovar ou rejeitar denuncia

export default function DashboardModerator() {
  const [moderators, setModerators] = useState([]);
  const [reports, setReports] = useState([])

  const [newModerator, setNewModerator] = useState('');

  const fetchDataUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/profiles/`);
      
      setModerators(res.data)

    } catch (error) {

      console.error('Erro ao conseguir os usuários:', error);

    }
  };

  const fetchDataReport = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/reports/`);
      
      setReports(res.data)

    } catch (error) {

      console.error('Erro ao conseguir as denúncias:', error);
      
    }
  };

  const handleAddModerator = async (slug) => {

    try {
      const response = await axiosInstance.put(`/api/v1/profiles/${slug}/`, {
        is_moderator: true
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

    } catch (error) {
      console.error("Erro ao adicionar moderador:", error);
    }
  };

  const handleRemoveModerator = async (slug) => {
    try {
      const response = await axiosInstance.put(`/api/v1/profiles/${slug}/`, {
        is_moderator: false
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

    } catch (error) {
      console.error("Erro ao remover moderador:", error);
    }
  };

  const handleEditReport = async (id, content_type_id, object_id, status) => {

    if (status === 'approved'){

      status = 'APROVADO'

    } else if (status === 'rejected') {

      status = 'REJEITADO'

    }

    try {
      const response = await axiosInstance.put(`/api/v1/reports/${content_type_id}/${object_id}/${id}/`, {
        status: status,  // Passando o status recebido no clique (approved ou rejected)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      // Sucesso
      console.log("Denúncia editada com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao editar denúncia:", error);
    }
  };
  

  useEffect(() => {

    fetchDataUser()
    fetchDataReport()

  }, [])

  return (
    <Container style={{ minHeight: "400px" }}>
      <Row>
        <Sidebar />

        <Col className="d-flex justify-content-center align-items-start">
          <div className="w-100">

            {/* Gerenciamento de Moderadores */}
            <Card className="mb-4">
              <Card.Body>
                <h3>Gerenciar Moderadores</h3>
                <Form.Group className="mb-3">
                  <Form.Label>Adicionar Novo Moderador</Form.Label>
                  <Form.Control
                    type="text"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                    placeholder="Digite o slug do moderador"
                  />
                </Form.Group>
                <Button variant="primary" onClick={() => handleAddModerator(newModerator)}>Adicionar Moderador</Button>

                <h4 className="mt-4">Moderadores Atuais</h4>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderators.map((moderator) => 
                      moderator.is_moderator ? (
                        <tr key={moderator.id}>
                          <td>{moderator.id}</td>
                          <td>{moderator.name}</td>
                          <td>{moderator.email}</td>
                          <td>
                            <Button variant="danger" onClick={() => handleRemoveModerator(moderator.slug)}>
                              Remover
                            </Button>
                          </td>
                        </tr>
                      ) : null // Retorne null ou remova essa parte se o `else` não for necessário
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Moderação de Conteúdo */}
            <h2 className="my-4">Área de denúncias</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Descrição da Denúncia</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.user}</td>
                    <td>{report.description}</td>
                    <td>{report.created_at}</td>
                    <td>{report.status}</td>
                    <td>
                      <Button 
                        variant="success" 
                        className="me-2" 
                        onClick={() => handleEditReport(report.id, report.content_type, report.object_id, 'approved')}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        variant="danger" 
                        className="me-2" 
                        onClick={() => handleEditReport(report.id, report.content_type, report.object_id, 'rejected')}
                      >
                        Rejeitar
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
