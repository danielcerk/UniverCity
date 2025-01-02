import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../interceptors/axios"; // Importando a instância personalizada do Axios

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const user = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const { data } = await axiosInstance.post(
        "api/v1/auth/register/",  // Usando a instância personalizada do Axios
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;

      navigate("/feed");
    } catch (error) {
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

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={submit}>
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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-dark">
                    Registrar
                  </button>
                </div>
              </form>

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
