import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../interceptors/axios";
import { Link } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState({
    communities: [],
    profiles: [],
    reclamations: [],
    responses: [],
    questions: []
  });

  useEffect(() => {
    document.title = `UniverCity | Resultados para '${query}'`;

    if (query) {
      axiosInstance
        .get(`search/?q=${query}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar resultados:", error);
        });
    }
  }, [query]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Resultados para '{query}'</h2>

      {/* Seção de Universidades */}
      <h4>Universidades</h4>
      <div className="list-group">
        {results.communities.length > 0 ? (
          results.communities.map((community) => (
            <Link to={`/comunidades/${community.slug}`} key={community.id} className="list-group-item list-group-item-action">
              {community.name}
            </Link>
          ))
        ) : (
          <p className="text-muted">Nenhuma universidade encontrada.</p>
        )}
      </div>

      {/* Seção de Pessoas */}
      <h4>Pessoas</h4>
      <div className="list-group">
        {results.profiles.length > 0 ? (
          results.profiles.map((profile) => (
            <Link to={`/perfil/${profile.slug}`} key={profile.id} className="list-group-item list-group-item-action">
              {profile.name}
            </Link>
          ))
        ) : (
          <p className="text-muted">Nenhuma pessoa encontrada.</p>
        )}
      </div>

      {/* Seção de Reclamações */}
      <h4>Reclamações</h4>
      <div className="list-group">
        {results.reclamations.length > 0 ? (
          results.reclamations.map((reclamation) => (
            <Link to={`/comunidades/${reclamation.community}/user/${reclamation.user}/reclamacao/${reclamation.slug}`} key={reclamation.id} className="list-group-item list-group-item-action">
              {reclamation.title}
            </Link>
          ))
        ) : (
          <p className="text-muted">Nenhuma reclamação encontrada.</p>
        )}
      </div>

      {/* Seção de Comentários */}
      <h4>Comentários</h4>
      <div className="list-group">
        {results.responses.length > 0 ? (
          results.responses.map((response) => (
            <Link to="#" key={response.id} className="list-group-item list-group-item-action">
              {response.text}
            </Link>
          ))
        ) : (
          <p className="text-muted">Nenhum comentário ou resposta encontrada.</p>
        )}
      </div>

      {/* Seção de Perguntas */}
      <h4>Perguntas</h4>
      <div className="list-group">
        {results.questions.length > 0 ? (
          results.questions.map((question) => (
            <Link to={`/comunidades/${question.community}/user/${question.user}/pergunta/${question.slug}`} key={question.id} className="list-group-item list-group-item-action">
              {question.title}
            </Link>
          ))
        ) : (
          <p className="text-muted">Nenhuma pergunta encontrada.</p>
        )}
      </div>
    </div>
  );
}
