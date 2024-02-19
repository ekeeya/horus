// ** Icons Import
import {FaPersonCirclePlus} from "react-icons/fa6"
import {IoMdPersonAdd} from "react-icons/io"
import {Link2} from "react-feather";

export default [
    {
        header: 'Students & Parents',
        action:"manage",
        resource:"students"
    },

    {
        id: 'students',
        title: 'Register Students',
        icon: <FaPersonCirclePlus size={20} />,
        navLink: '/students/list',
        action:"manage",
        resource:"students"
    },
    {
        id: 'parents',
        title: 'Register Parents',
        icon:<IoMdPersonAdd size={20} />,
        navLink: '/parents/list',
        action:"manage",
        resource:"parents"
    },
    {
        id: 'requests',
        title: 'Link Requests',
        icon:<Link2 size={20} />,
        navLink: '/parents/links-requests',
        action:"manage",
        resource:"parents"
    }
]
