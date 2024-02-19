// ** React Imports
import {Fragment, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Alert,
  Modal,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader,
  FormFeedback, UncontrolledTooltip, Spinner
} from 'reactstrap'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Third Party Components
import * as yup from 'yup'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import {ChevronRight,  X} from 'react-feather'

import {useSelector, useDispatch} from "react-redux";
import {addUser, clearError,  setEditing} from "@src/views/apps/user/store";


const SignupSchema = yup.object().shape({
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .min(8)
    .oneOf([yup.ref('password'), null], 'Passwords must match')
})


const defaultValues = {
  password: '',
  confirmPassword: ''
}

const AppAuthComponent = ({ setShow, setShowDetailModal }) => {


  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }

  return (
    <Fragment>
      <h1 className='text-center mb-2 pb-50'>Add Authenticator App</h1>
      <h4>Authenticator Apps</h4>
      <div>
        Using an authenticator app like Google Authenticator, Microsoft Authenticator, Authy, or 1Password, scan the QR
        code. It will generate a constantly changing 6 digit code which you will require during login.
      </div>
      <div className='d-flex justify-content-center my-2 py-50'>
        <img src={"https://th.bing.com/th/id/R.89f6bc1850ad7db5dfbd9561d0707b48?rik=jNObqyg8bsrN%2bQ&riu=http%3a%2f%2fwww.pngmart.com%2ffiles%2f10%2fQr-Code-Transparent-PNG.png&ehk=hLPhrgTtlwSJIz%2bYsB0nTIJHHN0lBC6wiFClu8aq6yg%3d&risl=&pid=ImgRaw&r=0"} alt='QR Code' className='img-fluid' width='122' />
      </div>
    </Fragment>
  )
}

const AppSMSComponent = ({ setShow, setShowDetailModal }) => {
  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }
  return (
    <Fragment>
      <h1 className='text-center mb-2 pb-50'>Add your number</h1>
      <h4>Verify Your Mobile Number for SMS</h4>
      <p>Enter your mobile phone number with country code and we will send you a verification code.</p>
      <Row className='gy-1 mt-1'>
        <Col xs={12}>
          <Cleave
            className='form-control'
            placeholder='1 234 567 8900'
            options={{ phone: true, phoneRegionCode: 'US' }}
          />
        </Col>
        <Col className='d-flex justify-content-end' xs={12}>
          <Button outline color='secondary' className='mt-1 me-1' onClick={toggle}>
            Cancel
          </Button>
          <Button color='primary' className='mt-1'>
            <span className='me-50'>Continue</span>
            <ChevronRight size={14} />
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

const SecurityTab = () => {
  // ** Hooks
  const [show, setShow] = useState(false)
  const [authType, setAuthType] = useState('authApp')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(SignupSchema) })


  const {selectedUser, loading, error, submitted} = useSelector(store => store.users)

  const dispatch =  useDispatch();

  useEffect(()=>{
    dispatch(setEditing(true))

    return () => {
      dispatch(setEditing(false))
    };
  }, [dispatch]);
  const onSubmit = data => {
    trigger()
    const formData = {password:data.password,role:`ROLE_${selectedUser.role}`, ...selectedUser};
    console.log(formData)
    dispatch(addUser(formData));
  }
  const handleContinue = () => {
    setShow(false)
    setShowDetailModal(true)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Change Password</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Alert color='warning' className='mb-2'>
              <h4 className='alert-heading'>Ensure that these requirements are met</h4>
              <div className='alert-body'>Minimum 8 characters long, uppercase & symbol</div>
            </Alert>
            <Row>
              <Col className='mb-2' md={6}>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='New Password'
                      htmlFor='password'
                      className='input-group-merge'
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && <FormFeedback className='d-block'>{errors.password.message}</FormFeedback>}
              </Col>
              <Col className='mb-2' md={6}>
                <Controller
                  control={control}
                  id='confirmPassword'
                  name='confirmPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Confirm New Password'
                      htmlFor='confirmPassword'
                      className='input-group-merge'
                      invalid={errors.confirmPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormFeedback className='d-block'>{errors.confirmPassword.message}</FormFeedback>
                )}
              </Col>
              <Col md={6} xs={12}>
                <Button type='submit' color='primary'>
                  Change Password
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
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SecurityTab
