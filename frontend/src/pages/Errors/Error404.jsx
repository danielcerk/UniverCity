import { useEffect } from "react";

export default function Error404() {

  useEffect (() => {

    document.title = 'UniverCity | Página não encontrada'

  }, [])

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-4">Página Não Encontrada</h2>
      <p className="text-muted mb-4">
        A página que você está procurando não existe ou foi movida.
      </p>
      <a href="/" className="btn btn-primary">
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
