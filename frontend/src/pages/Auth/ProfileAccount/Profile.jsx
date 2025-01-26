import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from 'react-bootstrap';
import axiosInstance from '../../../interceptors/axios';

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    biografy: "",
    phone: "",
    full_name: "",
    is_moderator: ''
  });

  const { slug } = useParams();
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      if (!slug) {
        console.error("Slug não fornecido.");
        navigate('/404');
        return;
      }

      // Requisição utilizando axiosInstance
      const res = await axiosInstance.get(`/api/v1/profiles/${slug}/`);
      console.log(res.data)
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do perfil:", error);
      // Redireciona para uma página 404 caso ocorra erro
      navigate('/404');
    }
  };

  useEffect(() => {
    getProfile();
    document.title = `UniverCity | @${slug}`;
  }, [slug]);

  return (
    <div className="container mt-5">
      {/* Header do perfil */}
      <div className="text-center mb-4">
        <h1>@{user.name}</h1>
        <p className="text-muted">
          {user.full_name} {user.is_moderator && (
          <Badge bg="success" className="ms-2">
            moderador
          </Badge>
        )}</p>
        <p className="lead">{user.biografy}</p>
        <p><strong>Telefone:</strong> {user.phone}</p>
      </div>
    </div>
  );
}
