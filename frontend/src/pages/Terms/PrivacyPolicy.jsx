import { useEffect } from "react";

export default function PrivacyPolicy() {  

  useEffect (() => {

    document.title = 'UniverCity | Política de privacidade'

  }, [])

  return (  
    <>  
      <div className="container my-5">  
        <h1 className="text-center mb-4">Política de Privacidade - UniverCity</h1>  
        <p className="text-muted text-center">  
          Última atualização: 28 de Dezembro de 2024  
        </p>  

        <div className="card p-4">  
          {/* Introdução */}  
          <section className="mb-4">  
            <h2 className="h5">1. Introdução</h2>  
            <p>  
              A sua privacidade é importante para nós. Esta Política de Privacidade  
              explica como coletamos, usamos e protegemos suas informações ao usar a  
              plataforma UniverCity.  
            </p>  
          </section>  

          {/* Informações Coletadas */}  
          <section className="mb-4">  
            <h2 className="h5">2. Informações Coletadas</h2>  
            <p>  
              Coletamos as seguintes informações ao utilizar nossa plataforma:  
            </p>  
            <ul>  
              <li>Informações de cadastro, como nome, e-mail e senha.</li>  
              <li>Dados de uso, como interações nas comunidades e reclamações feitas.</li>   
            </ul>  
          </section>  

          {/* Uso das Informações */}  
          <section className="mb-4">  
            <h2 className="h5">3. Uso das Informações</h2>  
            <p>  
              As informações coletadas são utilizadas para:  
            </p>  
            <ul>  
              <li>Personalizar sua experiência na plataforma.</li>  
              <li>Garantir a segurança e integridade do ambiente.</li>  
              <li>Enviar comunicações importantes, como atualizações de termos.</li>  
            </ul>  
          </section>  

          {/* Compartilhamento de Informações */}  
          <section className="mb-4">  
            <h2 className="h5">4. Compartilhamento de Informações</h2>  
            <p>  
              Não compartilhamos suas informações com terceiros, exceto:  
            </p>  
            <ul>  
              <li>Quando exigido por lei ou autoridade judicial.</li>  
              <li>Para proteção dos direitos e segurança de outros usuários.</li>  
            </ul>  
          </section>  

          {/* Segurança dos Dados */}  
          <section className="mb-4">  
            <h2 className="h5">5. Segurança dos Dados</h2>  
            <p>  
              Adotamos medidas técnicas e organizacionais para proteger suas informações  
              contra acesso não autorizado, perda ou destruição. No entanto, nenhum  
              sistema é totalmente seguro, e não podemos garantir a segurança absoluta.  
            </p>  
          </section>  

          {/* Cookies */}  
          <section className="mb-4">  
            <h2 className="h5">6. Cookies</h2>  
            <p>  
              Utilizamos cookies para melhorar sua experiência na plataforma, como lembrar  
              suas preferências e medir o desempenho do site. Você pode gerenciar os  
              cookies por meio das configurações do navegador.  
            </p>  
          </section>  

          {/* Alterações na Política */}  
          <section className="mb-4">  
            <h2 className="h5">7. Alterações na Política</h2>  
            <p>  
              Podemos atualizar esta Política de Privacidade para refletir mudanças na  
              plataforma ou requisitos legais. Informaremos sobre atualizações relevantes  
              por meio de notificações na plataforma.  
            </p>  
          </section>  

          {/* Contato */}  
          <section className="mb-4">  
            <h2 className="h5">8. Contato</h2>  
            <p>  
              Caso tenha dúvidas ou preocupações sobre esta Política de Privacidade, entre  
              em contato conosco pelo e-mail:  
              <a className='link-dark' href="mailto:suporteconstsoft@gmail.com"> suporteconstsoft@gmail.com</a>.  
            </p>  
          </section>  
        </div>  
      </div>  
    </>  
  );  
}  
