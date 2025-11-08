import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuDrawer from "./components/MenuDrawer";
import Home from "./pages/Home";
import About from "./pages/About";
import Advocacy from "./pages/Advocacy";
import Programs from "./pages/Programs";
import Research from "./pages/Research";
import Integrity from "./pages/Integrity";
import Mandate from "./pages/Mandate";
import TakeAction from "./pages/TakeAction";
import Newsroom from "./pages/Newsroom";
import ArticlePage from "./pages/ArticlePage";
import Donate from "./pages/Donate";
import DonorRelations from "./pages/DonorRelations";
import Volunteer from "./pages/Volunteer";
import TestPage from "./pages/TestPage";
import Membership from "./pages/Membership";
import Partner from "./pages/Partner";
import Publications from "./pages/Publications";
import DocumentsAssistant from "./pages/DocumentsAssistant";
import ExecutivesPortal from "./pages/ExecutivesPortal";
import NotFound from "./pages/NotFound";
import ExecutiveLeadership from "./pages/ExecutiveLeadership";
import SearchResults from "./pages/SearchResults";
import { SearchProvider } from "./context/SearchContext";

const GlobalStyle = createGlobalStyle`
  body, h1, h2, h3, h4, h5, h6, p, a, span, div, li, label, input, th, td {
    /* color: #002147; */ /* Removed this line */
  }
  body {
    font-family: 'Georgia', 'Times New Roman', Times, serif;
    background: #e6f0fa;
    margin: 0;
    padding: 0;
  }
`;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <SearchProvider>
        <GlobalStyle />
        {!menuOpen && <Header onMenuClick={() => setMenuOpen(true)} />}
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/advocacy" element={<Advocacy />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/research" element={<Research />} />
            <Route path="/Publications" element={<Publications />} />
            <Route
              path="/Membership"
              element={<Membership menuOpen={menuOpen} />}
            />
            <Route path="/integrity" element={<Integrity />} />
            <Route path="/mandate" element={<Mandate />} />
            <Route path="/take-action" element={<TakeAction />} />
            <Route path="/newsroom" element={<Newsroom />} />
            <Route path="/newsroom/:id" element={<ArticlePage />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/donor-relations" element={<DonorRelations />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/partner" element={<Partner />} />
            <Route
              path="/documents-assistant"
              element={<DocumentsAssistant />}
            />
            <Route path="/executives-login" element={<ExecutivesPortal />} />
            <Route path="/leadership" element={<ExecutiveLeadership />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </SearchProvider>
    </Router>
  );
}

export default App;
