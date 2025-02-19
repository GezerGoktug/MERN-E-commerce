import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.scss";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ScrollTop from "./ScrollTop.tsx";

const queryClient = new QueryClient();

interface IError {
  path: string;
  hostName: string;
  createdAt: Date;
  errorMessage: string | Record<string, string[]>;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<{ error: IError }>;
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {/* <SessionProvider> */}
      <ScrollTop>
        <App />
      </ScrollTop>
      {/* </SessionProvider> */}
    </BrowserRouter>
  </QueryClientProvider>
);
