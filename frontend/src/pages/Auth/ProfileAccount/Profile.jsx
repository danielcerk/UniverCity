import React from "react";

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios'

import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user, setUser] = useState({
    name: "",
    biografy: "",
    phone: "",
    full_name: "",
  });

  const { slug } = useParams();
  const navigate = useNavigate()

  const getProfile = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/profiles/${slug}`);
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do perfil:", error);
      navigate('/404')
    }
  };

  useEffect(() => {
    if (slug) {
      getProfile();
    }
    document.title = `UniverCity | @${slug}`;
  }, [slug]);

  return (
    <>
      <div className="container mt-5">
        {/* Header do perfil */}
        <div className="text-center mb-4">
          <h1>@{user.name}</h1>
          <p className="text-muted">{user.full_name}</p>
          <p className="lead">{user.biografy}</p>
          <p><strong>Telefone:</strong> {user.phone}</p>
        </div>

      </div>
    </>
  );
}
