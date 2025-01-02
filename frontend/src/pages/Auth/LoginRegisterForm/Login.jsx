import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../../../interceptors/axios';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpa a mensagem de erro ao tentar novamente

    const user = { email, password };

    try {
      const { data } = await axiosInstance.post("/api/v1/auth/token/", user);

      // Salvar tokens no localStorage
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Atualiza o header de autorização para futuras requisições
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      navigate("/feed");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.email) {
          setErrorMessage("O e-mail informado é inválido.");
        } else if (error.response.data.password) {
          setErrorMessage("A senha informada está incorreta.");
        } else {
          setErrorMessage("E-mail ou senha inválidos. Verifique seus dados.");
        }
      } else {
        setErrorMessage("Erro ao conectar-se ao servidor. Tente novamente.");
      }
    }
  };

  useEffect(() => {
    document.title = "UniverCity | Login";

    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/feed");
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Entrar na Univercity</h2>

            {/* Exibir mensagem de erro */}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={submit}>
              {/* Campo de E-mail */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo de Senha */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Botão de Login */}
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-dark">
                  Entrar
                </button>
              </div>
            </form>

            {/* Link para cadastro */}
            <div className="text-center mt-3">
              <p>
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="link-dark">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
