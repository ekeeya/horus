import {Fragment, useState, forwardRef, useEffect} from 'react'

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
  UncontrolledButtonDropdown
} from 'reactstrap'
import {columns} from "@src/views/apps/inventory/sales/columns";
import {useDispatch, useSelector} from "react-redux";
import Loader from "@components/spinner/Loader";
import UILoader from "@components/ui-loader";
import Select from "react-select";
import {debounce} from "lodash";
import {fetchPosCenters, fetchSchools} from "@src/views/apps/schools/store";
import Flatpickr from "react-flatpickr";
import {convertDate, todayDates} from "@utils";
import {useLocation} from "react-router-dom";
import {getOrders, getSales} from "@src/views/apps/inventory/store";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
      <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const Orders = (props) => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [student, setStudent] =  useState();
  const [selectedSchool, setSelectedSchool] =  useState({
    label :"Filter By School",
    value:""
  });
  const [selectedPos, setSelectedPos] = useState({
    label :"Filter By POS Center",
    value:""
  });
  const [dateRange, setDateRange] =  useState(todayDates());
  const [filterPayLoad, setFilterPayload] = useState({
    page:currentPage,
    size:rowsPerPage
  })

  const  dispatch = useDispatch();

  const {loading, sales, pages} =  useSelector(store => store.inventory)
  const { userData } = useSelector((store) => store.auth);
  const schoolStore =  useSelector(store=>store.schools)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const schoolSearchFunction=(val)=>{
    dispatch(fetchSchools({page:0, size:10, name:val}))
    if(selectedPos && selectedPos.value !==""){
      // clear it
      setSelectedPos({ label :"Filter By POS Center", value:""})
    }
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


  useEffect(()=>{
    if(userData.school){
      setSelectedSchool({
        value:userData.school.id,
        label:userData.school.name
      });
    }
  }, [userData])

  useEffect(()=>{
    let studentId =  queryParams.get("student");
    if(!studentId){
      studentId = props.student;
    }
    if(studentId){
      setStudent(studentId);
      const payload = {
        ...filterPayLoad,
        student:studentId
      }
      setFilterPayload(payload);
    }
  }, [student])

  useEffect(()=>{
    let schoolId =  queryParams.get("school");
    if (selectedSchool.value && selectedSchool.value !==""){
      schoolId = selectedSchool.value;
    }
    dispatch(fetchPosCenters(schoolId));
  }, [selectedSchool])




  useEffect(()=>{
    let configs = {
      page:currentPage,
      size:rowsPerPage,
    }
    if(selectedSchool && selectedSchool.value!==""){
      configs["school"] =  selectedSchool.value;
    }
    if(selectedPos && selectedPos.value !==null){
      configs["posId"] =  selectedPos.value;
    }


    if(dateRange.length === 2){
      configs["lowerDate"] = convertDate(dateRange[0])
      configs["upperDate"]=convertDate(dateRange[1])
    }
    setFilterPayload({...configs});
  },[selectedSchool, dateRange, selectedPos])


  useEffect(() => {
    dispatch(getSales(filterPayLoad))
  }, [dispatch, filterPayLoad])
  // ** Function to handle filter

  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
    dispatch(
        getSales({
          ...filterPayLoad,
          size: value,
          page: 0
        })
    )
  }
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const posCenters=()=>{
    return schoolStore.posCenters.map(pos=>{
      return {
        label:pos.name,
        value:pos.id
      }
    })
  }

  const exportReport = (type)=>{
    setFilterPayload({
      ...filterPayLoad,
      format:type
    })
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
              <CardTitle tag='h4'>Orders</CardTitle>
              <div className='d-flex mt-md-0 mt-1'>
                <UncontrolledButtonDropdown>
                  <DropdownToggle color='secondary' caret outline>
                    <Share size={15} />
                    <span className='align-middle ms-50'>Export</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem className='w-100' onClick={() => exportReport("excel")} >
                      <Grid size={15} />
                      <span className='align-middle ms-50'>Excel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <Row className='justify-content-end mx-0'>
              <Col xs={12} lg={2} className='d-flex align-items-center'>
                <div className='d-flex mt-lg-1 mb-lg-1 align-items-center justify-content-center justify-content-lg-start'>
                  <label htmlFor='rows-per-page'>Show</label>
                  <Input
                      className='mx-50'
                      type='select'
                      id='rows-per-page'
                      onChange={handlePerPage}
                      value={rowsPerPage}
                      style={{ width: '5rem' }}
                  >
                    <option value='10'>10</option>
                    <option value='25'>25</option>
                    <option value='50'>50</option>
                  </Input>
                  <label htmlFor='rows-per-page'>Entries</label>
                </div>
              </Col>
              {student && (<Col xs={12} lg={10} ></Col>)}
              {!student && (<Col xs={12} lg={10}>
                <div
                    className='d-flex align-items-center justify-content-lg-end justify-content-start mt-lg-1 mb-lg-1 flex-md-nowrap flex-wrap mt-1'>

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
                  {!userData.school && (
                      <div className='mt-50 width-250 me-1 mt-sm-0 mt-1'>
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
                      </div>)}
                  <div className='d-flex align-items-center me-1'>
                    <Select
                        isSearchable
                        isClearable={true}
                        value={selectedPos}
                        isLoading={schoolStore.loading}
                        placeholder="Filter By POS Center"
                        options={posCenters()}
                        name="posCenter"
                        classNamePrefix='select'
                        onChange={v => setSelectedPos(v)}
                    />
                  </div>
                </div>
              </Col>)}
            </Row>
            <div className='react-dataTable react-dataTable-selectable-rows'>
              <DataTable
                  noHeader
                  pagination
                  selectableRows={false}
                  columns={columns}
                  paginationPerPage={7}
                  className='react-dataTable'
                  sortIcon={<ChevronDown size={10} />}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={currentPage + 1}
                  //selectableRowsComponent={BootstrapCheckbox}
                  data={sales}
              />
            </div>
          </Card>
        </UILoader>
      </Fragment>
  )
}

export default Orders;
