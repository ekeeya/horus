// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import {useSelector} from "react-redux";
// ** Icons Imports
import {  Lock } from 'react-feather'

// ** User Components
import SecurityTab from './SecurityTab'

const UserTabs = ({ active, toggleTab }) => {
    const {userData} =  useSelector(store=>store.auth)
    const {selectedUser} =  useSelector(store=>store.users)
  return (
    <Fragment>
      <Nav pills className='mb-2'>
          {(userData.id === selectedUser.id || userData.superUser || selectedUser.role === "PARENT") &&
              <NavItem>
              <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
                  <Lock className='font-medium-3 me-50'/>
                  <span className='fw-bold'>Security</span>
              </NavLink>
          </NavItem>}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
            {
                (userData.id === selectedUser.id || userData.superUser || selectedUser.role === "PARENT") && (
                    <SecurityTab />
                )
            }

        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
