// ** Reactstrap Imports
import {Button,  UncontrolledTooltip} from 'reactstrap'
import moment from "moment";

import {store} from "@store/store";
import {
    setSelectedRequest,
    setShowWithdrawModal
} from "@src/views/apps/finance/store";
import {GrAtm} from "react-icons/gr";

const statusObj = {
    PENDING: 'light-warning',
    APPROVED: 'light-info',
    PROCESSED: 'light-success',
    CANCELLED: 'light-danger'
}
const {userData} = store.getState().auth

const renderDate = (date) => {
    const m = moment(date)
    const humanReadable = m.format('ddd MMM DD YYYY : hh:mm:ss A')
    return (
        <span>{humanReadable}</span>
    )
}
const openShowModal =(r)=>{
    store.dispatch(setSelectedRequest(r))
    store.dispatch(setShowWithdrawModal(true))
}
const columns = [

    {
        name: 'Name',
        sortable: true,
        minWidth: '240px',
        sortField: 'name',
        selector: row => row.name,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <span className='user_name text-truncate text-body'>{row.name}</span>
                </div>
            </div>
        )
    },
    {
        name: 'Type',
        sortable: true,
        minWidth: '180px',
        sortField: 'type',
        selector: row => row.accountType,
        cell: row => row.accountType
    },
    {
        name: 'Balance(UGX)',
        minWidth: '180px',
        sortable: true,
        sortField: 'amount',
        selector: row => row.amount,
        cell: row => (
            <div className='d-flex justify-content-right align-items-right'>
                <div className='d-flex flex-column'>
                    <span className='fw-bolder'>{row.balance.toLocaleString()}/=</span>
                </div>
            </div>
        )
    },
    {
        name: 'Created At:',
        minWidth: '230px',
        sortable: true,
        sortField: 'createdAt',
        selector: row => row.createdAt,
        cell: row => (renderDate(row.createdAt))
    },
    userData.accountType === "SCHOOL_ADMIN"?{
        name: 'Action',
        minWidth: '420px',
        cell: row => {
            return (
                <div className='column-action d-flex align-items-center'>

                    {
                        (row.accountType === "SCHOOL_PAYMENT") && (
                            <>
                                <Button size="sm"  outline color='info'
                                        onClick={() => openShowModal()}
                                        id={`details-tooltip-${row.id}`}>
                                    <GrAtm  /> Initiate Withdraw
                                </Button>
                                <UncontrolledTooltip placement='top' target={`details-tooltip-${row.id}`}>
                                    View details of this request
                                </UncontrolledTooltip>
                            </>
                        )
                    }
                </div>
            )
        }
    }:{}
]
export default columns;
