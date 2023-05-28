import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../pages/signin";
import SignUp from "../pages/signup";
import Layout from "../layout/Layout";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import Main from "../components/Main";
import ETL from "../components/ETL";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            ),
          },
          {
            path: "etl",
            element: (
              <PrivateRoute>
                <ETL />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: "signin",
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
    ],
  },
]);
