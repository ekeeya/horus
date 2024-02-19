// ** React Imports

import 'moment-timezone';
// ** Reactstrap Imports
import {Badge} from 'reactstrap'
import moment from "moment";
moment.tz.setDefault('Africa/Nairobi')

const statusObj = {
    PENDING: 'light-info',
    SUCCESS: 'light-success',
    FAILED: 'light-danger'
}

const renderType=(type)=>{
    return type==="COLLECTION" ? "DEPOSIT" :type
}
const renderDate = (date) => {
    //const d = new Date(date)
    console.log(date)
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
        minWidth: '140px',
        sortField: 'transactionId',
        selector: row => row.transactionId,
        cell: row => row.transactionId
    },

    {
        name: 'Amount (UGX)',
        sortable: false,
        minWidth: '140px',
        sortField: 'currency',
        selector: row => row.amount,
        cell: row => (
           <small><small className='fw-bold mb-0'>{row.amount.toLocaleString()}</small> </small>
        )
    },
    {
        name: 'Type',
        sortable: false,
        minWidth: '120px',
        sortField: 'transactionType',
        selector: row => row.transactionType,
        cell: row => renderType(row.transactionType)
    },
    {
        name: 'School',
        sortable: true,
        minWidth: '180px',
        sortField: 'school',
        selector: row => row.school,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <span className='user_name text-truncate text-body'>{row.school.name}</span>
                </div>
            </div>
        )
    },
    {
        name: 'Date',
        minWidth: '200px',
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
