import Navbar from './components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeroSection from './pages/HeroSection';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import StorePage from "./pages/StorePage";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./services/ProtectedRoute.jsx";
import Footer from "./components/Footer.jsx" // ✅ import ProtectedRoute

function App() {
  return (
    <>
    
      <Navbar />
      <Routes>
        {/* Home route */}
        <Route path="/" element={
          <>
            <HeroSection />
            <Home />
            
          </>
        } />

        {/* Login & Register routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route
          path="/store"
          element={
            <ProtectedRoute requiredRole="admin">
              <StorePage />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
