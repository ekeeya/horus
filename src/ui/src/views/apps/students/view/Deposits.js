
import {Fragment, useState, forwardRef, useEffect} from 'react'

import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, File, Grid } from 'react-feather'

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
  UncontrolledButtonDropdown,
} from 'reactstrap'
import {columns} from "@src/views/apps/transactions/collections/columns";
import {useDispatch, useSelector} from "react-redux";
import Loader from "@components/spinner/Loader";
import UILoader from "@components/ui-loader";
import {fetchTransactions} from "@src/views/apps/transactions/store";

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
      <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const Deposits = (props) => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterPayLoad, setFilterPayload] = useState({})
  const  dispatch = useDispatch();

  const {loading, deposits, pages} =  useSelector(store => store.transactions)


  useEffect(() => {
    const params ={...filterPayLoad, student:props.student, type:"COLLECTION"};
    setFilterPayload(params)
  }, [props]);

  useEffect(() => {
    dispatch(fetchTransactions(filterPayLoad))
  }, [dispatch, filterPayLoad])
  // ** Function to handle filter

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
          <Card className="table-responsive">
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>Purchase Transactions</CardTitle>
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
            </Row>
            <div className='react-dataTable react-dataTable-selectable-rows'>
              <DataTable
                  noHeader
                  pagination
                  selectableRows
                  columns={columns}
                  paginationPerPage={7}
                  className='react-dataTable'
                  sortIcon={<ChevronDown size={10} />}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={currentPage + 1}
                  selectableRowsComponent={BootstrapCheckbox}
                  data={deposits}
              />
            </div>
          </Card>
        </UILoader>
      </Fragment>
  )
}

export default Deposits
