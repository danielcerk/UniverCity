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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  
    const navbar = document.getElementById('navbar-main');
    const navBtnMobile = document.getElementById('navbar-btn-mobile');
  
    // Função para lidar com o scroll
    const handleScroll = () => {
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      }
    };
  
    // Função para alternar o estado do navbar ao clicar no botão
    const handleClick = () => {
      // Não alternar a classe de scroll se a página já tiver sido rolada
      if (window.scrollY === 0) {
        navbar?.classList.toggle('navbar-scrolled');
      }
      // Aqui você pode adicionar outros comportamentos para o botão, se necessário
    };
  
    // Verificar se estamos na Landing Page ou em outras páginas
    if (location.pathname === "/") {
      window.addEventListener('scroll', handleScroll);
      navBtnMobile?.addEventListener('click', handleClick);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
        navBtnMobile?.removeEventListener('click', handleClick);
      };
    } else {
      if (navbar) {
        navbar.classList.add('navbar-scrolled');
      }
    }
  }, [location.pathname]);
  

  return (
    <nav className="navbar navbar-expand-lg position-fixed w-100 top-0 z-index-5" style={{
      position: 'fixed',
      zIndex: 1050,  // valor maior para garantir que o navbar fique acima
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
    }}  id='navbar-main'>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <strong className={styles.Logo}>UniverCity</strong>
        </Link>

        {/* Botão do menu mobile */}
        <button
          className="navbar-toggler navbar-btn-mobile my-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          id='navbar-btn-mobile'
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Conteúdo do Navbar */}
        <div className="collapse navbar-collapse px-3 px-md-0" id="navbarContent">
          {/* Barra de busca centralizada */}
          <form className="d-flex mx-auto my-2 navbar-form-search" onSubmit={getSearch}>
            <input
              className="form-control me-2 bg-transparent "
              type="search"
              placeholder="Buscar universidades, reclamações ou dúvidas..."
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              className="px-3 border-0 bg-dark text-white rounded fa-solid fa-magnifying-glass" 
              type="submit">
            </button>
          </form>

          {/* Links de navegação */}
          {isAuth ? (
            <ul className="navbar-nav ms-auto fw-semibold nav_list gap-3 ">

              <li className="nav-item texto-com-hover ">
                <Link to="/conta" className="nav-link active">
                Painel <i className="fa-brands fa-slack"></i>
                </Link>
                <div className="nav-underline linha"></div>
              </li>
              <li className="nav-item texto-com-hover">
                <button className="nav-link active" onClick={doLogout}>
                  Sair <i className="fa-solid fa-right-from-bracket"></i>
                </button>
                <div className="nav-underline linha"></div>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto gap-3">
              <li className="nav-item texto-com-hover">
                <Link to="/comunidades" className="nav-link">
                  Universidades
                </Link>
                <div className="nav-underline linha"></div>
              </li>
              <li className="nav-item texto-com-hover">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <div className="nav-underline linha"></div>
              </li>
              <li className="nav-item">
                <Link to="/cadastro" className="btn bg-page-red text-white">
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
