import {Link} from 'react-router-dom'

export default function LandingPage() {

  return (
    <div>
      <header className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Bem-vindo à UniverCity!</h1>
          <p className="lead">
            Conecte-se, colabore e faça parte de algo incrível. Junte-se agora!
          </p>
          <Link to='/faq' className="btn btn-light btn-lg mt-3">Saiba Mais</Link>
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
