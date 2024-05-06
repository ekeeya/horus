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
        name: 'Name',
        sortable: true,
        minWidth: '100px',
        maxWidth:'180px',
        sortField: 'id',
        selector: row => row.name,
        cell: row => row.name
    },
    {
        name: 'Category',
        minWidth: '100px',
        sortable: true,
        sortField: 'category',
        selector: row => row.category,
        cell: row => (
            <span className='text-center' >
                {row.category.name}
            </span>
        )
    },
    {
        name: 'Unit Price (UGX)',
        sortable: false,
        minWidth: '150px',
        maxWidth: '150px',
        sortField: 'price',
        selector: row => row.price,
        cell: row => (
           <small><span className="font-small-1"></span><small className='fw-bold mb-0'>{row.price.toLocaleString()}</small> </small>
        )
    },
    {
        name: 'Quantity',
        sortable: true,
        minWidth: '150px',
        maxWidth:'150px',
        sortField: 'quantity',
        selector: row => row.quantity,
        cell: row => row.quantity
    },
    {
        name: 'Total (UGX)',
        sortable: false,
        minWidth: '120px',
        maxWidth: '120px',
        sortField: 'price',
        selector: row => row.price,
        cell: row => (
            <small><span className="font-small-1"></span><small className='fw-bold mb-0'>{(row.price*row.quantity).toLocaleString()}</small> </small>
        )
    },
    {
        name: 'Order',
        sortable: true,
        minWidth: '180px',
        sortField: 'orderId',
        selector: row => row.orderId,
        cell: row => row.orderId ? (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <small className='mb-0'>Order-{row.orderId}</small>
                    <small className='text-body mb-0'>PoS:&nbsp;<small className='text-muted mb-0'>{row.posName}</small></small>
                    <small className='text-truncate text-muted mb-0'>{row.attendant}</small>
                </div>
            </div>
        ) : (<span>None</span>)
    },
    {
        name: 'Date',
        minWidth: '120px',
        sortable: true,
        sortField: 'createdAt',
        selector: row => row.createdAt,
        cell: row => renderDate(row.createdAt)
    },

]
