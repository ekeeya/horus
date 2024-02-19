// ** React Imports
// ** Reactstrap Imports
import {Badge, UncontrolledTooltip} from 'reactstrap'
import {Edit} from "react-feather";
import {store} from "@store/store";
import {setEdit, setSelectedPosCenter} from "@src/views/apps/schools/store";


const statusObj = {
  Active: 'light-success',
  Inactive: 'light-secondary'
}

const setEditable =(row)=>{
  store.dispatch(setEdit(true));
  store.dispatch(setSelectedPosCenter(row))
}

export const columns = [
  {
    name: 'Point of Sale',
    sortable: true,
    minWidth: '300px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        <span className='fw-bolder'>{row.name}</span>
      </div>
    )
  },
  {
    name: 'School',
    sortable: true,
    minWidth: '300px',
    sortField: 'schoolName',
    selector: row => row.schoolName,
    cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <span className='text-truncate'>{row.schoolName}</span>
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
  },
  {
    name: 'Attendants',
    sortable: true,
    minWidth: '250px',
    sortField: 'address',
    selector: row => row.attendants,
    cell: row => row.attendants ? (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            {
              row.attendants.length
            }
          </div>
        </div>
    ): (<span>None</span>)
  },
  {
    name: 'Action',
    minWidth: '18px',
    cell: row => (
        <div className='column-action d-flex align-items-center'>

          <Edit  onClick={_=>setEditable(row)} className='cursor-pointer mx-1'  size={15} id={`edit-tooltip-${row.id}`} />
          <UncontrolledTooltip placement='top' target={`edit-tooltip-${row.id}`}>
            Edit
          </UncontrolledTooltip>

        </div>
    )
  }
]
