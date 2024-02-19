// ** React Imports
import {Link} from 'react-router-dom'


// ** Reactstrap Imports
import {Badge, UncontrolledTooltip, Button} from 'reactstrap'

import {store} from '@store/store'
import Avatar from "@components/avatar";
import moment from "moment";
import {getStudent, markProvisioned} from "@src/views/apps/students/store";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {CheckmarkIcon} from "react-hot-toast";
import {formatCreditCardNumber} from "@utils";

const MySwal = withReactContent(Swal)
const statusObj = {
    PENDING: 'light-warning',
    PROVISIONED: 'light-success'
}
const renderStatus = (isProvisioned)=>{
    return  isProvisioned ? "PROVISIONED" : "PENDING"
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
const mark =(requestId)=>{
    const payload =  {
        requestId
    }
    return MySwal.fire({
        title: 'continue?',
        text: `You are about to mark this request as provisioned`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, Continue`,
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            store.dispatch(markProvisioned(payload));
        }
    })
}
export const columns = [
    {
        name: 'Student',
        sortable: true,
        minWidth: '280px',
        sortField: 'fullName',
        selector: row => row.student.fullName,
        cell: row => (
            <div className='d-flex justify-content-left align-items-center'>
                {renderAvatar(row.student)}
                <div className='d-flex flex-column'>
                    <Link
                        to={`/students/view/${row.student.id}`}
                        className='user_name text-truncate text-body'
                        onClick={() => store.dispatch(getStudent(row.student.id))}
                    >
                        <span className='user_name text-truncate text-body fw-bolder'>{row.student.fullName}</span>
                    </Link>
                    <small className='text-truncate text-muted mb-0'><b>Class: </b>{row.student.className}</small>
                </div>
            </div>
        )
    },
    {
        name: 'School',
        sortable: true,
        minWidth: '250px',
        selector: row => row.student.school,
        cell: row => (
            <span className='text-truncate  mb-0'>{row.student.school.name}</span>

        )
    },
    {
        name: 'Card No.',
        minWidth: '180px',
        sortable: true,
        sortField: 'type',
        selector: row => row.student.wallet,
        cell: row => formatCreditCardNumber(row.student.wallet.cardNo)
    },
    {
        name: 'Status',
        minWidth: '140px',
        sortable: true,
        sortField: 'status',
        selector: row => row.provisioned,
        cell: row => (
            <Badge className='text-capitalize' color={statusObj[renderStatus(row.provisioned)]} pill>
                {renderStatus(row.provisioned)}
            </Badge>
        )
    },
    {
        name: 'Date Issued',
        minWidth: '200px',
        sortable: true,
        selector: row => row.createdAt,
        cell: row => ( <span>{renderDate(row.createdAt)}</span>)
    },
    {
        name: 'Action',
        minWidth: '18px',
        cell: row => (
            !row.provisioned && (
                <div className='column-action d-flex align-items-center'>
                    <CheckmarkIcon onClick={()=>mark(row.id)} size={20} id={`mark-tooltip-${row.id}`} />
                    <UncontrolledTooltip placement='top' target={`mark-tooltip-${row.id}`}>
                        Mark Provisioned Request
                    </UncontrolledTooltip>
                </div>
            )
        )
    }
]
