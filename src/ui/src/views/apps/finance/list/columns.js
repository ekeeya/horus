// ** Reactstrap Imports
import {Badge, Button,  UncontrolledTooltip} from 'reactstrap'
import moment from "moment";

import {store} from "@store/store";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {approveCancel, markProcessed, setEdit, setSelectedRequest} from "@src/views/apps/finance/store";
import {BiDetail} from "react-icons/bi";

const statusObj = {
    PENDING: 'light-warning',
    APPROVED: 'light-info',
    PROCESSED: 'light-success',
    CANCELLED: 'light-danger'
}
const {userData} = store.getState().auth

const MySwal = withReactContent(Swal);

const setForUpdate = (r)=>{
    store.dispatch(setEdit(true))
    store.dispatch(setSelectedRequest(r));
}
const approveRejectRequest = (id, action) => {
    const payload = action==="approve" ? {id,action: action} :{id};
    return MySwal.fire({
        title: 'continue?',
        text: `You are about to ${action} this request`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action} request!`,
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            action === "settle" ? store.dispatch(markProcessed(payload)) : store.dispatch(approveCancel(payload));
        }
    })
}
const renderDate = (date) => {
    const m = moment(date)
    const humanReadable = m.format('ddd MMM DD YYYY : hh:mm:ss A')
    return (
        <span>{humanReadable}</span>
    )
}
const viewDetails =(r)=>{
    store.dispatch(setSelectedRequest(r))
}
const columns = [
    {
        name: 'Reference No.',
        sortable: true,
        minWidth: '180px',
        sortField: 'referenceNo',
        selector: row => row.referenceNo,
        cell: row => row.referenceNo
    },
    {
        name: 'School',
        sortable: true,
        minWidth: '240px',
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
        name: 'Type',
        sortable: true,
        minWidth: '180px',
        sortField: 'type',
        selector: row => row.type,
        cell: row => row.type
    },
    {
        name: 'Amount(UGX)',
        minWidth: '180px',
        sortable: true,
        sortField: 'amount',
        selector: row => row.amount,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <span className='fw-bolder'>{row.amount.toLocaleString()}/=</span>
                </div>
            </div>
        )
    },
    {
        name: 'Status',
        minWidth: '80px',
        sortable: true,
        sortField: 'status',
        selector: row => row.status,
        cell: row => (
            <div className='column-action d-flex align-items-center'>
                <Badge className='text-capitalize' color={statusObj[row.status]} pill>
                    {row.status}
                </Badge>
            </div>
        )
    },
    {
        name: 'Date',
        minWidth: '230px',
        sortable: true,
        sortField: 'createdAt',
        selector: row => row.createdAt,
        cell: row => (renderDate(row.createdAt))
    },
    {
        name: 'Action',
        minWidth: '420px',
        cell: row => {
            const allowReject = ["PENDING"]
            return (
                    <div className='column-action d-flex align-items-center'>
                        <Button size="sm" outline color='info'
                                onClick={() => viewDetails(row)}
                                id={`details-tooltip-${row.id}`}>
                            <BiDetail/>
                        </Button>
                        <UncontrolledTooltip placement='top' target={`details-tooltip-${row.id}`}>
                            View details of this request
                        </UncontrolledTooltip>
                        {
                            (row.status === "PENDING" && userData.role === "ADMIN") && (
                                <>
                                    <Button size="sm" color='info' outline
                                            onClick={() => approveRejectRequest(row.id, "approve")}
                                            id={`approve-tooltip-${row.id}`}>
                                        Approve
                                    </Button>
                                    <UncontrolledTooltip placement='top' target={`approve-tooltip-${row.id}`}>
                                        Approve for payment processing
                                    </UncontrolledTooltip>
                                </>
                            )
                        }
                        {
                            (row.status === "APPROVED" && userData.accountType === "ADMIN") && (
                                <>
                                    <Button size="sm" color='success' outline
                                            onClick={() => setForUpdate(row, "settle")}
                                            id={`settle-tooltip-${row.id}`}>
                                        Settle
                                    </Button>
                                    <UncontrolledTooltip placement='top' target={`settle-tooltip-${row.id}`}>
                                        The payment has been made, upload proof of payment (receipts) to settle this
                                        request.
                                    </UncontrolledTooltip>
                                </>
                            )
                        }
                        {
                            allowReject.includes(row.status) && (
                                <>
                                    <Button size="sm" color='danger' outline
                                            onClick={() => approveRejectRequest(row.id, "reject")}
                                            id={`reject-tooltip-${row.id}`}>
                                        {
                                            userData.role === "ADMIN" ? "Reject" : "Cancel"
                                        }
                                    </Button>
                                    <UncontrolledTooltip placement='top' target={`reject-tooltip-${row.id}`}>
                                        Reject/Cancel this request.
                                    </UncontrolledTooltip>
                                </>
                            )
                        }

                    </div>
            )
        }
    }
]

export default columns;
