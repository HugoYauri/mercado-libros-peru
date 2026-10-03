import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}
