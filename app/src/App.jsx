import { Routes, Route } from "react-router-dom";
import { Dashboard, Auth, Welcome } from "@/layouts";
import { Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "@/components/PrivateRoute";
import { Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useAuth();
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={(currentUser && currentUser.session) ? <Navigate to={"/dashboard/home"} /> : <Welcome />} />
          <Route exact path="/dashboard/*" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={(currentUser && currentUser.session) ? <Navigate to="/dashboard/home" /> : <Auth />} />
        </Routes>

      </QueryClientProvider>
      <ToastContainer position="bottom-right" autoClose="3000" theme="colored" transition={Bounce} pauseOnHover />
    </div>
  );
}

export default App;
