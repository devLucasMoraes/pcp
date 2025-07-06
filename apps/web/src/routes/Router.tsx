import { lazy } from 'react'
import { Navigate } from 'react-router'

import Loadable from '../layouts/full/shared/Loadable'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')))
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')))

/* ****Private Pages***** */
const Dashboard = Loadable(lazy(() => import('../page/dashboard/Dashboard')))
const Settings = Loadable(lazy(() => import('../page/settings/Settings')))
const Users = Loadable(lazy(() => import('../page/users/Users')))
const Organizations = Loadable(
  lazy(() => import('../page/organizations/Organizations')),
)
const Ocorrencias = Loadable(
  lazy(() => import('../page/ocorrencias/Ocorrencias')),
)
const Operadores = Loadable(lazy(() => import('../page/operadores/Operadores')))
const OrdensProducao = Loadable(
  lazy(() => import('../page/ordens-producao/OrdensProducao')),
)
const Rotinas = Loadable(lazy(() => import('../page/rotinas/Rotinas')))
const Equipamentos = Loadable(
  lazy(() => import('../page/equipamentos/Equipamentos')),
)
const Apontamentos = Loadable(
  lazy(() => import('../page/apontamentos/Apontamentos')),
)

/* ****Public Pages***** */
const Register = Loadable(lazy(() => import('../page/authentication/Register')))
const Login = Loadable(lazy(() => import('../page/authentication/Login')))

const Error = Loadable(lazy(() => import('../page/Error')))

const Router = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <FullLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" /> },
          { path: '/dashboard', exact: true, element: <Dashboard /> },
          { path: '/settings', exact: true, element: <Settings /> },
          { path: '/users', exact: true, element: <Users /> },
          { path: '/organizations', exact: true, element: <Organizations /> },
          { path: '/ocorrencias', exact: true, element: <Ocorrencias /> },
          { path: '/operadores', exact: true, element: <Operadores /> },
          {
            path: '/ordens-producao',
            exact: true,
            element: <OrdensProducao />,
          },
          { path: '/rotinas', exact: true, element: <Rotinas /> },
          { path: '/equipamentos', exact: true, element: <Equipamentos /> },
          { path: '/apontamentos', exact: true, element: <Apontamentos /> },
        ],
      },
    ],
  },
  {
    path: '/organizations/:orgSlug',
    element: <PrivateRoute />,
    children: [
      {
        path: '/organizations/:orgSlug',
        element: <FullLayout />,
        children: [
          // Redirecionar para dashboard da organização
          { path: '', element: <Navigate to="dashboard" replace /> },

          // Páginas da organização
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'settings', element: <Settings /> },
          { path: 'users', element: <Users /> },
          { path: 'organizations', element: <Organizations /> },
          { path: 'ocorrencias', element: <Ocorrencias /> },
          { path: 'operadores', element: <Operadores /> },
          { path: 'ordens-producao', element: <OrdensProducao /> },
          { path: 'rotinas', element: <Rotinas /> },
          { path: 'equipamentos', element: <Equipamentos /> },
          { path: 'apontamentos', element: <Apontamentos /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        path: '/auth',
        element: <BlankLayout />,
        children: [
          { path: 'register', element: <Register /> },
          { path: 'login', element: <Login /> },
        ],
      },
    ],
  },
  {
    path: '/auth/404',
    element: <Error />,
  },
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  },
]

export default Router
