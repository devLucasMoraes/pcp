import {
  IconAlertHexagon,
  IconAsset,
  IconBinaryTree,
  IconClipboardList,
  IconLayoutDashboard,
  IconPencilCheck,
  IconSettings,
  IconSubtask,
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
    title: 'Apontamentos',
    icon: IconPencilCheck,
    href: '/apontamentos',
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
    id: uuidv4(),
    title: 'Rotinas de tarefas',
    icon: IconSubtask,
    href: '/rotinas',
  },
  {
    id: uuidv4(),
    title: 'Equipamentos',
    icon: IconAsset,
    href: '/equipamentos',
  },
  {
    id: uuidv4(),
    title: 'Ordens de Produção',
    icon: IconClipboardList,
    href: '/ordens-producao',
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
