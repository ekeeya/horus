// ** Icons Import
import { CiBank } from "react-icons/ci";
import { MdOutlinePointOfSale } from "react-icons/md";
import { MdOutlineAddToPhotos } from "react-icons/md";

export default [
  {
    header: 'SCHOOLS'
  },

  {
    id: 'users',
    title: 'Schools & POS',
    icon: <CiBank size={20} />,
    children: [
      {
        id: 'list',
        title: 'List & Register',
        icon: <MdOutlineAddToPhotos size={12} />,
        navLink: '/schools/list',
        action:"manage",
        resource:"schools",
      },
      {
        id: 'pos_list',
        title: 'Manage POS',
        icon: <MdOutlinePointOfSale size={12} />,
        navLink: '/schools/pos/list',
        action:"manage",
        resource:"schools",
      }
    ]
  }
]
