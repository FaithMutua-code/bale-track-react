import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BaleTrack from "./BaleTrack";
import {createBrowserRouter, Route, Routes} from 'react-router-dom'
import AuthForm from "./Components/Login";
import Profile from "./Components/Profile";

const queryClient = new QueryClient();



// In App.jsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/profile" element={<Profile />} />
        
          <Route path="/" element={<BaleTrack />} />
        
      </Routes>
    </QueryClientProvider>
  );
}

export default App
