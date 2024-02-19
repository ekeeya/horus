// ** Reactstrap Imports
import {Badge, Card, CardHeader} from 'reactstrap'

// ** Third Party Components
import {ChevronDown} from 'react-feather'
import DataTable from 'react-data-table-component'
import {store} from "@store/store";
// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {Link} from "react-router-dom";
import {getUser} from "@src/views/apps/user/store";


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
const renderPrimary = (row) => {
    const {selectedStudent} = store.getState().students;
    if (selectedStudent.primaryParent && selectedStudent.primaryParent.id === row.id) {
        return <Badge color="success">Primary</Badge>
    } else {
        return <Badge color="info">Contributor</Badge>
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
                <Link
                    to={`/apps/parents/view/${row.id}`}
                    className='user_name text-truncate text-body'
                    onClick={() => store.dispatch(getUser(row.id))}
                >
                    <span className='user_name text-truncate text-body fw-bolder'>{row.fullName}</span>
                </Link>
            </div>
        )
    },
    {
        name: 'Email',
        minWidth: '180px',
        selector: row => row.email
    },
    {
        name: 'Telephone',
        minWidth: '180px',
        selector: row => row.telephone
    }, {
        name: 'Is primary',
        minWidth: '180px',
        selector: row => (
            <div className='d-flex justify-content-left align-items-center'>
                {renderPrimary(row)}
            </div>
        )
    }

]

const ParentStudentsList = ({data}) => {
    return (
        <Card>
            <CardHeader tag='h4'>Contributing Guardians</CardHeader>
            <div className='react-dataTable user-view-account-projects'>
                <DataTable
                    noHeader
                    responsive
                    columns={columns}
                    data={data}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10}/>}
                />
            </div>
        </Card>
    )
}

export default ParentStudentsList
