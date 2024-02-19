// ** React Import
import {useEffect, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import {Button, Label, Form, Input, Row, Col, FormFeedback, Alert, UncontrolledTooltip} from 'reactstrap'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from "react-router-dom";
import {HelpCircle} from "react-feather";
import {registerPosCenter, setEdit, setSelectedPosCenter, setSelectedSchool} from "@src/views/apps/schools/store";

const defaultValues = {
  name: '',
  username: '',
  password: '',
  telephone:'',
  confirmPassword: '',
  lastName:'',
  firstName:'',
}
const SidebarPosCenter = ({ open, toggleSidebar }) => {
  const checkIsValid = data => {
    if(data.username){
      if (!data.password || data.password ==="" || data.password !== data.confirmPassword){
        setError("password", {
          type: 'manual'
        })
        setError("confirmPassword", {
          type: 'manual',
          message:'Passwords do not match.'
        })
        return false;
      }
    }
    return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
  }

  // ** States
  const [data, setData] = useState(null)
  const [school, setSchool] =  useState();
  const [noSchoolError, setNoSchoolError] = useState();

  // ** Store Vars
  const dispatch = useDispatch()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const {selectedSchool, selectedPosCenter, edit} = useSelector(state => state.schools)
  const {userData} = useSelector(state => state.auth)

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  useEffect(()=>{
    if(selectedPosCenter){
      setValue("name", selectedPosCenter.name)
      setSchool(selectedPosCenter.schoolId)
    }
  },[selectedPosCenter])

  useEffect(()=>{
    const schoolId = queryParams.get("school");

    if(userData.school){
      setSchool(userData.school.id)
    }
    else if(schoolId){
      setSchool(schoolId)
    }
    else if(selectedSchool){
      // check stop
      setSchool(selectedSchool.value)
    }else{
      setNoSchoolError("No school is selected");
    }
  }, [school, selectedSchool])

  // ** Function to handle form submit
  const onSubmit = data => {
    setData(data)
    const formData = data;
    const userFields = ["username", "firstName", "lastName", "telephone", "password", "confirmPassword"]
    if(data.username === undefined || data.username === null || data.username === ""){
      userFields.forEach(field=>{
        delete data[field];
      })
    }else{
      const attendant = {}
      // construct user object
      userFields.forEach(field=>{
        if(field !== "confirmPassword"){
          attendant[field] =  formData[field]
        }
        delete formData[field];
      });
      formData["attendant"]=attendant;
    }
    if (checkIsValid(formData)) {
      if(school){
        formData["schoolId"] = school;
        if(edit){
          formData["id"] = selectedPosCenter.id
        }
        dispatch(registerPosCenter(formData));
        toggleSidebar();
      }

    } else {
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined && formData[key].length === 0) {
          console.log("fff")
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setData(null)
    dispatch(setEdit(false));
    dispatch(setSelectedPosCenter(null));
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title={edit ? `Update Point of Sale center` :`Register Point Of Sale Center`}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Pos Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input id='name' placeholder='e.g. Western POS' invalid={errors.name && true} {...field} />
            )}
          />
        </div>
        <div className='divider'>
          { edit ?
            <div className='divider-text'>Add New POS Attendant</div>
              :
              <div className='divider-text'>Create POS Attendant</div>
          }
        </div>
        <Row className='mb-1'>
          <Col md='6' sm='12'>
            <Label className='form-label' for='firstname'>
              First Name <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                    <Input id='firstName' placeholder='John' invalid={errors.firstName && true} {...field} />
                )}
            />
          </Col>
          <Col md='6' sm='12'>
            <Label className='form-label' for='lastName'>
              Last Name <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                    <Input id='lastName' placeholder='Doe' invalid={errors.lastName && true} {...field} />
                )}
            />

          </Col>
        </Row>
        <Row className='mb-1'>
          <Col md='6' sm='12'>
            <Label className='form-label' for='username'>
              Username <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='username'
                control={control}
                render={({ field }) => (
                    <Input id='username' placeholder='jdoe' invalid={errors.username && true} {...field} />
                )}
            />
          </Col>
          <Col md='6' sm='12'>
            <Label className='form-label' for='contact'>
              Telephone <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='telephone'
                control={control}
                render={({ field }) => (
                    <Input id='telephone' placeholder='256787XXXXXX' invalid={errors.telephone && true} {...field} />
                )}
            />
          </Col>
        </Row>
        <Row className='mb-1'>
          <Col md='6' sm='12'>
            <Label className='form-label' for='password'>
              Password <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='password'
                control={control}
                render={({ field }) => (
                    <Input id='password' type="password" invalid={errors.password && true} {...field} />
                )}
            />
          </Col>
          <Col md='6' sm='12'>
            <Label className='form-label' for='confirmPassword'>
              Confirm Password <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='confirmPassword'
                control={control}
                render={({ field }) => (
                    <Input id='confirmPassword' type="password" invalid={errors.confirmPassword  && true} {...field} />
                )}
            />
            {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
          </Col>
        </Row>
        <Button type='submit' className='me-1' color='primary'>
          {
            edit ? "Update" : "Register"
          }
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
      <div className='divider'></div>
      { !school &&  (<Alert color='danger'>
        <div className='alert-body font-small-2'>
          <p>
            <small className='me-50'>
              <span className='fw-bold'>Error:</span> {noSchoolError}
            </small>
          </p>
        </div>
        <HelpCircle
            id='login-tip'
            className='position-absolute'
            size={18}
            style={{top: '10px', right: '10px'}}
        />
        <UncontrolledTooltip target='login-tip' placement='left'>
          Close this sidebar and select a school from the Filters then come back.
        </UncontrolledTooltip>
      </Alert>)}
    </Sidebar>
  )
}
export default SidebarPosCenter
