// ** React Imports
import {Link} from 'react-router-dom'


// ** Reactstrap Imports
import {Badge, UncontrolledTooltip} from 'reactstrap'

import {store} from '@store/store'
import {getStudent, setEdit, setSelectedStudent} from '../store'
import Avatar from "@components/avatar";
import {FaHandHoldingDollar} from "react-icons/fa6";
import {FaFunnelDollar} from "react-icons/fa";
import {formatCreditCardNumber} from "@utils";


const statusObj = {
    PENDING: 'light-info',
    SUSPENDED: 'light-dark',
    ACTIVE: 'light-success',
    DISABLED: 'light-danger'
}

const setEditable = (row) => {
    store.dispatch(setEdit(true));
    store.dispatch(setSelectedStudent(row))
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
        name: 'Name',
        sortable: true,
        minWidth: '280px',
        sortField: 'fullName',
        selector: row => row.fullName,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                {renderAvatar(row)}
                <div className='d-flex flex-column'>
                    <Link
                        to={`/students/view/${row.id}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getStudent(row.id))}
                    >
                        <span className='user_name text-truncate text-body fw-bolder'>{row.fullName}</span>
                    </Link>
                    <small className='text-truncate text-muted mb-0'><b>Class: </b>{row.className}</small>
                    <small className='text-truncate text-muted mb-0'><b>School: </b>{row.school.name}</small>
                </div>
            </div>
        )
    },
    {
        name: 'Card Info',
        minWidth: '200px',
        sortable: true,
        sortField: 'status',
        selector: row => row.status,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <span className='fw-bolder'>{formatCreditCardNumber(row.wallet.cardNo)}</span>
                    <small className='text-muted mb-0'>Balance: {row.wallet.balance.toLocaleString()}/=</small>
                </div>
            </div>
        )
    },
    {
        name: 'Primary Guardian',
        sortable: true,
        minWidth: '250px',
        sortField: 'address',
        selector: row => row.primaryParent,
        cell: row => row.primaryParent ? (
            <div className='d-flex justify-content-left align-items-center'>
                <small className='mb-0'>{row.primaryParent.fullName}</small>&nbsp;
                <small className='text-muted mb-0'>({row.primaryParent.telephone})</small>
            </div>
        ) : (<span>None</span>)
    },
    {
        name: 'Contributors',
        sortable: true,
        minWidth: '250px',
        sortField: 'address',
        selector: row => row.contributors,
        cell: row => row.contributors ? (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                {
                    row.contributors.map((contributor, idx) => {
                        if (row.primaryParent && contributor.id !== row.primaryParent.id) {
                            return (
                                <small key={idx} className='mb-0'>{contributor.fullName}&nbsp;<small className='text-muted mb-0'>({contributor.telephone}),</small></small>
                            )
                        }
                    })
                }
                </div>
            </div>
        ): (<span>None</span>)
    },
    {
        name: 'Status',
        minWidth: '138px',
        sortable: true,
        sortField: 'status',
        selector: row => row.status,
        cell: row => (
            <Badge className='text-capitalize' color={statusObj[row.wallet.status]} pill>
                {row.wallet.status}
            </Badge>
        )
    },

    {
        name: 'Action',
        minWidth: '18px',
        cell: row => (
            <div className='column-action d-flex align-items-center'>
                <Link to={`/apps/invoice/preview/${row.id}`} id={`pw-tooltip-${row.id}`}>
                    <FaHandHoldingDollar color='gray' size={16}/>
                </Link>
                <UncontrolledTooltip placement='top' target={`pw-tooltip-${row.id}`}>
                    Payments
                </UncontrolledTooltip>
                <FaFunnelDollar color='gray'  className='cursor-pointer mx-1' size={16} id={`send-tooltip-${row.id}`}/>
                <UncontrolledTooltip placement='top' target={`send-tooltip-${row.id}`}>
                    Collections
                </UncontrolledTooltip>
                {/*<Edit onClick={_ => setEditable(row)} className='cursor-pointer' size={15}
                      id={`edit-tooltip-${row.id}`}/>
                <UncontrolledTooltip placement='top' target={`edit-tooltip-${row.id}`}>
                    Edit
                </UncontrolledTooltip>*/}

            </div>
        )
    }
]
