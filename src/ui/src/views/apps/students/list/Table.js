// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Sidebar
import Sidebar from './Sidebar'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import {bulkStudentUpload, fetchStudents} from '../store'

import { useDispatch, useSelector } from 'react-redux'
import {debounce} from "lodash";

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import {ChevronDown, Share, FileText, Grid, UploadCloud, PlusCircle, DownloadCloud, X} from 'react-feather'

// Custom Components
import UILoader from '@components/ui-loader'
import Loader from '../../../../@core/components/spinner/Loader'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem, Form, Alert, UncontrolledTooltip, Spinner
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {fetchSchools} from "@src/views/apps/schools/store";
import {useDropzone} from "react-dropzone";
import toast from "react-hot-toast";
import {clearError} from "@src/views/apps/students/store";

// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, displayModal }) => {

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
            <UncontrolledDropdown size="sm" className='me-1'>
              <DropdownToggle color='secondary' caret outline>
                <Share className='font-small-4 me-50' />
                <span className='align-middle'>Export</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Grid className='font-small-4 me-50' />
                  <span className='align-middle'>Excel</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <div className='me-1'>
            <Button.Ripple size="sm" outline color='primary'  onClick={() => displayModal()}>
              <UploadCloud size={14} />
              <span className='align-middle ms-25'>Bulky Load Students</span>
            </Button.Ripple>
            </div>

            <Button size="sm" className='add-new-user' color='primary' onClick={toggleSidebar}>
              <PlusCircle size={14} />
              <span className='align-middle ms-25'>Register Student</span>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const StudentList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.students)
  const { loading, students, pages, edit, error, submitted } = useSelector((store) => store.students);
  const { userData } = useSelector((store) => store.auth);
  const schoolStore = useSelector(state => state.schools)

  // ** States
  const [sort, setSort] = useState()
  const [sortColumn, setSortColumn] = useState()
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolId, setSchoolId] = useState()
  const [classId, setClassID] = useState()
  const [parentId, setParentId] = useState()
  const [showModal, setShowModal] =  useState(false)
  const [selectedSchool, setSelectedSchool] =  useState({});
  const [selectedClass, setSelectedClass] =  useState({});
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterPayLoad, setFilterPayload] = useState({
    page:currentPage,
    size:rowsPerPage
  })
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error('You can only upload CSV Files!.')
      } else {
        setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    }
  });

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }
  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
      <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
        <div className='file-details d-flex align-items-center'>
          <div className='file-preview me-1'>{renderFilePreview(file)}</div>
          <div>
            <p className='file-name mb-0'>{file.name}</p>
            <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
          </div>
        </div>
        <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
          <X size={14} />
        </Button>
      </ListGroupItem>
  ))

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(()=>{
    if(userData.school){
      setSelectedSchool({
        value:userData.school.id,
        label:userData.school.name,
        classes:userData.school.classes,
      });
    }
  }, [userData])

  useEffect(()=>{
    if(selectedSchool){
      setSchoolId(selectedSchool.value)
    }
    if(selectedClass){
      setClassID(selectedClass.value)
    }
  },[selectedSchool, selectedClass])


  useEffect(()=>{
    let configs = {
      page:currentPage,
      size:rowsPerPage
    }
    if(schoolId){
      configs["schoolId"] =  schoolId;
    }
    if(classId){
      configs["classId"] =  classId;
    }
    if(parentId){
      configs["parentId"] =  parentId;
    }
    setFilterPayload(configs);
  },[schoolId,classId,parentId])
  // ** Get data on mount
  useEffect(() => {
    dispatch(fetchStudents(filterPayLoad))
  }, [dispatch, filterPayLoad])


  useEffect(() => {
    if(edit){
      toggleSidebar()
    }
  }, [edit])

  useEffect(()=>{
        setTimeout(()=>{
          dispatch(clearError())
        }, 5000)
  },[error])


  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
        fetchStudents({
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
        fetchStudents({
          ...filterPayLoad,
        size: value,
        page: 0
      })
    )
  }
  const schoolSearchFunction=(val)=>{
    dispatch(fetchSchools({page:0, size:10, name:val}))
  }

  const studentSearchFunction=(config)=>{
    dispatch(fetchStudents(config))
  }

  const debounceSearchStudent = debounce(studentSearchFunction, 400);

  // ** Function in get data on search query change
  const debounceSearchSchools = debounce(schoolSearchFunction, 400);
  const handleSchoolSearch = val =>{
    debounceSearchSchools(val)
  }
  const handleStudentSearch = val =>{
    setSearchTerm(val)
    const configs = {
      ...filterPayLoad,
      page:0,
    }
    if(val.length > 0){
      configs["name"]=val;
    }
    debounceSearchStudent(configs)
  }

  useEffect(() => {
    // Clean up the debounced functions when the component unmounts
    return () => {
      debounceSearchStudent.cancel();
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

  const handleBulkStudentsUpload=()=>{
    let file
    if (files.length > 0){
      file = files[0]
      const form = new FormData();
      form.set("schoolId", schoolId);
      form.set("file", file);
      dispatch(bulkStudentUpload(form));
      if((!error && submitted)){
        setShowModal(false);
      }else{
        setFiles([])
      }
    }else{
      toast.error("File missing, please upload a csv file to continue")
    }

  }
  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
  }

  const displayModal=()=>{
    setShowModal(true)
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
              <Label className='form-label' for='class'>
                Student Name:
              </Label>
              <Input
                  id='search-student'
                  className='ms-50 w-100'
                  placeholder='Search student by name'
                  type='text'
                  value={searchTerm}
                  onChange={e => handleStudentSearch(e.target.value)}
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
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={students}
            subHeaderComponent={
              <CustomHeader
                store={store}
                rowsPerPage={rowsPerPage}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
                displayModal={displayModal}
              />
            }
          />
        </div>
      </Card>
      {<Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />}

        <Modal
            isOpen={showModal}
            className='modal-dialog-centered'>
          <ModalHeader>Bulk Upload Students</ModalHeader>
          <ModalBody>
            <CardBody>
              {
                userData.role !== "SCHOOL" &&
                (<Fragment>
                  <Label className='form-label' for='class'>
                    Select School
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
                </Fragment>)
              }
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='d-flex align-items-center justify-content-center flex-column'>
                  <DownloadCloud size={64} />
                  <h5>Drop Files here or click to upload</h5>
                  <p className='text-secondary'>
                    Drop files here or click{' '}
                    <a href='/' onClick={e => e.preventDefault()}>
                      browse
                    </a>{' '}
                    thorough your machine
                  </p>
                </div>
              </div>
              {error && (<Alert color='danger' className="mt-1">
                <div className='alert-body font-small-2'>
                  <p>
                    <small className='me-lg-1'>
                      <span className='fw-bold'>Error:</span>
                    </small>
                  </p>
                  <p>
                    <small className='me-50'>
                      {error}
                    </small>
                  </p>
                </div>
                <X
                    onClick={() => dispatch(clearError())}
                    id='clear-error-tip'
                    className='position-absolute'
                    size={18}
                    style={{top: '10px', right: '10px'}}
                />
                <UncontrolledTooltip target='clear-error-tip' placement='top'>
                  Remove
                </UncontrolledTooltip>
              </Alert>)}
              {files.length ? (
                  <ListGroup className='my-2'>{fileList}</ListGroup>
              ) : null}
            </CardBody>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => handleBulkStudentsUpload()}>
              {
                  loading && <Spinner color='light' size='sm'/>
              }
              Upload
            </Button>
            <Button color="default" onClick={() => {
              setShowModal(false);
              setFiles([]);
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </UILoader>
    </Fragment>
  )
}

export default StudentList
