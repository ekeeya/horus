// ** Icons Import
import { Mail, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, User, Shield } from 'react-feather'

export default [
  {
    header: 'SCHOOLS'
  },

  {
    id: 'users',
    title: 'Manage Schools',
    icon: <User size={20} />,
    children: [
      {
        id: 'list',
        title: 'List & Register',
        icon: <Circle size={12} />,
        navLink: '/schools/list',
        action:"manage",
        resource:"schools",
      },
      {
        id: 'pos_list',
        title: 'POS Management',
        icon: <Circle size={12} />,
        navLink: '/schools/pos/list',
        action:"manage",
        resource:"schools",
      }
    ]
  }
]
