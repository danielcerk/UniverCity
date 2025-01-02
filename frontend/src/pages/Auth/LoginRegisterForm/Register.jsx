import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagens de erro

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpa a mensagem de erro ao tentar novamente

    const user = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/register/",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Salvar tokens no localStorage
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;

      navigate("/feed");
    } catch (error) {
      // Tratamento de erros para dados inválidos
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.name) {
          setErrorMessage("O nome informado é inválido.");
        } else if (errorData.email) {
          setErrorMessage("O e-mail informado já está em uso ou é inválido.");
        } else if (errorData.password) {
          setErrorMessage("A senha informada não atende aos requisitos.");
        } else {
          setErrorMessage("Erro ao registrar. Verifique seus dados.");
        }
      } else {
        setErrorMessage("Erro ao conectar-se ao servidor. Tente novamente.");
      }
    }
  };

  useEffect(() => {
    document.title = "UniverCity | Criar uma nova conta";

    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/feed");
    }
  }, [navigate]);

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4">
              <h2 className="text-center mb-4">Cadastre-se na Univercity</h2>

              {/* Exibir mensagem de erro */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={submit}>
                {/* Campo de Nome */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Campo de E-mail */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Digite seu e-mail"
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
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Botão de Registro */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-dark">
                    Registrar
                  </button>
                </div>
              </form>

              {/* Link para Login */}
              <div className="text-center mt-3">
                <p>
                  Já tem uma conta?{" "}
                  <Link to="/login" className="link-dark">
                    Entre aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
