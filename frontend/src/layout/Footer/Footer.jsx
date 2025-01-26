import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 d-flex flex-column">
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-muted">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/termos-de-uso" className="nav-link px-2 text-muted">Termos de Uso</Link>
        </li>
        <li className="nav-item">
          <Link to="/politica-de-privacidade" className="nav-link px-2 text-muted">Política de Privacidade</Link>
        </li>
        <li className="nav-item">
          <Link to="/faq" className="nav-link px-2 text-muted">FAQ</Link>
        </li>
        <li className="nav-item">
          <Link to="/status" className="nav-link px-2 text-muted">Status</Link>
        </li>
      </ul>
      <div className='bg-dark'>
        <p className="text-center text-white py-2 bg-dark ">
          Made in Bahia © {year}
        </p>
      </div>
    </footer>
  );
}
