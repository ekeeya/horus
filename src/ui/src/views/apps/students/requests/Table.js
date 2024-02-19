// ** React Imports
import {Fragment, useState, useEffect, forwardRef} from 'react'


// ** Table Columns
import { columns } from './columns'

// ** Store & Actions

import { useDispatch, useSelector } from 'react-redux'
import {debounce} from "lodash";

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import {ChevronDown, Share, FileText, Grid, X} from 'react-feather'

// Custom Components
import UILoader from '@components/ui-loader'
import Loader from '../../../../@core/components/spinner/Loader'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Label,
  CardBody,
  CardTitle,
  CardHeader, ButtonGroup, Button, UncontrolledTooltip
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {approveLinkRequest, getLinkRequests, walletManagement} from "@src/views/apps/students/store";
import {fetchSchools} from "@src/views/apps/schools/store";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {FcApproval, FcCancel} from "react-icons/fc";
import toast from "react-hot-toast";

// ** Table Header
const CustomHeader = ({ handlePerPage, rowsPerPage, bulkApprovalAction }) => {

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
              style={{ width: '5rem' }}
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
          <div className='d-flex align-items-center table-header-actions'>
            <ButtonGroup className='mb-1'>
              <Button onClick={()=>bulkApprovalAction("approve")} size='sm' outline color='success' id={`approve-selected-tooltip`} >
                <FcApproval size={15} />
              </Button>
              <UncontrolledTooltip placement='top' target={`approve-selected-tooltip`}>
                Approve Selected
              </UncontrolledTooltip>
              <Button onClick={()=>bulkApprovalAction("reject")} size='sm' outline color='danger' id={`cancel-selected-tooltip`}>
                <FcCancel size={15} />
              </Button>
              <UncontrolledTooltip placement='top' target={`cancel-selected-tooltip`}>
                Cancel Selected
              </UncontrolledTooltip>
            </ButtonGroup>

          </div>
        </Col>
      </Row>
    </div>
  )
}

const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
      <Input type='checkbox' ref={ref} {...props} />
    </div>
))
const MySwal = withReactContent(Swal)
const LinkRequestList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.students)
  const { loading, linkRequests, pages } = useSelector((store) => store.students);
  const { userData } = useSelector((store) => store.auth);
  const schoolStore = useSelector(state => state.schools)

  // ** States
  const [sort, setSort] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolId, setSchoolId] = useState()
  const [selectedSchool, setSelectedSchool] =  useState({
    label:"Filter By school",
    value:0
  });

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRows, setSelectedRows] = useState([]);
  const [statuses, setStatuses] = useState([
    {label:"PENDING", value:"PENDING"},
    {label:"APPROVED", value:"APPROVED"},
    {label:"REJECTED", value:"REJECTED"}
  ]);
  const [status, setStatus] = useState({label:"PENDING", value:"PENDING"});
  const [filterPayLoad, setFilterPayload] = useState({
    page:currentPage,
    size:rowsPerPage,
    status:status.value
  })

  // ** Function to toggle sidebar

  const bulkApprovalAction =(action, single)=>{
    const rows =  selectedRows;
    const requestIds =  rows.map(r=>{
      return r.id;
    })
    const approve =  action === "approve";
    const payload =  {
      requestIds,
      approve
    }
    if(rows.length > 0 ){
      return MySwal.fire({
        title: 'continue?',
        text: `You are about to ${action} ${rows.length} selected request`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action} requests!`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          dispatch(approveLinkRequest(payload));
        }
      })
    }else{
      toast.error("Please select at least 1 pending request in order to continue",{
        position:"bottom-right"
      })
    }
  }

  const handleRowSelected = (rows) => {
    //filter only pending
    const cleanRows = rows.selectedRows.filter(r=>{
      return r.status === "PENDING"
    })
    setSelectedRows(cleanRows);
  };


  useEffect(()=>{
    if(userData.school){
      setSelectedSchool({
        value:userData.school.id,
        label:userData.school.name
      });
    }
  }, [userData])

  useEffect(()=>{
    if(selectedSchool){
      setSchoolId(selectedSchool.value)
    }
  },[selectedSchool])


  useEffect(()=>{
    let configs = {
      page:currentPage,
      size:rowsPerPage,
      status:status? status.value : "PENDING"
    }
    if(schoolId){
      configs["school"] =  schoolId;
    }
    setFilterPayload(configs);
  },[schoolId, status])
  // ** Get data on mount
  useEffect(() => {
    dispatch(getLinkRequests(filterPayLoad))
  }, [dispatch, filterPayLoad])

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch( getLinkRequests({
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
        getLinkRequests({
          ...filterPayLoad,
        size: value,
        page: 0
      })
    )
  }
  const schoolSearchFunction=(val)=>{
    dispatch(fetchSchools({page:0, size:10, name:val}))
  }


  // ** Function in get data on search query change
  const debounceSearchSchools = debounce(schoolSearchFunction, 400);
  const handleSchoolSearch = val =>{
    debounceSearchSchools(val)
  }

  useEffect(() => {
    // Clean up the debounced functions when the component unmounts
    return () => {
      debounceSearchSchools.cancel()
    };
  }, []);
  const handleFilter = val => {
    setSearchTerm(val)
  }
  // ** Custom Pagination
  const CustomPagination = () => {
    const count =  pages

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

  const renderSchools =()=>{
    return schoolStore.schools.map(school=>{
      return {
        value:school.id,
        label:school.name,
        classes:school.classes
      }
    })
  }

  return (
    <Fragment>
      <UILoader blocking={loading} loader={<Loader />}>
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
                      onInputChange={(val)=>handleSchoolSearch(val)}
                      placeholder="Select School"
                      options={renderSchools()}
                      name="school"
                      onChange={v=>setSelectedSchool(v)}
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
            selectableRows
            onSelectedRowsChange={(rows)=>handleRowSelected(rows)}
            selectableRowsComponent={BootstrapCheckbox}
            paginationServer
            columns={columns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={linkRequests}
            subHeaderComponent={
              <CustomHeader
                store={store}
                rowsPerPage={rowsPerPage}
                handlePerPage={handlePerPage}
                bulkApprovalAction={bulkApprovalAction}
              />
            } 
          />
        </div>
      </Card>

      </UILoader>
    </Fragment>
  )
}

export default LinkRequestList
