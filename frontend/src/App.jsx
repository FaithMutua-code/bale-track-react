import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BaleTrack from "./BaleTrack";
import { Route, Routes} from 'react-router-dom'
import { ToastContainer} from "react-toastify";
import FeedbackForm from "./Components/FeebackForm";



const queryClient = new QueryClient();



// In App.jsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Routes>
        
        
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/" element={<BaleTrack />} />
        
      </Routes>
    </QueryClientProvider>
  );
}

export default App
