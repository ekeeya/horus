// ** React Imports
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'


// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Coffee, X } from 'react-feather'

// ** Actions
import { handleLogin, setLoading } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  Spinner
  
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import logo from '@src/assets/images/logo/logo-full.png'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>You have successfully logged in as an {role} user to Cashless. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: '',
  username: ''
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight
  const { loading } = useSelector((store) => store.auth);

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      dispatch(setLoading(true))
      useJwt
        .login({ username: data.username, password: data.password })
        .then(res => {
          const data = { ...res.data.user, accessToken: res.data.access_token, refreshToken: res.data.refresh_token}
          dispatch(handleLogin(data))
          ability.update(data.permissions)
          dispatch(setLoading(false))
          navigate(getHomeRouteForLoggedInUser(data.role))
          toast(t => (
            <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'John Doe'} />
          ))
        })
        .catch(err => {
          dispatch(setLoading(false))
          toast.error("Authentication Failed", {position:"bottom-right"})
          setError('username', {
            type: 'manual',
            message: err.response.data.error
          })
        })
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

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='navbar-brand' to='/' onClick={e => e.preventDefault()}>
          <img  style={{height:40, marginTop:"1.55em"}} className='img-fluid'  src={logo} alt="logo" />
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Welcome to Rackup Konnect 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-username'>
                  Username
                </Label>
                <Controller
                  id='username'
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='text'
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
                {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                {
                  loading && <Spinner color='light' size='sm' />
                }
                <span className='ms-50'>Sign in</span>
              </Button>
            </Form>
            <div className='divider my-2'>
              <div className='divider-text'></div>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
