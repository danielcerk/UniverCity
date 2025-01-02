import { useEffect } from "react";

export default function Error500() {

  useEffect (() => {
    
    document.title = 'UniverCity | Página não encontrada'
    
  }, [])

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 text-warning">500</h1>
      <h2 className="mb-4">Erro Interno do Servidor</h2>
      <p className="text-muted mb-4">
        Algo deu errado no servidor. Por favor, tente novamente mais tarde.
      </p>
      <a href="/" className="btn btn-primary">
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
