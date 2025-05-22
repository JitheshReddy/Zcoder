import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionsList from "./pages/QuestionsList";
import QuestionPage from "./pages/QuestionPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/NavBar";
import Profile from "./pages/Profile";
import MySubmissions from "./pages/MySubmissions";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import FunPage from "./pages/FunPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/questions" element={<QuestionsList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/questions/:questionId" element={<QuestionPage />} />
        <Route path="/my-submissions/:questionId" element={<MySubmissions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-submissions" element={<MySubmissionsPage />} />
        <Route path="/my-submissions/:questionId" element={<SubmissionDetailsPage />} />
        <Route path="/" element={<FunPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
