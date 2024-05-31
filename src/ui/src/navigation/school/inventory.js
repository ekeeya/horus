// ** Icons Import
import { CiBank } from "react-icons/ci";
import { MdOutlinePointOfSale } from "react-icons/md";
import { MdOutlineAddToPhotos } from "react-icons/md";
import {FaRegHandshake} from "react-icons/fa6";
import {GiTwoCoins} from "react-icons/gi";

export default [
  {
    header: 'INVENTORY'
  },

  {
    id: 'inventory',
    title: 'Inventory',
    icon: <CiBank size={20} />,
    children: [
      {
        id: 'list',
        title: 'Products',
        icon: <MdOutlineAddToPhotos size={12} />,
        navLink: '/inventory/items',
        action:"manage",
        resource:"inventory",
      },
      {
        id: 'orders',
        title: 'Orders',
        icon: <FaRegHandshake size={12} />,
        navLink: '/orders/list',
        action:"manage",
        resource:"inventory",
      },
      {
        id: 'sales',
        title: 'Sales',
        icon: <GiTwoCoins size={12} />,
        navLink: '/sales/list',
        action:"manage",
        resource:"inventory",
      }
    ]
  }
]
