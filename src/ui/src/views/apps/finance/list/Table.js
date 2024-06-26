// ** React Imports
import {Fragment, useEffect, useState} from 'react'
import NumericInput from 'react-numeric-input';
// ** Sidebar
// ** Table Columns
import columns from './columns'

import {useDispatch, useSelector} from 'react-redux'
import {debounce} from "lodash";

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import {ChevronDown, PlusCircle} from 'react-feather'

// Custom Components
import UILoader from '@components/ui-loader'
import Loader from '../../../../@core/components/spinner/Loader'

// ** Reactstrap Imports
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {fetchSchool, fetchSchools} from "@src/views/apps/schools/store";
import {
    fetchVirtualAccounts,
    fetchWithdrawRequests,
    makeWithdrawRequest,
    setShowWithdrawModal
} from "@src/views/apps/finance/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
import Sidebar from "@src/views/apps/finance/list/Sidebar";
import WithdrawRequestBar from "@src/views/apps/finance/accounts/Sidebar";

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({userData, setShowModal, handlePerPage, rowsPerPage}) => {

    return (
        <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
            <Row>
                <Col xl='2' className='d-flex align-items-center p-0'>
                    <div className='d-flex align-items-center w-100'>
                        <label htmlFor='rows-per-page'>Show</label>
                        <Input
                            className='mx-50'
                            type='select'
                            id='rows-per-page'
                            value={rowsPerPage}
                            onChange={handlePerPage}
                            style={{width: '5rem'}}
                        >
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                            <option value='30'>30</option>
                            <option value='50'>50</option>
                        </Input>
                        <label htmlFor='rows-per-page'>Entries</label>
                    </div>
                </Col>
                <Col
                    xl='10'
                    className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
                >
                    {userData.role === "SCHOOL" &&
                        (<div className='d-flex align-items-center table-header-actions'>
                            <Button className='me-50' size="sm" outline color='info' onClick={setShowModal}>
                                <PlusCircle size={14}/>
                                <span className='align-middle me-30 '>&nbsp;Initiate Withdraw Request</span>
                            </Button>
                        </div>)
                    }
                </Col>
            </Row>
        </div>
    )
}

const defaultValues = {
    amount: 0
}
const WithdrawRequestList = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const {loading, withdrawRequests, pages, selectedRequest,showWithDrawModal} = useSelector((store) => store.finance);
    const {userData} = useSelector((store) => store.auth);
    const schoolStore = useSelector(state => state.schools)

    // ** States
    const [sort, setSort] = useState();
    const [sortColumn, setSortColumn] = useState();
    const [schoolId, setSchoolId] = useState();
    const [selectedSchool, setSelectedSchool] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [nativeError, setNativeError] = useState(null)

    const [statuses, setStatuses] = useState([
        {label: "All", value: ""},
        {label: "PENDING", value: "PENDING"},
        {label: "APPROVED", value: "APPROVED"},
        {label: "PROCESSED", value: "PROCESSED"},
        {label: "CANCELLED", value: "CANCELLED"}
    ]);
    const [status, setStatus] = useState({label: "All", value: ""});

    const [filterPayLoad, setFilterPayload] = useState({
        page: currentPage,
        size: rowsPerPage
    })

    const togglePaymentSideBar = () => dispatch(setShowWithdrawModal(!showWithDrawModal));
    const toggleSidebar = () => setOpen(!open)


    const parseInput = x => {
        setAmount(parseFloat(x.replaceAll(",", "")))
        return parseFloat(x.replaceAll(",", ""));
    }

    const format = x => {
        const numberValue = parseFloat(x);
        if (!isNaN(numberValue)) {
            return numberValue.toLocaleString();
        }
    }
    const openModal = () => setShow(true);

    useEffect(() => {
        if (nativeError) {
            setTimeout(() => {
                setNativeError(null)
            }, 5000)
        }
    }, [nativeError])

    useEffect(() => {
        if (selectedRequest) {
            setOpen(true)
        }
    }, [selectedRequest])

    useEffect(() => {
        if (userData.school) {
            setSelectedSchool({
                value: userData.school.id,
                label: userData.school.name,
                accountBalance: userData.school.accountBalance
            });
        }
    }, [userData])

    useEffect(() => {
        let params = {}
        if (selectedSchool && selectedSchool.value){
            params = {schoolId:selectedSchool.value}
        }
        dispatch(fetchVirtualAccounts(params))
    }, [dispatch, selectedSchool])

    useEffect(() => {
        if (selectedSchool) {
            setSchoolId(selectedSchool.value)
        } else {
            setNativeError("Please select a school to continue")
        }
    }, [selectedSchool])


    useEffect(() => {
        let configs = {
            ...filterPayLoad
        }
        if (schoolId) {
            configs["schoolId"] = schoolId;
            dispatch(fetchSchool(schoolId))
        }
        setFilterPayload(configs);
    }, [schoolId])

    // ** Get data on mount
    useEffect(() => {
        dispatch(fetchWithdrawRequests(filterPayLoad))
    }, [dispatch, filterPayLoad])


    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            fetchWithdrawRequests({
                ...filterPayLoad,
                size: rowsPerPage,
                page: page.selected,
            })
        )
        setCurrentPage(page.selected + 1)
    }

    // ** Function in get data on rows per page
    const handlePerPage = e => {
        const value = parseInt(e.currentTarget.value)
        setRowsPerPage(value)
        dispatch(
            fetchWithdrawRequests({
                ...filterPayLoad,
                size: value,
                page: 0,
            })
        )
    }
    const schoolSearchFunction = (val) => {
        dispatch(fetchSchools({page: 0, size: 10, name: val}))
    }

    // ** Function in get data on search query change
    const debounceSearchSchools = debounce(schoolSearchFunction, 400);
    const handleSchoolSearch = val => {
        debounceSearchSchools(val)
    }

    useEffect(()=>{
        const configs = {...filterPayLoad};
        if(status){
            configs["status"] = status.value;
        }else{
            delete configs["status"]
        }
        setFilterPayload(configs);
    }, [status])

    useEffect(() => {
        // Clean up the debounced functions when the component unmounts
        return () => {
            debounceSearchSchools.cancel()
        };
    }, []);

    // ** Custom Pagination
    const CustomPagination = () => {
        const count = pages

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
    const handleSort = (column, sortDirection) => {
        setSort(sortDirection)
        setSortColumn(column.sortField)
    }
    const renderSchools = () => {
        return schoolStore.schools.map(school => {
            return {
                value: school.id,
                label: school.name,
                classes: school.classes,
                accountBalance: school.accountBalance
            }
        })
    }

    const balance = schoolStore.selectedSchool  ? schoolStore.selectedSchool.accountBalance : 0;
    const rate = schoolStore.selectedSchool ? schoolStore.selectedSchool.commissionRate : 0;

    return (
        <Fragment>
            <UILoader blocking={loading} loader={<Loader/>}>
                <Card className='overflow-hidden'>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Filters</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className='mt-1 mb-50'>
                            {
                                userData.role !== "SCHOOL" &&
                                <Col lg='4' md='6' className='mb-1'>
                                    <Label className='form-label' for='name'>
                                        School:
                                    </Label>
                                    <Select
                                        isSearchable
                                        isClearable={true}
                                        value={selectedSchool}
                                        isLoading={schoolStore.loading}
                                        onInputChange={(val) => handleSchoolSearch(val)}
                                        placeholder="Select School"
                                        options={renderSchools()}
                                        name="school"
                                        onChange={v => setSelectedSchool(v)}
                                    />
                                </Col>
                            }
                            <Col lg='4' md='6' className='mb-1'>
                                <Label className='form-label' for='status'>
                                    Status:
                                </Label>
                                <Select
                                    isSearchable
                                    isClearable={true}
                                    value={status}
                                    placeholder="Select Status"
                                    options={statuses}
                                    name="status"
                                    onChange={v=>setStatus(v)}
                                />
                            </Col>

                        </Row>
                    </CardBody>
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            subHeader
                            sortServer
                            pagination
                            responsive
                            paginationServer
                            columns={columns}
                            onSort={handleSort}
                            sortIcon={<ChevronDown/>}
                            className='react-dataTable'
                            paginationComponent={CustomPagination}
                            data={withdrawRequests}
                            subHeaderComponent={
                                <CustomHeader
                                    userData={userData}
                                    rowsPerPage={rowsPerPage}
                                    setShowModal={togglePaymentSideBar}
                                    handlePerPage={handlePerPage}
                                />
                            }
                        />
                    </div>
                </Card>

                <Sidebar open={open} toggleSidebar={toggleSidebar}/>
                <WithdrawRequestBar
                    open={showWithDrawModal}
                         toggleSidebar={togglePaymentSideBar}/>
            </UILoader>
        </Fragment>
    )
}

export default WithdrawRequestList
