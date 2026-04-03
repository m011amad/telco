import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Telco from "./Telco.jsx";
import PhonePlans from "./Components/PhonePlans.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPlans from "./Components/AdminPlans.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Telco />
                <PhonePlans />
              </>
            }
          />
          <Route path="/admin" element={<AdminPlans />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
