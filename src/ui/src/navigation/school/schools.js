// ** Icons Import
import { ShoppingCart } from 'react-feather'
import {MdPointOfSale} from "react-icons/md";

export default [
  {
    header: 'POINT OF SALES'
  },

  {
    icon: <MdPointOfSale size={20} />,
    id: 'pos_list',
    title: 'POS Management',
    navLink: '/schools/pos/list',
    action:"manage",
    resource:"schools",
  }
]
