import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScannerPage from './pages/Scanner'; // <--- Import this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<ScannerPage />} /> {/* <--- Add Route */}
      </Routes>
    </Router>
  );
}

export default App;