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
    Alert, UncontrolledTooltip, ModalFooter
} from 'reactstrap'
import user from '@src/assets/images/profile/user.png'

// ** Third Party Components
import Swal from 'sweetalert2'
import Flatpickr from 'react-flatpickr'
import {useForm, Controller} from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// Redux

import {useDispatch, useSelector} from "react-redux";

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import {
    clearError,
    setSubmitted,
    setUserError,
    setEditing,
    fetchUsers
} from "@src/views/apps/user/store";
import {Minus, Plus, X} from "react-feather";
import Select from "react-select";
import {registerStudent, walletManagement} from "@src/views/apps/students/store";
import InputNumber from "rc-input-number";
import {addDaysToDate, formatCreditCardNumber, midnight, sleep} from "@utils";

const roleColors = {
    PARENT: 'light-info',
    ADMIN: 'light-primary',
    POS: 'light-warning',
    SCHOOL: 'light-success',
}

const statusColors = {
    ACTIVE: 'light-success',
    SUSPENDED: 'light-warning',
    "IN ACTIVE": 'light-secondary'
}


const MySwal = withReactContent(Swal)

const UserInfoCard = ({selectedStudent}) => {
    // ** State
    const [show, setShow] = useState(false);
    const [useDate, setUseDate] = useState(false)
    const [suspendDays, setSuspendDays] = useState(10);
    const [liftDate, setLiftDate] = useState(new Date());
    const [showSuspend, setShowSuspend] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const [selectedParent, setSelectedParent] = useState({});
    const [parents, setParents] = useState([])

    const dispatch = useDispatch();
    const {loading, submitted, users, error} = useSelector((store) => store.users);
    //const {userData} = useSelector((store) => store.auth);

    // ** Hook
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: {errors}
    } = useForm({
        defaultValues: {
            lastName: selectedStudent.lastName,
            firstName: selectedStudent.firstName
        }
    })

    const handleParentSearch =  val => {
        const configs = {
            page: 0,
            size: 10,
            parents:true,
            name: val
        }
       dispatch(fetchUsers(configs))
    }
    useEffect(()=>{
        if(loading && !error) {
            setShowSuspend(false)
        }
    }, [loading, error]);

    useEffect(() => {
        const classRoom = selectedStudent.school.classes.find(c => c.id === selectedStudent.classId);
        setSelectedClass(classRoom);
        const parent = selectedStudent.primaryParent ? {
            value: selectedStudent.primaryParent.id,
            label: `${selectedStudent.primaryParent.fullName} (${selectedStudent.primaryParent.telephone})`
        } : null;
        setSelectedClass(classRoom)
        if (parent !== null){
            setSelectedParent(parent)
            setParents([parent])
        }

    }, [selectedStudent]);

    useEffect(()=>{

       async function fetchParents(){
           const configs = {
               page: 0,
               size: 10,
               parents:true
           }
           await dispatch(fetchUsers(configs))
        }
        fetchParents().catch((error=>{console.log(error)}))

    }, [])

    useEffect(()=>{
        const ps =   users.map(parent => {
            return {
                value: parent.id,
                label: `${parent.fullName} (${parent.telephone})`
            }
        });
        setParents(ps)
    }, [users])

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
            const formData = data;
            const parent = selectedParent.value
            const classRoom = selectedClass.value;

            formData["id"] = selectedStudent.id;
            formData["parent"] = parent;
            formData["editing"] = true; // in order to override the primary parent
            formData["classRoom"] = classRoom;
            formData["school"] = selectedStudent.school.id;
            dispatch(registerStudent(formData));
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
            username: selectedStudent.username,
            lastName: selectedStudent.lastName,
            firstName: selectedStudent.firstName
        })
    }

    const allowSuspend = () => {
        const statuses = ["DISABLED", "PENDING", "SUSPENDED"];
        return !statuses.includes(selectedStudent.wallet.status);
    }
    const allowEnable = () => {
        const statuses = ["SUSPENDED", "DISABLED"];
        return statuses.includes(selectedStudent.wallet.status)
    }
    const allowDisable = () => {
        const statuses = ["SUSPENDED", "ACTIVE"];
        return statuses.includes(selectedStudent.wallet.status)
    }

    const handleAccountManagmentClick = (action) => {
        let a;
        switch (action) {
            case "enable":
                a = "ACTIVE";
                break;
            case "disable":
                a = "DISABLED";
                break;
            default:
                a = "SUSPENDED"
                break;
        }
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
                    status: a,
                    cardNo: selectedStudent.wallet.cardNo,
                    walletId: selectedStudent.wallet.id
                }
                dispatch(walletManagement(payload));
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
                                    <h4>{selectedStudent.fullName}</h4>
                                    <Badge color={roleColors[selectedStudent.role]} className='text-capitalize'>
                                        {selectedStudent.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
                    <div className='info-container'>
                        <ul className='list-unstyled'>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Class:</span>
                                <span>{selectedStudent.className}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Card:</span>
                                <span>{formatCreditCardNumber(selectedStudent.wallet.cardNo)}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Balance:</span>
                                <span>UGX: {selectedStudent.wallet.balance.toLocaleString()}</span>
                            </li>
                            <li className='mb-75'>
                                <span className='fw-bolder me-25'>Status:</span>
                                <Badge className='text-capitalize' color={statusColors[selectedStudent.wallet.status]}>
                                    {selectedStudent.wallet.status}
                                </Badge>
                            </li>

                            {selectedStudent.primaryParent && (<li className='mb-75'>
                                <span className='fw-bolder me-25'>Guardian:</span>
                                <span className='text-capitalize'>{selectedStudent.primaryParent.fullName}</span>
                            </li>)}

                            {selectedStudent.school && (<li className='mb-75'>
                                <span className='fw-bolder me-25'>School:</span>
                                <span>{selectedStudent.school.name}</span>
                            </li>)}

                        </ul>
                    </div>
                    <div className='d-flex justify-content-center pt-2'>
                        <Button color='primary' onClick={() => setShow(true)}>
                            Edit
                        </Button>

                        {allowEnable() &&
                            <Button className='ms-1' color='success' outline
                                    onClick={()=>handleAccountManagmentClick("enable")}>
                                Enable
                            </Button>}
                        {allowDisable() &&
                            <Button className='ms-1' color='danger' outline
                                    onClick={()=> handleAccountManagmentClick("disable")}>
                                Disable
                            </Button>}
                        {allowSuspend() &&
                            (<Button className='ms-1' color='warning' outline onClick={() => {
                                setShowSuspend(true)
                            }}>
                                Suspend
                            </Button>)
                        }
                    </div>
                </CardBody>
            </Card>
            <Modal
                isOpen={showSuspend}
                className='modal-dialog-centered'
                modalClassName="danger"
            >
                <ModalHeader>Suspend card {selectedStudent.wallet.cardNo}</ModalHeader>
                <ModalBody>
                    <div className='mb-2'>
                        <Row className='gy-1 pt-75'>
                            <Col xs={12}>
                                <div className='form-check form-switch'>
                                    <Input type='switch' name='customSwitch' id='basic-cb-switch'
                                           onChange={() => setUseDate(!useDate)}/>
                                    <Label for='basic-cb-checked' className='form-check-label'>
                                        {!useDate ? "Use Specific Lift Date" : "Use Days"}
                                    </Label>
                                </div>
                            </Col>
                            {
                                !useDate && (
                                    <Col xs={12}>
                                        <Label className='form-label' for='suspendDays'>
                                            Suspend For <small className='text-muted'>(Days)</small>
                                        </Label>
                                        <InputNumber id='basic-number-input' defaultValue={10} upHandler={<Plus/>}
                                                     downHandler={<Minus/>} onChange={(val) => setSuspendDays(val)}/>
                                        <small className='text-muted'>
                                            Specify for how long in days you want this card to be suspended.
                                        </small>
                                    </Col>
                                )
                            }
                            {
                                useDate && (
                                    <Col xs={12}>
                                        <Label className='form-label' for='default-picker'>
                                            List Date
                                        </Label>
                                        <Flatpickr className='form-control' value={liftDate}
                                                   onChange={date => setLiftDate(date)} id='default-picker'/>
                                        <small className='text-muted'>
                                            Select a suspension lift date (system will automatically lift the suspension on
                                            this day.
                                        </small>
                                    </Col>
                                )
                            }
                        </Row>
                        <Alert color='warning' className="mt-1">
                            <div className='alert-body font-small-2'>
                                <p>
                                    <small className='me-lg-1'>
                                        <span className='fw-bold'>Note:</span>
                                    </small>
                                </p>
                                <p>
                                    <small className='me-50'>
                                        Suspending a card will render it un-usable by the student until the suspension
                                        is manually or automatically lifted.
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
                                Collapse
                            </UncontrolledTooltip>
                        </Alert>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => {
                        let date;
                        if (useDate) {
                            date = liftDate[0]
                        }else {
                            const days =  parseInt(suspendDays);
                            const now =  new Date();
                            date = addDaysToDate(now, days);
                        }

                        const payload = {
                            status: "SUSPENDED",
                            cardNo: selectedStudent.wallet.cardNo,
                            walletId: selectedStudent.wallet.id,
                            suspensionLiftDate: midnight(date)
                        }
                        dispatch(walletManagement(payload))
                    }}>
                        Suspend
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
                <ModalBody className='px-sm-5 pt-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Edit Student Information</h1>
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
                            <Col md={6} xs={12}>
                                <div className='mb-1'>
                                    <Label className='form-label' for='selectedClass'>
                                        Class <span className='text-danger'>*</span>
                                    </Label>
                                    <Select
                                        isSearchable
                                        isClearable={true}
                                        value={selectedClass}
                                        placeholder="Select Class"
                                        options={selectedStudent.school.classes}
                                        name="selectedClass"
                                        classNamePrefix='select'
                                        onChange={v => setSelectedClass(v)}
                                    />
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div className='mb-1'>
                                    <Label className='form-label' for='primaryParent'>
                                        Primary Guardian
                                    </Label>
                                    <Select
                                        isSearchable
                                        isClearable={true}
                                        value={selectedParent}
                                        isLoading={loading}
                                        placeholder="Select Guardian"
                                        options={parents}
                                        name="primaryParent"
                                        onInputChange={(val) => handleParentSearch(val)}
                                        classNamePrefix='select'
                                        onChange={v => {
                                            setSelectedParent(v)
                                        }}
                                    />
                                </div>
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
