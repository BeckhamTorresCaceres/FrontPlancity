import { AuthRoute } from "./features/auth/components/Guards/AuthRoute";
import LayoutHome from "./features/home/layouts/LayoutHome";
import { HomeRoute } from "./features/home/components/Guards/HomeRoute";
import { AdminRoute } from "./features/admin/components/Guards/AdminRoute";
import { AdminLayout } from "./features/admin/layouts/AdminLayout";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { CategoriesPage } from "./features/admin/pages/CategoriesPage";
import {
  ChangePasswordPage,
  ClientRoute,
  ClientLayout,
  ClientPage,
} from "./features/client";
import { createBrowserRouter } from "react-router";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutHome />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
      },
      {
        path: "auth",
        element: <AuthRoute />,
      },
    ],
  },
  {
    path: "/client",
    element: <ClientRoute />,
    children: [
      {
        path: "",
        element: <ClientLayout />,
        children: [
          {
            path: "",
            element: <ClientPage />,
          },
          {
            path: "favorites",
            element: <ClientPage />,
          },
          {
            path: "password",
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminPage />,
          },
          {
            path: "events",
            element: <AdminPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
        ],
      },
    ],
  },
]);
