// ** Icons Import
import { CiShop } from "react-icons/ci";
import { FaRegHandshake } from "react-icons/fa6";
import { GiShoppingCart } from "react-icons/gi";
import { GiTwoCoins } from "react-icons/gi";

export default [
  {
    header: 'INVENTORY'
  },

  {
    id: 'inventory',
    title: 'Inventory',
    icon: <CiShop size={20} />,
    children: [
      {
        id: 'list',
        title: 'Products',
        icon: <GiShoppingCart size={12} />,
        navLink: '/inventory/items',
        action:"manage",
        resource:"inventory",
      },
      {
        id: 'orders',
        title: 'Orders',
        icon: <FaRegHandshake size={12} />,
        navLink: '/inventory/orders/list',
        action:"manage",
        resource:"inventory",
      },
      {
        id: 'sales',
        title: 'Sales',
        icon: <GiTwoCoins size={12} />,
        navLink: '/inventory/sales/list',
        action:"manage",
        resource:"inventory",
      }
    ]
  }
]
