import "./App.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ETLContext } from "./context/context.ts";
import { useState } from "react";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [auth, setAuth] = useState({
    username: "",
    email: "",
    userId: undefined,
  });
  const [currentlyLoadedFile, setCurrentlyLoadedFile] = useState([]);

  return (
    <ETLContext.Provider
      value={{
        auth,
        setAuth,
        currentlyLoadedFile,
        setCurrentlyLoadedFile,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      </QueryClientProvider>
    </ETLContext.Provider>
  );
}

export default App;
