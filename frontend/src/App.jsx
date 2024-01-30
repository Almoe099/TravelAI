import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import Notes from './components/Notes/Notes';
import Profile from './components/Profile/Profile';
import NoteCompose from './components/Notes/NoteCompose';
import CreateTrip from './components/Trips/CreateTrip';

import { getCurrentUser } from './store/session';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AuthRoute component={MainPage} />
      },
      // {
      //   path: "home",
      //   element: <ProtectedRoute component={HomePage} />
      // },
      {
        path: "login",
        element: <AuthRoute component={LoginForm} />
      },
      {
        path: "signup",
        element: <AuthRoute component={SignupForm} />
      },
      {
        path: "notes",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ProtectedRoute component={Notes} />
          },
          {
            path: "new",
            element: <ProtectedRoute component={NoteCompose} />
          }
        ]
      },
      {
        path: "profile",
        element: <ProtectedRoute component={Profile} />
      },
      {
        path: "trips",
        element: <CreateTrip />
      }

    ]
  }
]);

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).finally(() => setLoaded(true));
  }, [dispatch]);
  
  return loaded && <RouterProvider router={router} />;
}

export default App;
