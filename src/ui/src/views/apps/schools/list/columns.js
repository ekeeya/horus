// ** React Imports
import { Link } from 'react-router-dom'

// ** Icons Imports
import { Edit, Briefcase, BarChart2, Users } from 'react-feather'

// ** Reactstrap Imports
import { Badge,UncontrolledTooltip } from 'reactstrap'

import {store} from '@store/store'
import { setEdit, setSelectedSchool } from '../store'



const statusObj = {
  Active: 'light-success',
  "In active": 'light-secondary'
}

const setEditable =(row)=>{
  store.dispatch(setEdit(true));
  store.dispatch(setSelectedSchool(row))
}

export const columns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '280px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        <div className='d-flex flex-column'>
          <span className='fw-bolder text-capitalize'>{row.name}</span>
        </div>
      </div>
    )
  },
  {
    name: 'Email',
    minWidth: '138px',
    sortable: true,
    sortField: 'email',
    selector: row => row.email,
    cell: row => <span >{row.primaryContact}</span>
  },
  {
    name: 'Address',
    sortable: true,
    minWidth: '250px',
    sortField: 'address',
    selector: row => row.role,
    cell: row => <span className='text-capitalize'>{row.address}</span>
  },
    {
        name: 'Sys Commission',
        sortable: true,
        sortField: 'systemFeePerStudentPerTerm',
        selector: row => row.systemFeePerStudentPerTerm,
        cell: row => <span className='text-capitalize'>{row.systemFeePerStudentPerTerm.toLocaleString()}</span>
    },
    {
        name: 'Sch Commission',
        sortable: true,
        sortField: 'schoolFeePerStudentPerTerm',
        selector: row => row.schoolFeePerStudentPerTerm,
        cell: row => <span className='text-capitalize'>{row.schoolFeePerStudentPerTerm.toLocaleString()}</span>
    },
  {
    name: 'Subscription',
    minWidth: '90px',
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
    name: 'Action',
    minWidth: '18px',
    cell: row => (
      <div className='column-action d-flex align-items-center'>
        <Link to={`/apps/user/list?school=${row.id}`} id={`users-tooltip-${row.id}`}>
          <Users color='black' size={15}  />
        </Link>
        <UncontrolledTooltip placement='top' target={`users-tooltip-${row.id}`}>
          User Accounts
        </UncontrolledTooltip>
          <Link to={`/transactions/collections?school=${row.id}`} id={`send-tooltip-${row.id}`}>
            <Briefcase className='cursor-pointer mx-1' size={15}  />
          </Link>
        <UncontrolledTooltip placement='top' target={`send-tooltip-${row.id}`}>
          Collections
        </UncontrolledTooltip>
        <Link to={`/transactions/payments?school=${row.id}`} id={`pw-tooltip-${row.id}`}>
          <BarChart2 color='black' size={15}  />
        </Link>
        <UncontrolledTooltip placement='top' target={`pw-tooltip-${row.id}`}>
          Payments
        </UncontrolledTooltip>
        <Edit  onClick={_=>setEditable(row)} className='cursor-pointer mx-1'  size={15} id={`edit-tooltip-${row.id}`} />
        <UncontrolledTooltip placement='top' target={`edit-tooltip-${row.id}`}>
          Edit
        </UncontrolledTooltip>

      </div>
    )
  }
]
