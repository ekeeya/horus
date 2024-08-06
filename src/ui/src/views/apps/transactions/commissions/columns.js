// ** React Imports
import {Link} from 'react-router-dom'

import 'moment-timezone';
// ** Reactstrap Imports
import {Badge} from 'reactstrap'
import moment from "moment";
import {store} from "@store/store";
import {getStudent} from "@src/views/apps/students/store";
import {getUser} from "@src/views/apps/parents/store";
moment.tz.setDefault('Africa/Nairobi')

const statusObj = {
    PENDING: 'light-info',
    SUCCESS: 'light-success',
    FAILED: 'light-danger'
}


const renderDate = (date) => {
    //const d = new Date(date)
    const m = moment(date)
    const humanReadable = m.format('ddd MMM DD YYYY : hh:mm:ss A')
    return (
        <span>{humanReadable}</span>
    )
}
export const columns = [
    {
        name: 'ID',
        sortable: true,
        minWidth: '170px',
        sortField: 'transactionId',
        selector: row => row.transactionId,
        cell: row => row.transactionId
    },
    {
        name: 'Student',
        sortable: true,
        minWidth: '200px',
        sortField: 'address',
        selector: row => row.student,
        cell: row => row.student ? (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                        <Link
                        to={`/students/view/${row.student.id}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getStudent(row.student.id))}
                    >
                        <small className='mb-0'>{row.student.fullName}</small>
                    </Link>
                    <small className='text-truncate text-muted mb-0'>{row.school.name}</small>
                </div>
            </div>
        ) : (<span>None</span>)
    },

    {
        name: 'Amount',
        sortable: false,
        minWidth: '140px',
        sortField: 'currency',
        selector: row => row.amount,
        cell: row => (
           <small><span className="font-small-1"></span><small className='fw-bold mb-0'>{row.amount.toLocaleString()}</small> </small>
        )
    },
    {
        name: 'Type',
        sortable: false,
        minWidth: '140px',
        sortField: 'transactionType',
        selector: row => row.transactionType,
        cell: row =>row.transactionType
    },
    {
        name: 'Date',
        minWidth: '180px',
        sortable: true,
        sortField: 'status',
        selector: row => row.createdAt,
        cell: row => renderDate(row.createdAt)
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
    }
]
