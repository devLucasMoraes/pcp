import {
  IconAlertHexagon,
  IconBinaryTree,
  IconLayoutDashboard,
  IconSettings,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uuidv4(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uuidv4(),
    title: 'Ocorrências',
    icon: IconAlertHexagon,
    href: '/ocorrencias',
  },
  {
    id: uuidv4(),
    title: 'Operadores',
    icon: IconUserCog,
    href: '/operadores',
  },
  {
    navlabel: true,
    subheader: 'Administração',
  },
  {
    id: uuidv4(),
    title: 'Usuários',
    icon: IconUsers,
    href: '/users',
  },
  {
    id: uuidv4(),
    title: 'Organizações',
    icon: IconBinaryTree,
    href: '/organizations',
  },
  {
    id: uuidv4(),
    title: 'Configurações',
    icon: IconSettings,
    href: '/settings',
  },
]

export default Menuitems
