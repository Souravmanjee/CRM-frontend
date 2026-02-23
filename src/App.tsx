import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { BusinessSetup } from './pages/BusinessSetup';
import { Work } from './pages/Work';
import { Diesel } from './pages/Diesel';
import { Petrol } from './pages/Petrol';
import { Labour } from './pages/Labour';
import { Ration } from './pages/Ration';
import { Extra } from './pages/Extra';
import { CashRegister } from './pages/CashRegister';
import { Staff } from './pages/Staff';
import { BusinessProfile } from './pages/BusinessProfile';
import { Reports } from './pages/Reports';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/setup" element={<BusinessSetup />} />
          <Route path="/" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
          <Route path="/work" element={<Layout title="Work"><Work /></Layout>} />
          <Route path="/staff" element={<Layout title="Staff"><Staff /></Layout>} />
          <Route path="/diesel" element={<Layout title="Diesel"><Diesel /></Layout>} />
          <Route path="/petrol" element={<Layout title="Petrol"><Petrol /></Layout>} />
          <Route path="/labour" element={<Layout title="Labour"><Labour /></Layout>} />
          <Route path="/ration" element={<Layout title="Ration"><Ration /></Layout>} />
          <Route path="/extra" element={<Layout title="Extra Expense"><Extra /></Layout>} />
          <Route path="/cash-register" element={<Layout title="Cash Register"><CashRegister /></Layout>} />
          <Route path="/reports" element={<Layout title="Reports & Exports"><Reports /></Layout>} />
          <Route path="/settings" element={<Layout title="Settings"><BusinessProfile /></Layout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
