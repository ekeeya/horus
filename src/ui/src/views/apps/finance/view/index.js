// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import {clearError, getStudent} from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import UserTabs from './Tabs'
import UserInfoCard from './UserInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'
import Loader from "@components/spinner/Loader";
import UILoader from "@components/ui-loader";

const StudentView = () => {
  // ** Store Vars
  const store = useSelector(state => state.students)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getStudent(parseInt(id)))
    return () => {
      dispatch(clearError())
    };
  }, [dispatch])

  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return store.selectedStudent !== null && store.selectedStudent !== undefined ? (
      <UILoader blocking={store.loading} loader={<Loader />}>
        <div className='app-user-view'>
          <Row>
            <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
              <UserInfoCard selectedStudent={store.selectedStudent} />
            </Col>
            <Col xl='8' lg='7' xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
              <UserTabs active={active} toggleTab={toggleTab} />
            </Col>
          </Row>
        </div>
      </UILoader>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Student not found</h4>
      <div className='alert-body'>
        Student with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/students/list'>Student List</Link>
      </div>
    </Alert>
  )
}
export default StudentView;
