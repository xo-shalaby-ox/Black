import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Layout from "./Components/layout/Layout";
import CartContextProvider from "./Context/cartContext/CartContext";
import UserContextProvider from "./Context/userContext/UserContext";
import WishlistContextProvider from "./Context/wishlistContext/WishlistContext";
import Login from "./Pages/Authentication/login/Login";
import Signup from "./Pages/Authentication/signup/Signup";
import Home from "./Pages/home/Home";
import NotFound from "./Pages/NotFound/NotFound";

let query = new QueryClient();
let Routing = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <CartContextProvider>
            <WishlistContextProvider>
              <RouterProvider router={Routing}></RouterProvider>
              <Toaster richColors />
            </WishlistContextProvider>
          </CartContextProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
