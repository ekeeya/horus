// ** React Import
import {useEffect, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import {debounce} from "lodash";
import {fetchSchools} from "@src/views/apps/schools/store";
import {fetchUsers} from "@src/views/apps/user/store";
import {registerStudent} from "@src/views/apps/students/store";

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  school:null,
  classRoom:null
}



const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? (field !== null && field) : JSON.stringify(field).length > 0))
}

const SidebarNewStudent = ({ open, toggleSidebar }) => {
  // ** States
  const [selectedParent, setSelectedParent] =  useState({});
  const [selectedSchool, setSelectedSchool] =  useState({});
  const [selectedClass, setSelectedClass] =  useState({});
  const [parents, setParents] = useState([])

  const { userData } = useSelector((store) => store.auth);
  const schoolStore = useSelector(state => state.schools)
  const userStore= useSelector(state => state.users)
  const { users, error} = useSelector((store) => store.users);


  // ** Store Vars
  const dispatch = useDispatch();

  useEffect(()=>{
    if(userData.school){
      setSelectedSchool({
        value:userData.school.id,
        label:userData.school.name,
        classes:userData.school.classes,
      });
    }
    async function fetchParents(){
      const configs = {
        page: 0,
        size: 10,
        parents:true
      }
      await dispatch(fetchUsers(configs))
    }
    fetchParents().catch((error=>{console.log(error)}))
  },[])

  useEffect(()=>{
    const ps =   users.map(parent => {
      return {
        value: parent.id,
        label: `${parent.fullName} (${parent.telephone})`
      }
    });
    setParents(ps)
  }, [users])

  const schoolSearchFunction=(val)=>{
    dispatch(fetchSchools({page:0, size:10, name:val}))
  }
  const debounceSearchSchools = debounce(schoolSearchFunction, 400);

  const handleSchoolSearch = val =>{
    debounceSearchSchools(val)
  }

  const handleParentSearch = val =>{
    const  configs = {
      page:0,
      size:10,
      parents:true,
      name:val
    }
    setTimeout(()=>{
      dispatch(fetchUsers(configs))
    },400)
  }

  useEffect(()=>{
    return () => {
      debounceSearchSchools.cancel()
    };
  },[])
  const renderSchools =()=>{
    return schoolStore.schools.map(school=>{
      return {
        value:school.id,
        label:school.name,
        classes:school.classes
      }
    })
  }

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    const formData = {
      ...data,
      classRoom:selectedClass.value === undefined ? null: selectedClass.label,
      school:selectedSchool.value === undefined ? null:selectedSchool.value,
      parent:selectedParent.value === undefined ? null : selectedParent.value
    }
    delete formData["selectedClass"]
    delete formData["selectedSchool"]
    delete formData["selectedParent"]
    if (!selectedParent.value){
      delete  formData["parent"]
    }
    if (checkIsValid(formData)) {
      dispatch(registerStudent(formData))
      toggleSidebar()
    } else {
      for (const key in formData) {
        if(formData[key] === null ){
          setError(key, {
            type: 'manual'
          })
        }
        else if (formData[key] !== null  && (formData[key].length === 0)) {
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
  }

  return (
      <Sidebar
          size='lg'
          open={open}
          title='Register Student'
          headerClassName='mb-1'
          contentClassName='pt-0'
          toggleSidebar={toggleSidebar}
          onClosed={handleSidebarClosed}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-1'>
            <Label className='form-label' for='firstName'>
              First Name <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                    <Input id='firstName' placeholder='Jane' invalid={errors.firstName && true} {...field} />
                )}
            />
          </div>

          <div className='mb-1'>
            <Label className='form-label' for='middleName'>
              Middle Name <span className='text-muted'>(optional)</span>
            </Label>
            <Controller
                name='middleName'
                control={control}
                render={({ field }) => (
                    <Input id='middleName' placeholder='Ewin'  {...field} />
                )}
            />
          </div>
          <div className='mb-1'>
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
          </div>
          {
            userData.role !== 'SCHOOL' && (
                  <div className='mb-1'>
                    <Label className='form-label' for='selectedSchool'>
                      School <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='selectedSchool'
                        control={control}
                        render={({field}) => (
                            <Select
                                isSearchable
                                isClearable={true}
                                isLoading={schoolStore.loading}
                                onInputChange={(val) => handleSchoolSearch(val)}
                                placeholder="Select School"
                                options={renderSchools()}
                                classNamePrefix='select'
                                className={classnames('react-select', { 'is-invalid': errors.school })}
                                {...field}
                                name="school"
                                onChange={v => setSelectedSchool(v)}
                            />
                        )}
                    />
                  </div>
              )
          }
          <div className='mb-1'>
            <Label className='form-label' for='selectedClass'>
              Class <span className='text-danger'>*</span>
            </Label>
            <Controller
                name='selectedClass'
                control={control}
                render={({field}) => (
                    <Select
                        isSearchable
                        isClearable={true}
                        placeholder="Select Class"
                        options={selectedSchool && selectedSchool.classes}
                        name="selectedClass"
                        classNamePrefix='select'
                        className={classnames('react-select', { 'is-invalid': errors.classRoom })}
                        {...field}
                        onChange={v=>setSelectedClass(v)}
                    />
                )}
            />
          </div>
          <div className='divider'>
            <div className='divider-text'>Attach Guardian</div>
          </div>
          <div className='mb-1'>
            <Label className='form-label' for='selectedParent'>
              Primary Guardian <span className='text-muted'>(Optional)</span>
            </Label>
            <Controller
                name='selectedParent'
                control={control}
                render={({field}) => (
                    <Select
                        isSearchable
                        isClearable={true}
                        isLoading={userStore.loading}
                        placeholder="Select Guardian"
                        options={parents}
                        name="selectedParent"
                        onInputChange={(val) => handleParentSearch(val)}
                        classNamePrefix='select'
                        {...field}
                        onChange={v=>setSelectedParent(v)}
                    />
                )}
            />
          </div>
          <Button type='submit' className='me-1' color='primary'>Submit</Button>
          <Button type='reset' color='secondary' outline onClick={toggleSidebar}>Cancel</Button>
        </Form>
      </Sidebar>
  )
}

export default SidebarNewStudent
