import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../interceptors/axios';  // Importando a instância do Axios

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Função para capturar o valor de busca
  function getSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/resultados/?q=${search.trim()}`);
    }
  }

  // Função de logout utilizando axiosInstance
  const doLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        'api/v1/auth/logout/',
        { refresh_token: localStorage.getItem('refresh_token') }
      );

      console.log('Logout bem-sucedido:', data);
      localStorage.clear();
      axiosInstance.defaults.headers.common['Authorization'] = null;
      navigate('/login/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuth(!!token);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <strong className={styles.Logo}>UniverCity</strong>
        </Link>

        {/* Botão do menu mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Conteúdo do Navbar */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Barra de busca centralizada */}
          <form className="d-flex mx-auto" style={{ width: '40%' }} onSubmit={getSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          {/* Links de navegação */}
          {isAuth ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="nav-link" onClick={doLogout}>
                  Sair
                </button>
              </li>
              <li className="nav-item">
                <Link to="/conta" className="nav-link">
                  Olá, Estudante!
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/comunidades" className="nav-link">
                  Universidades
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cadastro" className="btn btn-dark">
                  Cadastre-se
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
