import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Root from "./components/Root";  
import Home from "./pages/Home";
import AddWorkday from "./pages/AddWorkday";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Workdays from "./pages/WorkdaysPage";
import WorkdayDetail from "./pages/WorkdayDetail";
import ResetPasswordRequestForm from "./pages/ResetPasswordRequestForm";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./pages/AdminPanel"
import usePageTracking from "./utils/usePageTracking";
import NotFoundPage from "./pages/NotFound";

function App() {
  const isAdmin = localStorage.getItem("role") === "admin";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,  
      children: [
        { path: "/", element: <Home /> },
        { path: "/addWorkDay", element: <AddWorkday /> },
        { path: "/allWorkDays", element: <Workdays /> },
        { path: "/register", element: <RegisterForm /> },
        { path: "/login", element: <LoginForm /> },
        { path: "/reset-password", element: <ResetPasswordRequestForm /> },
        { path: "/resetPassword", element: <ResetPassword /> },
        { path: "/allWorkDays/:id", element: <WorkdayDetail /> },
        {
          path: "/admin",
          element: isAdmin ? <AdminPanel /> : <Navigate to="/" />,
        },
        {path: "*" , element: <NotFoundPage />}
      ],
    },
  ]);

  return (
    <RouterProvider router={router}>
      <RootWithTracking />
    </RouterProvider>
  );
}

function RootWithTracking() {
  usePageTracking();  
  return <Root />;  
}

export default App;
