// ** Icons Import
import {IoLogInOutline, IoPeople} from "react-icons/io5"

export default [
  {
    header: 'Access'
  },
  {
    id: 'user_accounts',
    title: 'User Accounts',
    icon: <IoPeople size={20} />,
    navLink: '/apps/user/list'
  },
  {
    id: 'logout',
    title: 'Log Out',
    icon: <IoLogInOutline size={20} />,
    navLink: '/charts/chartjs'
  }
]
