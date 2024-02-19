// ** Reactstrap Imports
import { Card, CardHeader, Progress } from 'reactstrap'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

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
export const columns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '280px',
    sortField: 'fullName',
    selector: row => row.fullName,
    cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {renderAvatar(row)}
          <div className='d-flex flex-column'>
            <span className='user_name text-truncate text-body fw-bolder'>{row.fullName}</span>
          </div>
        </div>
    )
  },
  {
    name: 'Card Info',
    minWidth: '200px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <span className='fw-bolder'>{row.wallet.cardNo}</span>
            <small className='text-muted mb-0'>Balance: {row.wallet.balance.toLocaleString()}/=</small>
          </div>
        </div>
    )
  },
  {
    name: 'School',
    minWidth: '280px',
    selector: row => row.schoolName
  },
  {
    name: 'Class',
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex flex-column w-100'>
          <small className='mb-1'>{row.className}</small>
        </div>
      )
    }
  },

]

const ParentStudentsList = ({data}) => {
  return (
    <Card>
      <CardHeader tag='h4'>Attached Students</CardHeader>
      <div className='react-dataTable user-view-account-projects'>
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={data}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
    </Card>
  )
}

export default ParentStudentsList
