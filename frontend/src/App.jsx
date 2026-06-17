import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Authentication from "./pages/Auth";
import Profile from "./pages/Profile";
import AuthLoader from "./routes/AuthLoader";

function App() {
  return (
    <>
      <AuthLoader />
    </>
  );
}

export default App;
