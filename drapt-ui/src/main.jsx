import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; // Use the modern quartz theme
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
