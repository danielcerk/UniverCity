import React, { useEffect, useState } from "react";
import axiosInstance from "../../interceptors/axios";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement, // Adicionado para registrar os pontos
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

// Registrar os componentes necessários para o Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Registrado aqui
  Tooltip,
  Legend
);

export default function Status() {

  useEffect(() => {
      document.title = 'UniverCity | Status';
  }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    // Obter os dados da API
    axiosInstance
      .get("/api/v1/status/") // Altere para a URL real da sua API
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  if (!data) {
    return <div className="text-center">Carregando...</div>;
  }

  // Preparar dados para os gráficos
  const formatChartData = (rawData) => {
    const labels = Object.keys(rawData);
    const values = Object.values(rawData);

    return {
      labels,
      datasets: [
        {
          label: "Quantidade",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const userChartData = formatChartData(data.count_user_per_date);
  const communityChartData = formatChartData(data.count_communities_per_date);
  const reclamationsChartData = formatChartData(data.count_reclamations_per_date);
  const questionsChartData = formatChartData(data.count_questions_per_date);
  const responsesChartData = formatChartData(data.count_response_per_date);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Status do Aplicativo</h1>

      {/* Status geral */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div
            className={`alert ${
              data.status_app ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            Status do App: {data.status_app ? "Online" : "Offline"}
          </div>
        </div>
        <div className="col-md-6">
          <div
            className={`alert ${
              data.status_db ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            Status do Banco de Dados: {data.status_db ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Usuários por Data</h5>
          <Bar data={userChartData} />
        </div>
        <div className="col-md-6 mb-4">
          <h5>Comunidades por Data</h5>
          <Line data={communityChartData} />
        </div>
        <div className="col-md-6 mb-4">
          <h5>Reclamações por Data</h5>
          <Bar data={reclamationsChartData} />
        </div>
        <div className="col-md-6 mb-4">
          <h5>Perguntas por Data</h5>
          <Line data={questionsChartData} />
        </div>
        <div className="col-md-6 mb-4">
          <h5>Respostas por Data</h5>
          <Bar data={responsesChartData} />
        </div>
      </div>

      {/* Contribuidores */}
      <div className="mt-5">
        <h3>Contribuidores</h3>
        <div className="row">
          {Object.entries(data.contribuitors).map(([username, avatarUrl]) => (
            <div className="col-md-3 text-center mb-4" key={username}>
              <img
                src={avatarUrl}
                alt={username}
                className="rounded-circle"
                style={{ width: "80px", height: "80px" }}
              />
              <p className="mt-2">{username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
