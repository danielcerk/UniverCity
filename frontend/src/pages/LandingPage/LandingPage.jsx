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
    className="text-white text-center py-5 d-flex position-relative bg-black header-langing-page">
    {/* Camada de imagem com opacidade */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100 py-5"
      style={{
        backgroundImage: "url('https://cdn.pixabay.com/photo/2020/09/29/10/42/library-5612441_1280.jpg')",
     
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', 
        opacity: 0.50, 
        zIndex: 1, 
      }}
    ></div>

    {/* Conteúdo centralizado */}
    <div className="container d-flex flex-column justify-content-center align-items-center position-relative " style={{zIndex: 2}}>
      <br />
      <br />
      <h1 className="display-4 fw-bold" data-aos="fade-up">
        Bem-vindo à UniverCity!
      </h1>
      <p className="lead" data-aos="fade-up" data-aos-delay="200">
        Conecte-se, colabore e faça parte de algo incrível. Junte-se agora!
      </p>
      <div className='d-flex gap-md-3 flex-column flex-md-row align-items-center justify-content-center'>
        <Link
          to="/conta"
          className="btn btn-lg mt-3 "
          data-aos="fade-up"
          data-aos-delay="400"
          id='custom-btn-student'
        >
          Área do Estudante
        </Link>


        <Link
          to="/faq"
          className="btn btn-light btn-lg mt-3"
          data-aos="fade-up"
          data-aos-delay="400"
          id='custom-btn-about'
        >
          Saiba Mais
        </Link>
      </div>

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
                  Faça perguntas e compartilhe soluções. <i className="fa-solid fa-lightbulb"></i>
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Participe de discussões. <i className="fa-solid fa-comments"></i>
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Faça amizades. <i className="fa-solid fa-user-group"></i>
                </li>
              </ul>
              <div className='w-100 d-flex justify-content-md-start justify-content-center'>
                <Link to="/login" className="text-dark mt-4 fs-5 fw-semibold py-2 d-flex align-items-center text-decoration-none gap-1 rounded-5" id="custom-btn-init">
                <span className='ps-4 '>Integre-se</span> <div className='px-2'><i className="fa-solid fa-circle-arrow-right p-1 fs-3" ></i></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
