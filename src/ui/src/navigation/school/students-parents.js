// ** Icons Import
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { PiUsersFourLight } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";

export default [
    {
        header: 'Students & Parents',
        action:"manage",
        resource:"students"
    },

    {
        id: 'students',
        title: 'Students',
        icon: <PiUsersFourLight size={20} />,
        navLink: '/students/list',
        action:"manage",
        resource:"students"
    },
    {
        id: 'parents',
        title: 'Parents',
        icon:<MdOutlineFamilyRestroom size={20} />,
        navLink: '/parents/list',
        action:"manage",
        resource:"parents"
    },
    {
        id: 'requests',
        title: 'Contributor Requests',
        icon:<GiTakeMyMoney size={20} />,
        navLink: '/parents/links-requests',
        action:"manage",
        resource:"parents"
    }
]
