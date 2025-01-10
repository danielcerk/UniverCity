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
    <Container className="rounded" style={{backgroundImage:"url('https://i.pinimg.com/236x/0c/61/1a/0c611ab0e09772ae18b78f26e77a708b.jpg')"}}>
      <Row>
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo principal */}
        <Col xs={12} md={9}>
          <h2 className="text-center my-5">Universidades na UniverCity</h2>
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
                // <Col xs={12} md={6} lg={4} key={index} className="mb-4">
                //   <Card className="shadow-sm">
                //     <Card.Body>
                //       <Link
                //         className="link-dark"
                //         to={`/comunidades/${community.slug}`}
                //       >
                //         <Card.Title>{community.name}</Card.Title>
                //       </Link>
                //       <Card.Text className="text-muted">
                //         {community.small_description.length > 100
                //           ? community.small_description.substring(0, 100) + "..."
                //           : community.small_description}
                //       </Card.Text>
                //       <Card.Footer className="bg-white text-center">
                //         <small className="text-dark">
                //           {community.members || 0} membros
                //         </small>
                //       </Card.Footer>
                //     </Card.Body>
                //   </Card>
                // </Col>

                <Col xs={12} md={6} lg={4} key={index} className="mb-4">
                <Card className="card-community shadow-sm ">
                  <Card.Body>
                    <Link className="link-dark" to={`/comunidades/${community.slug}`}>
                      <Card.Title>{community.name}</Card.Title>
                    </Link>
                    <Card.Text className="text-dark">
                      {community.small_description.length > 100
                        ? community.small_description.substring(0, 100) + "..."
                        : community.small_description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <small>{community.members || 0} membros</small>
                  </Card.Footer>
                </Card>
                </Col>

              ))
            ) : (
              <Col>
                <p className="text-center">Nenhuma universidade encontrada.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
