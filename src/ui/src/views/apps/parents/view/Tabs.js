// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

import {useSelector} from "react-redux";

// ** Icons Imports
import {Lock, User} from 'react-feather'

// ** User Components
import SecurityTab from './SecurityTab'
import ParentStudentsList from "@src/views/apps/parents/view/ParentStudentsList";
import Notifications from './Notifications'
import {FaMoneyBillTransfer} from "react-icons/fa6";

const UserTabs = ({ active, toggleTab }) => {
    const {userData} =  useSelector(store=>store.auth)
    const {selectedUser} =  useSelector(store=>store.users)
  return (
    <Fragment>
      <Nav pills className='mb-2'>
          <NavItem>
              <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
                  <User className='font-medium-3 me-50' />
                  <span className='fw-bold'>Students</span>
              </NavLink>
          </NavItem>
              <NavItem>
              <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                  <Lock className='font-medium-3 me-50'/>
                  <span className='fw-bold'>Security</span>
              </NavLink>
          </NavItem>
          <NavItem>
              <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                  <FaMoneyBillTransfer className='font-medium-3 me-50' />
                  <span className='fw-bold'>Transactions</span>
              </NavLink>
          </NavItem>
      </Nav>
      <TabContent activeTab={active}>
          <TabPane tabId='1'>
              <ParentStudentsList data={selectedUser.students} />
          </TabPane>
        <TabPane tabId='2'>
            <SecurityTab />
        </TabPane>


        <TabPane tabId='3'>
          <Notifications />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
