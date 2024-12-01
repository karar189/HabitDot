/* eslint-disable */
// @ts-nocheck

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Explore from "./pages/Explore/ChallengeExplore.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import UserDashboard from "./pages/UserDashboard/UserDashboard.tsx";
import Layout from "./Layout.tsx";
import { AuthProvider } from "./context/authContext.tsx";

const ProtectedRoute = ({ children }: any) => {
  // const { loggedIn } = useUserStore();

  return true ? (
    <Layout>{children}</Layout>
  ) : (
    <Layout showAppbar={false}>
      <App />
    </Layout>
  );
};

const UnProtectedRoute = ({ children }: any) => {
  return <Layout>{children}</Layout>;
};

const UnProtectedRouteWithoutAppBar = ({ children }: any) => {
  return <Layout showAppbar={false}>{children}</Layout>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/explore",
    element: (
      <UnProtectedRoute>
        <Explore />
      </UnProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <UnProtectedRouteWithoutAppBar>
        <Signup />
      </UnProtectedRouteWithoutAppBar>
    ),
  },
  {
    path: "/profile",
    element: (
      <UnProtectedRoute>
        <UserDashboard />
      </UnProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
