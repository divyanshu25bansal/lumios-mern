import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Authentication from "./pages/Auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Authentication />} />
      <Route path="/signup" element={<Authentication />} />
    </Routes>
  );
}

export default App;
