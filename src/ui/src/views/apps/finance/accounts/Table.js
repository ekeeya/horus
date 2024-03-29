// ** React Imports
import {Fragment, useEffect, useState} from 'react'
import NumericInput from 'react-numeric-input';
import columns from './columns'

import {useDispatch, useSelector} from 'react-redux'
import {debounce} from "lodash";
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import {ChevronDown,} from 'react-feather'

import UILoader from '@components/ui-loader'
import Loader from '../../../../@core/components/spinner/Loader'

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Label,
    Row
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {fetchSchool, fetchSchools} from "@src/views/apps/schools/store";
import {
    fetchVirtualAccounts,
    setShowWithdrawModal
} from "@src/views/apps/finance/store";
import Sidebar from "@src/views/apps/finance/accounts/Sidebar";

const defaultValues = {
    amount: 0
}
const VirtualAccountsList = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const {loading, virtualAccounts, pages, selectedRequest,showWithDrawModal, error} = useSelector((store) => store.finance);
    const {userData} = useSelector((store) => store.auth);
    const schoolStore = useSelector(state => state.schools)

    // ** States
    const [schoolId, setSchoolId] = useState();
    const [selectedSchool, setSelectedSchool] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [nativeError, setNativeError] = useState(null)


    const [filterPayLoad, setFilterPayload] = useState({
        page: currentPage,
        size: rowsPerPage
    })

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
        let params = {}
        if (selectedSchool && selectedSchool.value){
            params = {schoolId:selectedSchool.value}
        }
        dispatch(fetchVirtualAccounts(params))
    }, [dispatch, selectedSchool])


    const schoolSearchFunction = (val) => {
        dispatch(fetchSchools({page: 0, size: 10, name: val}))
    }

    // ** Function in get data on search query change
    const debounceSearchSchools = debounce(schoolSearchFunction, 400);
    const handleSchoolSearch = val => {
        debounceSearchSchools(val)
    }


    useEffect(() => {
        // Clean up the debounced functions when the component unmounts
        return () => {
            debounceSearchSchools.cancel()
        };
    }, []);

    // ** Custom Pagination

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
                            sortIcon={<ChevronDown/>}
                            className='react-dataTable'
                            data={virtualAccounts}
                        />
                    </div>
                </Card>
                <Sidebar open={showWithDrawModal}
                         toggleSidebar={() => dispatch(setShowWithdrawModal(!showWithDrawModal))}/>
            </UILoader>
        </Fragment>
    )
}

export default VirtualAccountsList;
