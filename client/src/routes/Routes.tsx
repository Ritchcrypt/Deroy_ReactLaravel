import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "./path";
import { ProtectedRoute, GuestRoute, RoleRoute } from "./guards";
import RootLayout from "./RootLayout";
import ActivityLogs from "../pages/ActivityLogs";

// Lazy Loading
const Login = React.lazy(() => import("../pages/auth/Login"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const Users = React.lazy(() => import("../pages/users/Users"));
const ViewUserDetail = React.lazy(() => import("../pages/users/components/ViewUserDetail"));

export const Routes = createBrowserRouter([
  {
    // Root layout — provides AuthProvider to all child routes
    element: <RootLayout />,
    children: [

      // Guest Only (redirects to dashboard if already logged in)
      {
        element: <GuestRoute />,
        children: [
          {
            path: PATHS.HOME,
            element: <Navigate to={PATHS.LOGIN} replace />,
          },
          {
            path: PATHS.LOGIN,
            element: <Login />,
          },
        ],
      },

      // Authenticated (redirects to login if not logged in)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATHS.APP.ROOT,
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.APP.DASHBOARD} replace />,
              },
              {
                path: PATHS.APP.DASHBOARD,
                element: <Dashboard />,
              },

              // Admin Only
              {
                element: <RoleRoute allowedRoles={['admin']} />,
                children: [
                  {
                    path: PATHS.APP.USERS,
                    element: <Users />,
                  },
                  {
                    path: PATHS.APP.USER_DETAIL,
                    element: <ViewUserDetail />,
                  },
                  {
                    path: "/app/activity-logs",
                    element: <ActivityLogs />,
                  },
                ],
              },
            ],
          },
        ],
      },

    ],
  },
]);