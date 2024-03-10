// ** Icons Import
import { GiReceiveMoney } from "react-icons/gi";
import { CiBoxList } from "react-icons/ci";
import { GiBuyCard } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
export default [
  {
    header: 'Reports'
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
        id: 'withdraws',
        title: 'Withdraws',
        icon: <GiMoneyStack size={20} />,
        navLink: '/transactions/withdraws'
      },
    ]
  },
]
