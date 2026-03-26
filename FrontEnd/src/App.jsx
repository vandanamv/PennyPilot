import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import Outlet from "./pages/Outlet";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route path="/logedin" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Outlet />} />
      </Routes>
    </Router>
  );
}

export default App;
