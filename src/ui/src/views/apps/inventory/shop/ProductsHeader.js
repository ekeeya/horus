// ** Third Party Components
import classnames from 'classnames'
import { Menu } from 'react-feather'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown, Input
} from 'reactstrap'
import Select from "react-select";
import {useSelector} from "react-redux";
import {debounce} from "lodash";
import {fetchPosCenters, fetchSchools} from "@src/views/apps/schools/store";
import {useEffect, useState} from "react";
import AddItemModal from "@src/views/apps/inventory/shop/modals/AddItemModal";

const ProductsHeader = props => {

  const [selectedSchool, setSelectedSchool] =  useState({
    label :"Select School",
    value:""
  });

  const [selectedPos, setSelectedPos] = useState({
    label :"Filter By POS Center",
    value:""
  });

  const [showAddItems, setShowAddItems] =  useState(false);
  const [single, setSingle] = useState(true)
  // ** Props
  const {  dispatch, getProducts, store, setSidebarOpen } = props
  const { userData } = useSelector((store) => store.auth);
  const schoolStore =  useSelector(store=>store.schools)


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
  const posCenters=()=>{
    return schoolStore.posCenters.map(pos=>{
      return {
        label:pos.name,
        value:pos.id
      }
    })
  }

  useEffect(()=>{
    let schoolId =  selectedSchool && selectedSchool.value
    if (selectedSchool.value && selectedSchool.value !==""){
      schoolId = selectedSchool.value;
    }
    dispatch(fetchPosCenters(schoolId));
  }, [selectedSchool])

  useEffect(()=>{
    if(selectedPos.value && selectedPos.value !==""){
      dispatch(getProducts({posId:selectedPos.value}))
    }
  }, [selectedPos])

  return (
    <div className='ecommerce-header'>
      <Row>

        <Col sm='12'>
          <div className='ecommerce-header-items'>
            <div className='result-toggler'>
              <button className='navbar-toggler shop-sidebar-toggler' onClick={() => setSidebarOpen(true)}>
                <span className='navbar-toggler-icon d-block d-lg-none'>
                  <Menu size={14} />
                </span>
              </button>
              <span className='search-results' style={{fontSize:"10px"}}>{store.totalProducts} Results Found</span>
            </div>
            <div className='view-options d-flex'>
              <Row className='justify-content-end mx-0'>
                <Col xs={12} lg={10}>
                  <div className='d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-1 mb-lg-1'>
                    {!userData.school && (
                        <>
                          <div className='mt-50 width-350 me-1 mt-sm-0 mt-1'>
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
                          <div className='d-flex width-350 align-items-center me-1'>
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
                        </>
                    )}
                    <ButtonGroup>
                      <Button
                          tag='label'
                          className={classnames('btn view-btn')}
                          color='primary'
                          outline
                          onClick={() => {
                            setSingle(true)
                            setShowAddItems(true);
                          }}
                      >
                        Add&nbsp;item
                      </Button>
                      <Button
                          tag='label'
                          className={classnames('btn view-btn')}
                          color='primary'
                          outline
                          onClick={() => {
                            setSingle(false)
                            setShowAddItems(true);
                          }}
                      >
                        Bulk&nbsp;Import
                      </Button>
                    </ButtonGroup>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <AddItemModal
          single={single}
          posId={userData.accountType !== 'POS' ? selectedPos.value : userData.user.posCenter.id}
          open={showAddItems}
          closeModal={setShowAddItems}
          categories={store.categories}
      />
    </div>
  )
}

export default ProductsHeader
