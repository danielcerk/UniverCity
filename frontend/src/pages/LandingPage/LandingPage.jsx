import {Link} from 'react-router-dom'
import { useEffect } from 'react';

import AOS from "aos";
import "aos/dist/aos.css";


export default function LandingPage() {

  useEffect(() => {
    AOS.init({ duration: 1500 }); // Inicia o AOS e define a duração da animação
  }, []);

  return (
    <div>
   <header
    className="text-white text-center py-5 d-flex position-relative bg-black"
    style={{
      minHeight: '550px'
    }}>
    {/* Camada de imagem com opacidade */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/portrait-smiling-female-university-student-lying-green-grass-holding-book-hand_23-2148093058.jpg?t=st=1736212020~exp=1736215620~hmac=7664332885b4663ec194fd306c82d26fe5eb927b1a25f940e2ab359526d63261&w=740')",
     
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Efeito parallax
        opacity: 0.50, // Opacidade da imagem
        zIndex: 1, // Garante que a imagem fique atrás do conteúdo
      }}
    ></div>

    {/* Conteúdo centralizado */}
    <div className="container d-flex flex-column justify-content-center align-items-center position-relative " style={{zIndex: 2}}>
      <h1 className="display-4 fw-bold" data-aos="fade-up">
        Bem-vindo à UniverCity!
      </h1>
      <p className="lead" data-aos="fade-up" data-aos-delay="200">
        Conecte-se, colabore e faça parte de algo incrível. Junte-se agora!
      </p>
      <Link
        to="/faq"
        className="btn btn-light btn-lg mt-3"
        data-aos="fade-up"
        data-aos-delay="400"

        id='custom-btn'
      >
        Saiba Mais
      </Link>

    </div>
  </header>



      {/* About Section */}
      <section className="py-5" id="community">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://media.istockphoto.com/id/1348870264/pt/foto/university-students-in-classroom-after-lecture.jpg?s=612x612&w=0&k=20&c=h3AyEYyPWomtOq9sibza6Ptbo7t9FW00uV2uVy0CNRw="
                alt="Alunos rindo enquanto usam o aplicativo da UniverCity"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h2 className="mb-4">Participe da Comunidade</h2>
              <p className="text-muted">
                Aqui, você pode tirar dúvidas sobre a instituição
                em que você estuda, fazer reclamações, ajudar calouros
                com suas perguntas , enfim ... um espaço divertido, venha
                fazer parte!
              </p>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Faça perguntas e compartilhe soluções.
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Participe de discussões.
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Faça amizades.
                </li>
              </ul>
              <Link to="/login" className="btn btn-dark mt-4">
                Junte-se Agora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
