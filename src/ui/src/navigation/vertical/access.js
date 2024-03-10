// ** Icons Import
import {IoLogInOutline} from "react-icons/io5"
import { RiUserSettingsLine } from "react-icons/ri";

export default [
  {
    header: 'Access'
  },
  {
    id: 'user_accounts',
    title: 'User Accounts',
    icon: <RiUserSettingsLine size={20} />,
    navLink: '/apps/user/list'
  },
  {
    id: 'logout',
    title: 'Log Out',
    icon: <IoLogInOutline size={20} />,
    navLink: '/charts/chartjs'
  }
]
