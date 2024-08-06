// ** React Imports
import {Fragment, useState, forwardRef, useEffect} from 'react'

// ** Table Data & Columns

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, FileText, File, Grid } from 'react-feather'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown, Label
} from 'reactstrap'
import {columns} from "@src/views/apps/transactions/commissions/columns";
import {useDispatch, useSelector} from "react-redux";
import Loader from "@components/spinner/Loader";
import UILoader from "@components/ui-loader";
import {fetchTransactions} from "@src/views/apps/transactions/store";
import Select from "react-select";
import {debounce} from "lodash";
import {fetchSchools} from "@src/views/apps/schools/store";
import {fetchUsers} from "@src/views/apps/user/store";
import Flatpickr from "react-flatpickr";
import {convertDate, todayDates} from "@utils";
import {useLocation} from "react-router-dom";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const CommissionsTransactions = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [selectedSchool, setSelectedSchool] =  useState({
    label :"Filter By School",
    value:""
  });
  const [selectedParent, setSelectedParent] = useState({
    label :"Filter By Student",
    value:""
  });
  const [dateRange, setDateRange] =  useState(todayDates());
  const [filterPayLoad, setFilterPayload] = useState()

  const  dispatch = useDispatch();

  const {loading, transactions, pages} =  useSelector(store => store.transactions)
  const { userData } = useSelector((store) => store.auth);
  const schoolStore =  useSelector(store=>store.schools)
  const {users} =  useSelector(store=>store.users)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const schoolSearchFunction=(val)=>{
    dispatch(fetchSchools({page:0, size:10, name:val}))
  }


  const debounceSearchSchools = debounce(schoolSearchFunction, 400);
  const handleSchoolSearch = val =>{
    debounceSearchSchools(val)
  }

  const renderSchools =()=>{
    return schoolStore.schools.map(school=>{
      return {
        value:school.id,
        label:school.name
      }
    })
  }

  const handleParentSearch = val => {
    const configs = {
      page: 0,
      size: 10,
      accountType: "PARENT",
      name: val
    }
    setTimeout(() => {
      dispatch(fetchUsers(configs))
    }, 400)
  }

  const students = () => {
    return users.map(parent => {
      if (parent.role === "PARENT") {
        return {
          value: parent.id,
          label: `${parent.fullName} (${parent.telephone})`
        }
      }
    })
  }

  const exportReport = (type)=>{
    setFilterPayload({
      ...filterPayLoad,
      format:type
    })
  }

  useEffect(()=>{
    if(userData.school){
      setSelectedSchool({
        value:userData.school.id,
        label:userData.school.name
      });
    }
  }, [userData])

  useEffect(()=>{
    let schoolId =  queryParams.get("school");
    let configs = {
      page:currentPage,
      size:rowsPerPage,
      type:"COMMISSIONS"
    }

    if(selectedSchool && selectedSchool.value!==""){
      delete configs["parent"]
      configs["school"] =  selectedSchool.value;
    }
    if(schoolId !== null){
      configs["school"] =  schoolId;
    }
    if(dateRange.length === 2){
      configs["lowerDate"] = convertDate(dateRange[0])
      configs["upperDate"]=convertDate(dateRange[1])
    }
    setFilterPayload({...configs});
  },[selectedSchool, selectedParent, dateRange])


  useEffect(() => {
    if (filterPayLoad){
      dispatch(fetchTransactions(filterPayLoad))
    }
  }, [dispatch, filterPayLoad])
  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)
  }

  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
    const params = filterPayLoad;
    delete params["format"]
    setFilterPayload({...params, size:value})
  }
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    setFilterPayload({...filterPayLoad, page:page.selected});
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={pages}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <Fragment>
      <UILoader blocking={loading} loader={<Loader />}>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'>Commission Transactions</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <UncontrolledButtonDropdown>
              <DropdownToggle color='secondary' caret outline>
                <Share size={15} />
                <span className='align-middle ms-50'>Export</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Grid size={15} />
                  <span className='align-middle ms-50' onClick={() => exportReport("excel")} >Excel</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col xs={12} lg={2} className='d-flex align-items-center'>
            <div className='d-flex align-items-center justify-content-center mt-lg-1 mb-lg-1 justify-content-lg-start'>
              <label htmlFor='rows-per-page'>Show</label>
              <Input
                  className='mx-50'
                  type='select'
                  id='rows-per-page'
                  onChange={handlePerPage}
                  value={rowsPerPage}
                  style={{width: '5rem'}}
              >
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
              </Input>
              <label htmlFor='rows-per-page'>Entries</label>
            </div>
          </Col>
          <Col xs={12} lg={10}>
            <div className='d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-1 mb-lg-1'>

              <div className='d-flex align-items-center me-1 width-300'>
                <Flatpickr
                    value={dateRange}
                    id='range-picker'
                    data-enable-time
                    className='form-control'
                    onChange={date => setDateRange(date)}
                    options={{
                      mode: 'range',
                      defaultDate: dateRange
                    }}
                />
              </div>
              {/*<div className='d-flex align-items-center me-1'>
                <Select
                    isSearchable
                    isClearable={true}
                    value={selectedParent}
                    isLoading={loading}
                    placeholder="Filter By Sender"
                    options={students()}
                    name="primaryParent"
                    onInputChange={(val) => handleParentSearch(val)}
                    classNamePrefix='select'
                    onChange={v => setSelectedParent(v)}
                />
              </div>*/}
              {!userData.school && (
                  <div className='mt-50 width-250 me-1 mt-sm-0 mt-1'>
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
                  </div>
              )}
            </div>
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            selectableRows
            columns={columns}
            paginationPerPage={rowsPerPage}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={transactions}
          />
        </div>
      </Card>
      </UILoader>
    </Fragment>
  )
}

export default CommissionsTransactions
