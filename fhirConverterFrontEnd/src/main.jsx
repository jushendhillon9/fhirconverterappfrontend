import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Login from "./Login.jsx"
import PatientPage from "./PatientPage.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
  },
  {
    path: '*',
    element: <Login />, // Catch-all route for non-existent routes
  },
  {
    path: '/convertPage',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>
  },
  {
    path: "/patientPage",
    element: <PatientPage />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
