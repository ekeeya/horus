// ** React Imports
import {useState, Fragment, useEffect} from 'react'

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Form,
    CardBody,
    Button,
    Badge,
    Modal,
    Input,
    Label,
    ModalBody,
    ModalHeader,
    Spinner,
    Alert, UncontrolledTooltip
} from 'reactstrap'
import user from '@src/assets/images/profile/user.png'

// ** Third Party Components
import Swal from 'sweetalert2'
import {useForm, Controller} from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// Redux

import {useDispatch, useSelector} from "react-redux";


// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import {
    addUser,
    clearError,
    setSubmitted,
    setUserError,
    setEditing,
    accountManagement
} from "@src/views/apps/user/store";
import {X} from "react-feather";

const roleColors = {
    PARENT: 'light-info',
    ADMIN: 'light-warning',
    POS: 'light-warning',
    SCHOOL: 'light-success',
}

const statusColors = {
    ACTIVE: 'light-success',
    SUSPENDED: 'light-default',
    "IN ACTIVE": 'light-secondary'
}


const MySwal = withReactContent(Swal)

const UserInfoCard = ({selectedUser}) => {
    // ** State
    const [show, setShow] = useState(false)

    const dispatch = useDispatch();
    const {loading, submitted, error} = useSelector((store) => store.users);
    const {userData} = useSelector((store) => store.auth);

    // ** Hook
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: selectedUser.username,
            lastName: selectedUser.lastName,
            firstName: selectedUser.firstName,
            telephone:selectedUser.telephone
        }
    })

    useEffect(() => {
        dispatch(setEditing(true))
        if (error) {
            setTimeout(() => {
                dispatch(setUserError(null));
            }, 8000)
        }
        if (submitted && !error) {
            setShow(false);
        }
    }, [dispatch, error, submitted]);
    // ** render user img
    const renderUserImg = () => {
        return (
            <img
                height='110'
                width='110'
                alt='user-avatar'
                src={user}
                className='img-fluid rounded mt-3 mb-2'
            />
        )
    }
    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {
            //setShow(false)
            const updateData = {...selectedUser, ...data, ...{role: `ROLE_${selectedUser.role}`}}
            dispatch(addUser(updateData));
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                    setError(key, {
                        type: 'manual'
                    })
                }
            }
        }
    }

    const handleReset = () => {
        dispatch(setSubmitted(false));
        reset({
            username: selectedUser.username,
            lastName: selectedUser.lastName,
            firstName: selectedUser.firstName,
            telephone:selectedUser.telephone
        })
    }

    const handleSuspendedClick = () => {
        const action = selectedUser.enabled ? "Disable" : "Enable";
        return MySwal.fire({
            title: 'Are you sure?',
            text: "Continue with this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action} user!`,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const payload = {
                    action: action,
                    account: selectedUser.id
                }
                dispatch(accountManagement(payload))
            }
        })
    }

    return (
        <Fragment>
            <Card>
                <CardBody>
                    <div className='user-avatar-section'>
                        <div className='d-flex align-items-center flex-column'>
                            {renderUserImg()}
                            <div className='d-flex flex-column align-items-center text-center'>
                                <div className='user-info'>
                                    <h4>{selectedUser.fullName}</h4>
                                    <Badge color={roleColors[selectedUser.role]} className='text-capitalize'>
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
                    <div className='info-container'>
                        <ul className='list-unstyled'>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Username:</span>
                                <span>{selectedUser.username}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Email:</span>
                                <span>{selectedUser.email}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Status:</span>
                                <Badge className='text-capitalize' color={statusColors[selectedUser.status]}>
                                    {selectedUser.status}
                                </Badge>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Role:</span>
                                <span className='text-capitalize'>{selectedUser.role}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Contact:</span>
                                <span>{selectedUser.telephone}</span>
                            </li>
                            {selectedUser.schoolId && (<li className='mb-75'>
                                <span className='fw-bolder me-25'>School:</span>
                                <span>{selectedUser.schoolName}</span>
                            </li>)}
                        </ul>
                    </div>
                    <div className='d-flex justify-content-center pt-2'>
                        {
                            (userData.id === selectedUser.id || userData.superUser) &&
                            <Button color='primary' onClick={() => setShow(true)}>
                                Edit
                            </Button>
                        }
                        {
                            (userData.id !== selectedUser.id && userData.superUser) &&
                            (<Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
                                {selectedUser.enabled ? 'Disable' : "Enable"}
                            </Button>)
                        }
                    </div>
                </CardBody>
            </Card>
            <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
                <ModalBody className='px-sm-5 pt-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Edit User Information</h1>
                        <p>Updating user details will receive a privacy audit.</p>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='gy-1 pt-75'>
                            <Col md={6} xs={12}>
                                <Label className='form-label' for='firstName'>
                                    First Name
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='firstName'
                                    name='firstName'
                                    render={({field}) => (
                                        <Input {...field} id='firstName' placeholder='John'
                                               invalid={errors.firstName && true}/>
                                    )}
                                />
                            </Col>
                            <Col md={6} xs={12}>
                                <Label className='form-label' for='lastName'>
                                    Last Name
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='lastName'
                                    name='lastName'
                                    render={({field}) => (
                                        <Input {...field} id='lastName' placeholder='Doe'
                                               invalid={errors.lastName && true}/>
                                    )}
                                />
                            </Col>
                            <Col xs={12}>
                                <Label className='form-label' for='username'>
                                    Username
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='username'
                                    name='username'
                                    render={({field}) => (
                                        <Input {...field} id='username' placeholder='john.doe.007'
                                               invalid={errors.username && true}/>
                                    )}
                                />
                            </Col>
                            <Col md={6} xs={12}>
                                <Label className='form-label' for='billing-email'>
                                    Email
                                </Label>
                                <Input
                                    type='email'
                                    id='billing-email'
                                    defaultValue={selectedUser.email}
                                    placeholder='example@domain.com'
                                />
                            </Col>
                            <Col md={6} xs={12}>
                                <Label className='form-label' for='telephone'>
                                    Contact
                                </Label>
                                <Input id='telephone' defaultValue={selectedUser.telephone} placeholder='256787000000'/>
                            </Col>

                            <Col xs={12} className='text-center mt-2 pt-50'>
                                <Button type='submit' className='me-1' color='primary'>
                                    {
                                        loading && <Spinner color='light' size='sm'/>
                                    }
                                    Update
                                </Button>
                                <Button
                                    type='reset'
                                    color='secondary'
                                    outline
                                    onClick={() => {
                                        handleReset()
                                        setShow(false)
                                    }}
                                >
                                    Discard
                                </Button>
                            </Col>
                        </Row>
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
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default UserInfoCard
