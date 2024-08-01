// ** Icons Import
import { CiBank } from "react-icons/ci";
import { MdOutlinePointOfSale } from "react-icons/md";
import { MdOutlineAddToPhotos } from "react-icons/md";
import {FaRegHandshake} from "react-icons/fa6";
import {GiTwoCoins} from "react-icons/gi";
import {BsFileBarGraph, BsFileExcel, BsPieChart} from "react-icons/bs";
import {GrDocumentExcel} from "react-icons/gr";
import {BiPieChartAlt} from "react-icons/bi";
import {AiOutlineBarChart} from "react-icons/ai";

export default [
  {
    header: 'INVENTORY',
    action:"manage",
    resource:"inventory",
  },
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
  },
  {
    id: 'sales-report',
    title: 'Daily Sales Summary',
    icon: <AiOutlineBarChart size={12} />,
    navLink: '/sales/report',
    action:"manage",
    resource:"inventory",
  }
]
