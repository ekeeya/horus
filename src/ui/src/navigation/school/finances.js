// ** Icons Import
import { GrAtm } from "react-icons/gr";
import {TfiWallet} from "react-icons/tfi";
export default [
  {
    header: 'Finances'
  },
  {
    id: 'withdraw-requests',
    title: 'Withdraw Requests',
    icon: <GrAtm size={20} />,
    navLink: '/finance/withdraws-requests'
  },
  {
    id: 'accounts',
    title: 'Virtual Accounts',
    icon: <TfiWallet size={20} />,
    navLink: '/finance/virtual-accounts'
  },

]
