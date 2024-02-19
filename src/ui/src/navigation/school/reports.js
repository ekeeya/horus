// ** Icons Import
import { Circle} from 'react-feather'
import {FaFileInvoiceDollar, FaFileZipper, FaFileExcel, FaMoneyBill1Wave} from "react-icons/fa6"

export default [
  {
    header: 'Reports'
  },
 /* {
    id: 'financialReports',
    title: 'Financial Reports',
    icon: <FaFileInvoiceDollar size={20} />,
    children: [
      {
        id: 'input',
        title: 'Input',
        icon: <Circle size={12} />,
        navLink: '/forms/elements/input'
      },
      {
        id: 'inputGroup',
        title: 'Input Groups',
        icon: <Circle size={12} />,
        navLink: '/forms/elements/input-group'
      },
    ]
  },*/
  {
    id: 'transactions',
    title: 'Transactions',
    icon: <FaFileExcel size={20} />,
    children: [
      {
        id: 'collections',
        title: 'Collections',
        icon: <Circle size={12} />,
        navLink: '/transactions/collections'
      },
      {
        id: 'payments',
        title: 'Payments',
        icon: <Circle size={12} />,
        navLink: '/transactions/payments'
      },
      {
        id: 'withdraws',
        title: 'Withdraws',
        icon: <FaMoneyBill1Wave size={20} />,
        navLink: '/transactions/withdraws'
      },
    ]
  },
  /*{
    id: 'others',
    title: 'Other Reports',
    icon: <FaFileZipper size={20} />,

    navLink: '/forms/wizard'
  }*/
]
