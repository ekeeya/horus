// ** Icons Import
import { GrAtm } from "react-icons/gr";
import { TfiWallet } from "react-icons/tfi";
import {CiBoxList, CiShop} from "react-icons/ci";
import {GiBuyCard, GiMoneyStack, GiReceiveMoney, GiShoppingCart, GiTakeMyMoney, GiTwoCoins} from "react-icons/gi";
import {FaRegHandshake} from "react-icons/fa6";
import {BiMoney} from "react-icons/bi";
export default [
  {
    header: 'FINANCES & REPORTS'
  },
  {
    id: 'finance',
    title: 'Finances',
    icon: <BiMoney size={20} />,
    children: [
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
      }
    ]
  },
  {
    id: 'transactions',
    title: 'Transactions',
    icon: <CiBoxList size={20} />,
    children: [
      {
        id: 'collections',
        title: 'Collections',
        icon: <GiReceiveMoney size={12} />,
        navLink: '/transactions/collections'
      },
      {
        id: 'payments',
        title: 'Payments',
        icon: <GiBuyCard size={12} />,
        navLink: '/transactions/payments'
      },
      {
        id: 'commissions',
        title: 'Commissions',
        icon: <GiTakeMyMoney size={12}/>,
        navLink: '/transactions/commissions'
      },
      {
        id: 'withdraws',
        title: 'Withdraws',
        icon: <GiMoneyStack size={20} />,
        navLink: '/transactions/withdraws'
      },
    ]
  },

]
