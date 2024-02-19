// ** React Imports
import {Link} from 'react-router-dom'

// ** Store & Actions
import {store} from '@store/store'
import {getUser, deleteUser} from '../store'

// ** Icons Imports
import {FileText} from 'react-feather'

// ** Reactstrap Imports
import {Badge, UncontrolledTooltip} from 'reactstrap'
import Avatar from "@components/avatar";

// ** Renders Client Columns
// ** Renders Role Columns
const statusObj = {
    SUSPENDED: 'light-warning',
    ACTIVE: 'light-success',
    "IN ACTIVE": 'light-secondary'
}

const renderAvatar = row => {
    if (row.image) {
        return <Avatar className='me-1' img={row.image} width='32' height='32'/>
    } else {
        return (
            <Avatar
                initials
                className='me-1'
                color={row.avatarColor || 'light-primary'}
                content={row.fullName || 'John Doe'}
            />
        )
    }
}
export const columns = [
    {
        name: 'User',
        sortable: true,
        minWidth: '280px',
        sortField: 'fullName',
        selector: row => row.fullName,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                {renderAvatar(row)}
                <div className='d-flex flex-column'>
                    <Link
                        to={`/apps/parents/view/${row.id}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getUser(row.id))}
                    >
                        <span className='fw-bolder'>{row.fullName}</span>
                    </Link>
                </div>
            </div>
        )
    },
    {
        name: 'username',
        sortable: true,
        minWidth: '150px',
        sortField: 'telephone',
        selector: row => row.username,
        cell: row => <span>{row.username}</span>
    },
    {
        name: 'Contact',
        sortable: true,
        minWidth: '172px',
        sortField: 'telephone',
        selector: row => row.telephone,
        cell: row => <span>{row.telephone}</span>
    },
    {
        name: 'Email',
        sortable: true,
        minWidth: '172px',
        sortField: 'email',
        selector: row => row.email,
        cell: row => <span>{row.email}</span>
    },

    {
        name: 'Status',
        minWidth: '138px',
        sortable: true,
        sortField: 'status',
        selector: row => row.status,
        cell: row => (
            <Badge className='text-capitalize' color={statusObj[row.status]} pill>
                {row.status}
            </Badge>
        )
    },
    {
        name: 'Actions',
        minWidth: '100px',
        cell: row => (
            <div className='column-action'>
                <Link to={`/apps/parents/view/${row.id}`} id={`details-tooltip-${row.id}`}>
                    <FileText size={14} className='me-50'/>
                </Link>
                <UncontrolledTooltip placement='top' target={`details-tooltip-${row.id}`}>
                    View Details
                </UncontrolledTooltip>
            </div>
        )
    }
]
