// ** React Import
import {useEffect, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'
import {useForm, Controller} from 'react-hook-form'
import {selectThemeColors} from '@utils'

// ** Reactstrap Imports
import {Button, Label, FormText, Form, Input, Col, Row, Spinner, FormFeedback} from 'reactstrap'
import CreatableSelect from 'react-select/creatable'

// ** Store & Actions
import {registerSchool, setEdit, setSelectedSchool} from '../store'
import {useDispatch, useSelector} from 'react-redux'


const defaultValues = {
    telephone: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    primaryContact: '',
    alias:'',
    address: '',
    lastName: '',
    firstName: '',
    commissionRate: 0.2
}

const defaultClasses = [
    {value: 'S.1A', label: 'S.1A'},
    {value: 'S.1B', label: 'S.1B'},
    {value: 'S.1C', label: 'S.1C'},
    {value: 'S.2A', label: 'S.2A'},
    {value: 'S.2B', label: 'S.2B'},
    {value: 'S.2C', label: 'S.2C'},
    {value: 'S.3A', label: 'S.3A'},
    {value: 'S.3B', label: 'S.3B'},
    {value: 'S.3C', label: 'S.3C'},
    {value: 'S.4A', label: 'S.4A'},
    {value: 'S.4B', label: 'S.4B'},
    {value: 'S.4C', label: 'S.4C'},
    {value: 'S.5A', label: 'S.5A'},
    {value: 'S.5S', label: 'S.5S'},
    {value: 'S.6A', label: 'S.6A'},
    {value: 'S.6S', label: 'S.6S'},
]

const SidebarNewSchools = ({open, toggleSidebar}) => {
    // ** States
    const [data, setData] = useState(null)
    const [classes, setClasses] = useState(defaultClasses)

    // ** Store Vars
    const dispatch = useDispatch()
    const {loading, selectedSchool, edit} = useSelector((store) => store.schools);

    const checkIsValid = data => {
        if (data.password !== data.confirmPassword) {
            setError("password", {
                type: 'manual'
            })
            setError("confirmPassword", {
                type: 'manual',
                message: 'Passwords do not match.'
            })
            return false;
        }
        return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
    }

    // ** Vars
    const {
        control,
        setValue,
        setError,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: edit ? {} : defaultValues});

    // ** Function to handle form submit
    const onSubmit = data => {
        setData(data)
        const {name, address, primaryContact,alias} = data;
        const editData = {name, address, primaryContact,alias};
        const formData = edit ? editData : data;

        if (checkIsValid(formData)) {
            toggleSidebar()
            const user = {
                role: "ROLE_SCHOOL",
                accountType: "SCHOOL_ADMIN",
                department: "Bursary",
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.primaryContact,
                password: data.password,
                telephone: data.telephone
            }
            const payload = {
                id: selectedSchool ? selectedSchool.id : null,
                primaryContact: data.primaryContact,
                commissionRate: data.commissionRate,
                name: data.name,
                address: data.address,
                alias:data.alias,
                user: edit ? null : user,
                classes: classes.map(r => {
                    return r.label
                })
            }
            dispatch(registerSchool(payload))
        } else {
            const withErrors = {}
            for (const key in data) {
                if (data[key] !== null && data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                    withErrors[key] = ""
                }
            }
        }
    }

    useEffect(() => {
        if (selectedSchool) {
            setValue("name", selectedSchool.name)
            setValue("primaryContact", selectedSchool.primaryContact)
            setValue("address", selectedSchool.address)
            setValue("commissionRate", selectedSchool.commissionRate)
            setValue("alias", selectedSchool.alias)
            setClasses(selectedSchool.classes)
        }
    }, [edit, selectedSchool])

    const handleSidebarClosed = () => {
        for (const key in defaultValues) {
            setValue(key, '')
        }
        reset(defaultValues);
        setData(null);
        dispatch(setEdit(false));
        dispatch(setSelectedSchool(null));
    }

    return (
        <Sidebar
            size='lg'
            className={"root"}
            open={open}
            title='Register School'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-1'>
                    <Label className='form-label' for='name'>
                        School Name <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='name'
                        control={control}
                        render={({field}) => (
                            <Input id='name' placeholder='Enter School Name' invalid={errors.name && true} {...field} />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='alias'>
                        Short Name <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='alias'
                        control={control}
                        render={({field}) => (
                            <Input id='alias' placeholder='Short Name e.g SMAGOK' invalid={errors.alias && true} {...field} />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='primaryContact'>
                        Primary Email Contact <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='primaryContact'
                        control={control}
                        render={({field}) => (
                            <Input
                                id='primaryContact'
                                placeholder='john.doe@example.com'
                                invalid={errors.primaryContact && true}
                                {...field}
                            />
                        )}
                    />
                    <FormText color='muted'>A valid & active email address for the school</FormText>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='commissionRate'>
                        Commission Rate <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='commissionRate'
                        control={control}
                        render={({field}) => (
                            <Input
                                id='commissionRate'
                                invalid={errors.commissionRate && true}
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='address'>
                        Address <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='address'
                        control={control}
                        render={({field}) => (
                            <Input id='address'
                                   style={{minHeight: '50px'}}
                                   type='textarea'
                                   placeholder='School Address' invalid={errors.address && true} {...field} />
                        )}
                    />
                </div>
                <div className='divider'>
                    <div className='divider-text'>Class Rooms</div>
                </div>
                <div className='mb-1' md='6' sm='12'>
                    <Label className='form-label'>Add Class Rooms</Label>
                    <CreatableSelect
                        isClearable={false}
                        theme={selectThemeColors}
                        defaultValue={classes.map(row => {
                            return row
                        })}
                        isMulti
                        name='colors'
                        options={classes}
                        onChange={(v) => setClasses(v)}
                        //onCreateOption={handleCreate}
                        className='react-select'
                        classNamePrefix='select'
                    />
                    <FormText color='muted'>Type a non-listed class to create it.</FormText>
                </div>
                {!edit && (<>
                    <div className='divider'>
                        <div className='divider-text'>Access account information</div>
                    </div>
                    <Row className='mb-1'>
                        <Col md='6' sm='12'>
                            <Label className='form-label' for='firstname'>
                                First Name <span className='text-danger'>*</span>
                            </Label>
                            <Controller
                                name='firstName'
                                control={control}
                                render={({field}) => (
                                    <Input id='firstName' placeholder='John'
                                           invalid={errors.firstName && true} {...field} />
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
                                render={({field}) => (
                                    <Input id='lastName' placeholder='Doe'
                                           invalid={errors.lastName && true} {...field} />
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
                                render={({field}) => (
                                    <Input id='username' placeholder='jdoe'
                                           invalid={errors.username && true} {...field} />
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
                                render={({field}) => (
                                    <Input id='telephone' placeholder='256787XXXXXX'
                                           invalid={errors.telephone && true} {...field} />
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
                                render={({field}) => (
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
                                render={({field}) => (
                                    <Input id='confirmPassword' type="password"
                                           invalid={errors.confirmPassword && true} {...field} />
                                )}
                            />
                            {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
                        </Col>
                    </Row>
                </>)}
                <Row className='mb-1'>
                    <Col md='4' sm='12'>
                        <Button type='submit' color='primary'>
                            {
                                loading && <Spinner color='light' size='sm'/>
                            }
                            {edit ? <span className='ms-50'>Edit</span> : <span className='ms-50'>Register</span>}
                        </Button>
                    </Col>
                    <Col md='4' sm='12'>
                        <Button className='ml-10 m-10 float-right' type='reset' color='secondary' outline
                                onClick={toggleSidebar}>
                            Clear
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Sidebar>
    )
}

export default SidebarNewSchools
