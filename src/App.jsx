import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cadastro from "./pages/Cadastro"
import Dashboard from "./pages/Dashboard"
import Verificacao from "./pages/Verificacao"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify/:id" element={<Verificacao />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
