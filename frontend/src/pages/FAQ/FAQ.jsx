import { useEffect } from "react";

export default function FAQ() {

  useEffect (() => {

    document.title = 'UniverCity | Nosso FAQ'

  }, [])

  return (
    <>
      <div className="container my-5">
        <h1 className="text-center mb-4">FAQ - UniverCity</h1>
        <p className="text-center text-muted">
          Bem-vindo à seção de Perguntas Frequentes da UniverCity, a rede social onde estudantes compartilham dúvidas, reclamações e experiências sobre suas instituições.
        </p>

        <div className="accordion" id="faqAccordion">
          {/* Pergunta 1 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                O que é a UniverCity?
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                A UniverCity é uma plataforma que funciona como o "ReclameAqui"
                dos estudantes, onde você pode tirar dúvidas, fazer reclamações
                e compartilhar comentários sobre universidades e instituições de
                ensino.
              </div>
            </div>
          </div>

          {/* Pergunta 2 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Como posso participar de uma comunidade?
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Para participar de uma comunidade, basta se registrar na
                plataforma e buscar pela sua universidade ou instituição no
                campo de universidades/comunidades. Você pode entrar e começar a interagir
                imediatamente.
              </div>
            </div>
          </div>

          {/* Pergunta 3 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Posso criar uma nova comunidade?
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Sim! Se sua universidade ainda não estiver cadastrada, você pode
                solicitar a criação de uma nova comunidade através de nosso <a className='link-dark' href="mailto:suporteconstsoft@gmail.com"> email</a>
                . Nossa equipe irá revisar e aprovar o pedido.
              </div>
            </div>
          </div>

          {/* Pergunta 4 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Como funciona a moderação de conteúdo?
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                A moderação de conteúdo é realizada tanto por nossa equipe
                quanto pela comunidade. Você pode denunciar conteúdos
                inadequados, que serão revisados pela nossa equipe. Também
                seguimos nossos <a className='link-dark' href="/termos-de-uso">Termos de Uso</a> e diretrizes
                da comunidade.
              </div>
            </div>
          </div>

          {/* Pergunta 5 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFive">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="false"
                aria-controls="collapseFive"
              >
                É gratuito para usar a UniverCity?
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="headingFive"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Sim, a UniverCity é gratuita para todos os usuários! Você pode
                participar de comunidades, tirar dúvidas e interagir sem custos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
