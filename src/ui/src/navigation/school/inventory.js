// ** Icons Import
import { CiBank } from "react-icons/ci";
import { MdOutlinePointOfSale } from "react-icons/md";
import { MdOutlineAddToPhotos } from "react-icons/md";

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
        icon: <MdOutlinePointOfSale size={12} />,
        navLink: '/schools/pos/list',
        action:"manage",
        resource:"inventory",
      },
      {
        id: 'sales',
        title: 'Sales',
        icon: <MdOutlinePointOfSale size={12} />,
        navLink: '/schools/pos/list',
        action:"manage",
        resource:"inventory",
      }
    ]
  }
]
