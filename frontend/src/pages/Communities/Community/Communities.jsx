import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../../../interceptors/axios";

import Sidebar from "../../../layout/Sidebar/Sidebar";
import spinner from "../../../assets/loading.svg";

import styles from "../../../assets/loading.module.css";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true); // Inicializa como `true`

  const getCommunities = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/communities/`);
      setCommunities(res.data.results);
    } catch (error) {
      console.error("Erro ao buscar as Universidades:", error);
      setCommunities([]);
    }
  };

  useEffect(() => {
    // Busca as comunidades
    getCommunities();

    // Define um timer de 5 segundos para exibir o spinner
    const timer = setTimeout(() => {
      setLoading(false); // Após 5 segundos, oculta o spinner
    }, 5000);

    document.title = "UniverCity | Universidades";

    // Limpa o timer ao desmontar o componente
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="rounded card" style={{minHeight:'500px'}}>
      <Row>
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo principal */}
        <Col xs={12} md={9}>
          <h2 className="my-5 text-danger fw-bold text-center text-md-start">Universidades na UniverCity</h2>
          <br />
          <Row>
            {loading ? (
              <div className={styles.loading_container}>
                <div className="text-center">
                  <img
                    src={spinner}
                    alt="Carregando..."
                    height="35"
                    width="35"
                    className="loading-svg"
                  />
                </div>
              </div>
            ) : communities.length > 0 ? (
              communities.map((community, index) => (
              

                <Col xs={12} md={6} lg={4} key={index} className="mb-4">
                <Card className="card-community shadow-sm ">
              
                  <Card.Body>
                      <img className="card-img mb-3 rounded" src="https://cdn.pixabay.com/photo/2020/09/29/10/42/library-5612441_1280.jpg" alt="" />
                      <Card.Title>{community.name}</Card.Title>
              
                    <Card.Text className="text-dark">
                      {community.small_description.length > 100
                        ? community.small_description.substring(0, 100) + "..."
                        : community.small_description}
                    </Card.Text>
                    <small className="text-danger fw-bold">{community.members || 0} membros</small>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Link className="link-dark" to={`/comunidades/${community.slug}`}>
                      <button className="w-100 border-0 bg-dark btn-hover p-2 rounded text-white fw-bold">Ver mais detalhes</button>
                    </Link>
                  </Card.Footer>
                </Card>
                </Col>

              ))
            ) : (
              <Col>
                <div className="text-center">
                  <p className="py-0 p-3">Nenhuma universidade encontrada.</p>
                  <img src="https://i.pinimg.com/236x/6e/dc/35/6edc3539d017611c9d24cd28e47420c4.jpg" alt="" />
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
