import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import Navbar from './layout/Navbar/Navbar'
import Footer from './layout/Footer/Footer'
import Home from './pages/Home/Home'
import FAQ from './pages/FAQ/FAQ'
import TermsOfUse from './pages/Terms/TermsOfUse'
import PrivacyPolicy from './pages/Terms/PrivacyPolicy'
import Login from './pages/Auth/LoginRegisterForm/Login'
import Register from './pages/Auth/LoginRegisterForm/Register'
import Profile from './pages/Auth/ProfileAccount/Profile'
import Account from './pages/Auth/ProfileAccount/Account'
import Search from './pages/Communities/Search/Search'
import Communities from './pages/Communities/Community/Communities'
import Community from './pages/Communities/Community/Community'
import CreateCommunity from './pages/Communities/Community/CreateCommunity'
import EditDeleteCommunity from './pages/Communities/Community/EditDeleteCommunity';
import Question from './pages/Communities/Posts/Questions/Question'
import CreateQuestion from './pages/Communities/Posts/Questions/CreateQuestion'
import EditDeleteQuestion from './pages/Communities/Posts/Questions/EditDeleteQuestion'
import Reclamation from './pages/Communities/Posts/Reclamations/Reclamation'
import CreateReclamation from './pages/Communities/Posts/Reclamations/CreateReclamation'
import EditDeleteReclamation from './pages/Communities/Posts/Reclamations/EditDeleteReclamation'
import LandingPage from './pages/LandingPage/LandingPage'
import Error404 from './pages/Errors/Error404'
import Error500 from './pages/Errors/Error500';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

function App() {

  return (
    <Router>

      <Navbar />

        <Routes>
          <Route path='/404' element={<Error404 />} />
          <Route path='/500' element={<Error500 />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/feed' element={<Home />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/termos-de-uso' element={<TermsOfUse />} />
          <Route path='/politica-de-privacidade' element={<PrivacyPolicy />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<Register />} />
          <Route path='/perfil/:slug' element={<Profile />} />
          <Route path='/conta' element={<Account />} />
          <Route path='/resultados' element={<Search />} />
          <Route path='/comunidades' element={<Communities />} />
          <Route path='/comunidades/criar' element={<CreateCommunity />} /> {/* LOGIN | ADMIN */}
          <Route path='/comunidades/:slug' element={<Community />} />
          <Route path='/comunidades/:slug/editar/' element={<EditDeleteCommunity />} /> {/* LOGIN | ADMIN */}
          <Route path='/comunidades/:slug/pergunta/:question_slug' element={<Question />} />
          <Route path='/comunidades/:slug/pergunta/criar' element={<CreateQuestion />} />
          <Route path='/comunidades/:slug/:profile_slug/pergunta/:question_slug/editar' element={<EditDeleteQuestion />} />
          <Route path='/comunidades/:slug/reclamacao/:reclamation_slug' element={<Reclamation />} />
          <Route path='/comunidades/:slug/reclamacao/criar' element={<CreateReclamation />} />
          <Route path='/comunidades/:slug/:profile_slug/reclamacao/:reclamation_slug/editar' element={<EditDeleteReclamation />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

      <Footer />

    </Router>
  )
}

export default App