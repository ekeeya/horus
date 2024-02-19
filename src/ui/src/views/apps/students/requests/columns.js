// ** React Imports
import {Link} from 'react-router-dom'


// ** Reactstrap Imports
import {Badge, UncontrolledTooltip} from 'reactstrap'

import {store} from '@store/store'
import Avatar from "@components/avatar";
import {FcApproval, FcCancel} from "react-icons/fc";
import {getUser} from "@src/views/apps/user/store";
import moment from "moment";
import {approveLinkRequest} from "@src/views/apps/students/store";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal)
const statusObj = {
    PENDING: 'light-warning',
    APPROVED: 'light-success',
    REJECTED: 'light-danger',
}

const renderType = (type)=>{
   return type ==="SCHOOL_APPROVAL" ? "PARENT TO SCHOOL" :"PARENT TO PARENT"
}

const renderDate = (date)=>{
    const d = new Date(date)
    const m =  moment(d)
    const  humanReadable = m.format('ddd MMM DD YYYY : hh:mm:ss A')
    return(
        <span>{humanReadable}</span>
    )
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
const approveRejectRequest =(requestId,action)=>{
    const approve =  action === "approve";
    const payload =  {
        requestId,
        approve
    }
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
            store.dispatch(approveLinkRequest(payload));
        }
    })
}
export const columns = [
    {
        name: 'Made By',
        sortable: true,
        minWidth: '200px',
        sortField: 'fullName',
        selector: row => row.madeBy.fullName,
        cell: row => (
                <div className='d-flex justify-content-left align-items-center'>
                    <div className='d-flex flex-column'>
                        <Link
                            to={`/apps/user/view/${row.madeBy.id}`}
                            className='user_name text-truncate text-body'
                            onClick={() => store.dispatch(getUser(row.madeBy.id))}
                        >
                            <span className='fw-bolder'>{row.madeBy.fullName}</span>
                        </Link>
                        <small className='text-truncate text-muted mb-0'>@{row.madeBy.telephone}</small>
                    </div>
                </div>
        )
    },
    {
        name: 'Made To',
        sortable: true,
        minWidth: '230px',
        selector: row => row.primaryParent,
        cell: row => (
            row.primaryParent !== null ?
                <div className='d-flex justify-content-left align-items-center'>
                    <div className='d-flex flex-column'>
                        <Link
                            to={`/apps/user/view/${row.primaryParent.id}`}
                            className='user_name text-truncate text-body'
                            onClick={() => store.dispatch(getUser(row.primaryParent.id))}
                        >
                            <span className='fw-bolder'>{row.primaryParent.fullName}</span>
                        </Link>
                        <small className='text-truncate text-muted mb-0'>@{row.primaryParent.telephone}</small>
                    </div>
                </div>
                :
                <span className='text-truncate fw-bolder mb-0'>{row.student.school.name}</span>
        )
    },
    {
        name: 'Student',
        sortable: true,
        minWidth: '250px',
        sortField: 'fullName',
        selector: row => row.student,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                <div className='d-flex flex-column'>
                    <Link
                        to={`/apps/user/view/${row.student.id}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getUser(row.student.id))}
                    >
                        <span className='fw-bolder'>{row.student.fullName}&nbsp;<small className='text-truncate text-muted mb-0'>({row.student.className})</small></span>
                    </Link>
                    <small className='text-truncate text-muted mb-0'>{row.student.school.name}</small>
                </div>
            </div>
        )
    },
    {
        name: 'Type',
        minWidth: '180px',
        sortable: true,
        sortField: 'type',
        selector: row => row.type,
        cell: row => renderType(row.type)
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
        name: 'Made At',
        minWidth: '150px',
        sortable: true,
        selector: row => row.createdAt,
        cell: row => ( renderDate(row.createdAt))
    },
    {
        name: 'Action',
        minWidth: '18px',
        cell: row => (
            row.status === "PENDING" && (
                <div className='column-action d-flex align-items-center'>
                    <FcApproval onClick={()=>approveRejectRequest(row.id, "approve")} color='gray' id={`approve-tooltip-${row.id}`} size={20}/>
                    <UncontrolledTooltip placement='top' target={`approve-tooltip-${row.id}`}>
                        Approve Request
                    </UncontrolledTooltip>
                    <FcCancel onClick={()=>approveRejectRequest(row.id, "reject")} color='gray'  className='cursor-pointer mx-1' size={20} id={`cancel-tooltip-${row.id}`}/>
                    <UncontrolledTooltip placement='top' target={`cancel-tooltip-${row.id}`}>
                        Reject Request
                    </UncontrolledTooltip>
                </div>
            )
        )
    }
]
