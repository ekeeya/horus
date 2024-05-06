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
    Pending: 'light-info',
    Processed: 'light-success',
    Failed: 'light-danger'
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
        minWidth: '100px',
        maxWidth:'180px',
        sortField: 'id',
        selector: row => row.transactionId,
        cell: row => row.transactionId
    },
    {
        name: 'Student',
        sortable: true,
        minWidth: '280px',
        sortField: 'student',
        selector: row => row.studentName,
        cell: row => row.studentId ? (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                        <Link
                        to={`/students/view/${row.studentId}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getStudent(row.debitAccount.studentId))}
                    >
                        <small className='mb-0'>{row.studentName}</small>
                    </Link>
                    <small className='text-body mb-0'>Card:&nbsp;<small className='text-muted mb-0'>{row.wallet.cardNo}</small></small>
                    <small className='text-truncate text-muted mb-0'>{row.pos.schoolName}</small>
                </div>
            </div>
        ) : (<span>None</span>)
    },

    {
        name: 'Amount (UGX)',
        sortable: false,
        minWidth: '140px',
        maxWidth: '140px',
        sortField: 'amount',
        selector: row => row.amount,
        cell: row => (
           <small><span className="font-small-1"></span><small className='fw-bold mb-0'>{row.amount.toLocaleString()}</small> </small>
        )
    },
    {
        name: 'Date',
        minWidth: '180px',
        sortable: true,
        sortField: 'status',
        selector: row => row.date,
        cell: row => renderDate(row.date)
    },
    {
        name: 'Items',
        minWidth: '200px',
        sortField: 'items',
        selector: row => row.items,
        cell: row => (
            <div className="overflow-auto overflow-y-scroll h-100 flex-column">
                {row.items.map(item=>(
                    <div key={item.id} className="col">{item.name} - x{item.quantity}</div>
                ))}
            </div>
        )
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
