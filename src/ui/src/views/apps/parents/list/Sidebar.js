// ** React Import
import {useEffect, useRef, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'


// ** Third Party Components
import {useForm, Controller} from 'react-hook-form'

// ** Reactstrap Imports
import {Button, Label, FormText, Form, Input, FormFeedback, Spinner, Alert, UncontrolledTooltip} from 'reactstrap'
import {X} from 'react-feather'

// ** Store & Actions
import {addUser, clearError, setUserError} from '../store'
import {useDispatch, useSelector} from 'react-redux'

const defaultValues = {
    //email: '',
    firstName: '',
    telephone: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
}

const SidebarNewUsers = ({open, toggleSidebar}) => {
    // ** States
    const [data, setData] = useState(null);

    const {loading, edit, error, selectedUser} = useSelector((store) => store.users);
    const {userData} = useSelector((store) => store.auth);

    const form = useRef();
    // ** Store Vars
    const dispatch = useDispatch()


    const checkIsValid = data => {
        if (data.password !== data.confirmPassword) {
            setError("password", {
                type: 'manual'
            })
            setError("confirmPassword", {
                type: 'manual',
            })
            dispatch(setUserError("Passwords do not match!"));
            return false;
        }
        return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
    }
    // ** Vars
    const {
        control,
        reset,
        setValue,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues})

    // ** Function to handle form submit
    const onSubmit = data => {
        setData(data)
        const registerData = {
            role: `ROLE_${userData.role}`,
            accountType: "PARENT",
            schoolId: userData.schoolId,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password,
            telephone: data.telephone
        }
        if(data.email != null){
            registerData["email"] =  data.email;
        }
        if (checkIsValid(data)) {
            dispatch(addUser(registerData));
            (!loading && !error) && toggleSidebar();
        } else {
            for (const key in data) {
                if (data[key] !== null && data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                }
            }
        }
    }

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError());
            }, 5000);
        }
    }, [dispatch, error])

    const handleSidebarClosed = () => {
        for (const key in defaultValues) {
            setValue(key, '')
        }
        reset(defaultValues)
        setData(null);
    }
    return (
        <Sidebar
            size='lg'
            open={open}
            title='New Parent'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            <Form onSubmit={handleSubmit(onSubmit)} uncontrolled="true">
                <div className='divider'>
                    <div className='divider-text'>Bio information</div>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='firstName'>
                        First Name <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='firstName'
                        control={control}
                        render={({field}) => (
                            <Input id='firstName' placeholder='John' invalid={errors.firstName && true} {...field} />
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
                        render={({field}) => (
                            <Input id='lastName' placeholder='Doe' invalid={errors.lastName && true} {...field} />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='telephone'>
                        Contact <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='telephone'
                        control={control}
                        render={({field}) => (
                            <Input id='telephone' placeholder='256787XXXXXX'
                                   invalid={errors.telephone && true} {...field} />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='email'>
                        Email <span className='text-muted'>(optional)</span>
                    </Label>
                    <Controller
                        name='email'
                        control={control}
                        render={({field}) => (
                            <Input
                                type='email'
                                id='email'
                                placeholder='john.doe@example.com'
                                //invalid={errors.email && true}
                                {...field}
                            />
                        )}
                    />
                    <FormText color='muted'>Must be a valid e-mail address if provided</FormText>
                </div>
                <div className='divider'>
                    <div className='divider-text'>Account Access Info</div>
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='username'>
                        Username <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='username'
                        control={control}
                        render={({field}) => (
                            <Input id='username' placeholder='johnDoe' invalid={errors.username && true} {...field} />
                        )}
                    />
                </div>

                <div className='mb-1'>
                    <Label className='form-label' for='password'>
                        Password <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='password'
                        control={control}
                        render={({field}) => (
                            <Input id='password' placeholder="********" type="password" invalid={errors.password && true} {...field} />
                        )}
                    />
                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='confirmPassword'>
                        Confirm Password <span className='text-danger'>*</span>
                    </Label>
                    <Controller
                        name='confirmPassword'
                        control={control}
                        render={({field}) => (
                            <Input id='confirmPassword' type="password" placeholder="********"
                                   invalid={errors.confirmPassword && true} {...field} />
                        )}
                    />
                    {errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
                </div>

                <Button type='submit' className='me-1' color='primary'>
                    {
                        loading && <Spinner color='light' size='sm'/>
                    }
                    {edit ? <span className='ms-50'>Edit</span> : <span className='ms-50'>Register</span>}
                </Button>
                <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
                    Cancel
                </Button>

                {
                    error && (
                        <Alert color='danger' className="mt-1">
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
                        </Alert>
                    )
                }
            </Form>
        </Sidebar>
    )
}

export default SidebarNewUsers
