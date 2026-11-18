import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./routes";
import { PolicyNotice, SensorRuntime } from "./components/SensorRuntime";
import AuthGate from "./components/AuthGate";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthGate>
      <ScrollToTop />
      <SensorRuntime />
      <PolicyNotice />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthGate>
  );
}
