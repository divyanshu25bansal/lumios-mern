import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Authentication from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Authentication />} />
      <Route path="/signup" element={<Authentication />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
