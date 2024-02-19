// ** React Imports
import {Fragment, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
// ** Invoice List Sidebar
import Sidebar from './Sidebar'


// ** Table Columns
import {columns} from './columns'

// ** Store & Actions
import {fetchPosCenters, fetchSchools, setSelectedSchool} from '../store'
import {useDispatch, useSelector} from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {ChevronDown} from 'react-feather'
// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Label,
    CardBody,
    CardTitle,
    CardHeader, Input, Button, Badge,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {useLocation} from "react-router-dom";
import Loader from "@components/spinner/Loader";
import UILoader from "@components/ui-loader";
import {store} from "@store/store";
import {getUser} from "@src/views/apps/user/store";


const statusObj = {
    ACTIVE: 'light-success',
    "IN ACTIVE": 'light-secondary'
}
const CustomHeader = ({toggleSidebar}) => {
    return (
        <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
            <Row>
                <Col xl='6' className='d-flex align-items-center p-0'>
                    <div className='d-flex align-items-center w-100'>

                    </div>
                </Col>
                <Col
                    xl='6'
                    className='d-flex align-items-sm-right justify-content-xl-end justify-content-end flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
                >
                    <div className='d-flex align-items-center table-header-actions'>
                        <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
                            Add New Point Of Sale
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
const ExpandableTable = ({data}) => {
    return (
        <div className='expandable-content p-2'>
            <table className="table table-responsive">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.attendants.map((attendant) => {
                        return (
                            <tr key={attendant.id}>
                                <td>
                                    <Link
                                        to={`/apps/user/view/${attendant.id}`}
                                        className='user_name text-truncate text-body'
                                        onClick={() => store.dispatch(getUser(attendant.id))}
                                    >
                                        {attendant.fullName}
                                    </Link>
                                </td>
                                <td>{attendant.username}</td>
                                <td>{attendant.telephone}</td>
                                <td>{attendant.email}</td>
                                <td>
                                    <Badge className='text-capitalize' color={statusObj[attendant.status]} pill>
                                        {attendant.status}
                                    </Badge>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}
const PosList = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const {posCenters, posPages, loading,edit, schools} = useSelector(state => state.schools)
    const {userData} = useSelector(state => state.auth);
    // ** States
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [school, setSchool] = useState({});

    // ** Function to toggle sidebar
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // ** Get data on mount
    useEffect(() => {
        let schoolId = queryParams.get("school");
        if (school.value) {
            schoolId = school.value;
        }
        schoolId = schoolId ? schoolId : ""
        dispatch(fetchPosCenters(schoolId));

    }, [dispatch, posCenters.length, currentPage, school])

    useEffect(() => {
        if(edit){
            toggleSidebar()
        }
    }, [edit])
    const handleSchoolSelect = (s) => {
        setSchool(s)
        dispatch(setSelectedSchool(s));
    }
    const schoolSearchFunction = (val) => {
        dispatch(fetchSchools({page: 0, size: 10, name: val}))
    }

    const handleSchoolSearch = val => {
        schoolSearchFunction(val)
    }
    // ** Function in get data on page change
    const handlePagination = page => {

        setCurrentPage(page.selected + 1)
    }
    const renderSchools = () => {
        return schools.map(school => {
            return {
                value: school.id,
                label: school.name,
                classes: school.classes
            }
        })
    }

    // ** Custom Pagination
    const CustomPagination = () => {
        const count = Number(Math.ceil(posPages / rowsPerPage));

        return (
            <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                pageCount={count || 1}
                activeClassName='active'
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={page => handlePagination(page)}
                pageClassName={'page-item'}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
            />
        )
    }

    // ** Table data to render


    return (
        <Fragment>
            <UILoader blocking={loading} loader={<Loader/>}>
                {
                    userData.role !== "SCHOOL" && <Card>
                        <CardHeader>
                            <CardTitle tag='h4'>Filters</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mt-1 mb-50'>

                                <Col lg='4' md='6' className='mb-1'>
                                    <Label className='form-label' for='name'>
                                        School:
                                    </Label>
                                    <Select
                                        isSearchable
                                        isClearable={true}
                                        value={school}
                                        isLoading={loading}
                                        onInputChange={(val) => handleSchoolSearch(val)}
                                        placeholder="Select School"
                                        options={renderSchools()}
                                        name="school"
                                        onChange={v => handleSchoolSelect(v)}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>}

                <Card className='overflow-hidden'>
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            subHeader
                            data={posCenters}
                            expandableRows
                            columns={columns}
                            expandOnRowClicked
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10}/>}
                            paginationComponent={CustomPagination}
                            paginationDefaultPage={currentPage + 1}
                            expandableRowsComponent={ExpandableTable}
                            subHeaderComponent={
                                <CustomHeader
                                    toggleSidebar={toggleSidebar}
                                />
                            }
                        />
                    </div>
                </Card>
            </UILoader>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
        </Fragment>
    )
}

export default PosList
