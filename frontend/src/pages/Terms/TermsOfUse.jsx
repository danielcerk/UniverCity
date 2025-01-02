import { useEffect } from "react";

import { Link } from "react-router-dom";

export default function TermsOfUse() {

  useEffect (() => {

    document.title = 'UniverCity | Termos de Uso'

  }, [])

  return (
    <>
      <div className="container my-5">
        <h1 className="text-center mb-4">Termos de Uso - UniverCity</h1>
        <p className="text-muted text-center">
          Última atualização: 28 de Dezembro de 2024
        </p>

        <div className="card p-4">
          {/* Introdução */}
          <section className="mb-4">
            <h2 className="h5">1. Introdução</h2>
            <p>
              Bem-vindo à UniverCity, uma rede social voltada para estudantes que
              permite interagir em comunidades de suas universidades, compartilhar
              dúvidas, reclamações e experiências. Ao utilizar a plataforma,
              você concorda com os termos descritos abaixo. Leia atentamente.
            </p>
          </section>

          {/* Uso da Plataforma */}
          <section className="mb-4">
            <h2 className="h5">2. Uso da Plataforma</h2>
            <p>
              UniverCity é um espaço para compartilhamento de informações sobre
              universidades e instituições de ensino. Você deve usar a plataforma
              de forma respeitosa, evitando qualquer tipo de conteúdo ofensivo,
              discriminatório ou que viole leis aplicáveis.
            </p>
          </section>

          {/* Conteúdo Gerado pelo Usuário */}
          <section className="mb-4">
            <h2 className="h5">3. Conteúdo Gerado pelo Usuário</h2>
            <p>
              Ao publicar conteúdo na UniverCity, você declara que possui os
              direitos necessários para compartilhá-lo. Não é permitido publicar
              materiais protegidos por direitos autorais sem permissão.
            </p>
            <p>
              Qualquer conteúdo que viole nossas políticas poderá ser removido,
              e sua conta estará sujeita a penalidades.
            </p>
          </section>

          {/* Moderação de Conteúdo */}
          <section className="mb-4">
            <h2 className="h5">4. Moderação de Conteúdo</h2>
            <p>
              Para manter um ambiente seguro, realizamos a moderação de conteúdo
              com base em denúncias e revisões regulares. Reservamo-nos o direito
              de remover publicações que violem estes Termos de Uso ou nossas
              Diretrizes da Comunidade.
            </p>
          </section>

          {/* Privacidade */}
          <section className="mb-4">
            <h2 className="h5">5. Privacidade</h2>
            <p>
              Respeitamos sua privacidade. Todas as informações coletadas são
              tratadas conforme nossa <Link className='link-dark' to="/politica-de-privacidade">Política de Privacidade</Link>. 
              Ao usar a plataforma, você concorda com o uso de seus dados conforme 
              descrito na política.
            </p>
          </section>

          {/* Responsabilidades do Usuário */}
          <section className="mb-4">
            <h2 className="h5">6. Responsabilidades do Usuário</h2>
            <p>
              Você é responsável pelas informações e conteúdos que publica. Ao
              utilizar a UniverCity, você concorda em:
            </p>
            <ul>
              <li>Evitar linguagem ofensiva ou discriminatória.</li>
              <li>Não publicar conteúdo ilegal ou que viole direitos de terceiros.</li>
              <li>Respeitar as Diretrizes da Comunidade.</li>
            </ul>
          </section>

          {/* Alterações nos Termos */}
          <section className="mb-4">
            <h2 className="h5">7. Alterações nos Termos</h2>
            <p>
              A UniverCity pode atualizar estes Termos de Uso a qualquer momento.
              Notificaremos você sobre mudanças significativas por meio de nossa
              plataforma ou pelo seu e-mail cadastrado.
            </p>
          </section>

          {/* Contato */}
          <section className="mb-4">
            <h2 className="h5">8. Contato</h2>
            <p>
              Caso tenha dúvidas ou preocupações sobre estes Termos de Uso, entre
              em contato conosco pelo e-mail: <a className='link-dark' href="mailto:suporteconstsoft@gmail.com">suporteconstsoft@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
