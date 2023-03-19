import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "antd/dist/antd.css";
import MainPage from "./pages/MainPage";
import CoursePage from "./pages/CoursePage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage key="main" />} />
            <Route path="/:id" element={<CoursePage />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </div>
  );
}

export default App;
